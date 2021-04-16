const Question = require('./Question.js')
const Message = require('./Message.js')

class User {
    messageFromTelegram;
    telegram;
    chatId;
    messageDT;
    userId;
    name;
    firstName;
    lastName;
    #isExists = false;

    constructor(telegram, messageFromTelegram){
        this.messageFromTelegram = messageFromTelegram
        this.telegram = telegram
        this.userId = messageFromTelegram?.from.id || 0,
        this.name = messageFromTelegram?.from.username
        this.firstName = messageFromTelegram?.from.first_name
        this.lastName = messageFromTelegram?.from.last_name
        this.chatId = messageFromTelegram.chat.id
        this.messageDT = messageFromTelegram.date
    }

    get messages(){
        return {
            CREATE_USER_SUCCESS: `
                Привет, ${this.firstName} ${this.lastName}! Это курс по экологии, присоединяйся! 
                \nКаждый день тебе будет приходить задание, отвечай на него в течении дня и прокачивай свои навыки!
                \nНапиши \/задание, что бы получить первое задание.
            `,
            CREATE_USER_ERR: `Неудалось создать нового пользователя. Напишите ${this.telegram.adminTelegram} для решения этой проблемы.`,
            START_USER_EXISTS: `Вы уже проходите курс. Напишите команду ${this.telegram.actions.GET_QUESTION.name} что бы получить новый вопрос.`,
            GET_ANSWER_TODAY_ALREADY_ANSWER: "Вы сегодня уже ответили правильно на все доступные вопросы. Ждите новое задание завтра!",
            ANSWER_CORRECT: "Ответ правильный! Ждите новое задание!",
            ANSWER_CORRECT_ERR: `Ответ правильный, но мы не смогли сохранить ваш ответ. Попробуйте еще раз. Если ошибка не прекратиться, то напишите ${this.telegram.adminTelegram} для решения этой проблемы.`,
            ANSWER_INCORRECT: "Неправильно, попробуйте еще раз",
            ANSWER_CORRECT_ERR: `Ответ неправильный, и мы не смогли сохранить ваш ответ. Попробуйте еще раз. Если ошибка не прекратиться, то напишите ${this.telegram.adminTelegram} для решения этой проблемы.`,
            COURSE_COMPLETED: "Вы прошли курс, спасибо.",
            HAVE_NEW_QUESTION: `Для вас есть новое задание! Напишите команду ${this.telegram.actions.GET_QUESTION.name}, что бы ответить на него.`,
            HAVE_NEW_QUESTION_LAST_NOT_ANSWERED: `Для вас есть новое задание! Но для начала вам необходимо правильно ответить на предыдущее. Напишите команду ${this.telegram.actions.GET_QUESTION.name}, что бы ответить на него.`
        }
    }

    async create(){
        const text = 'INSERT INTO users(name, user_id, chat_id) VALUES($1, $2, $3)';
        const values = [this.name, this.userId, this.chatId]
        try {
            await this.telegram.db.query(text, values)
            return true
        } catch (err) {
            console.log(err.stack)
            return false
        }
    }

    async isExists(){
        if (this.#isExists){
            return this.#isExists
        }

        const text = "SELECT COUNT(*) FROM users WHERE user_id=$1";
        const values = [this.userId]
        try {
            const res = await this.telegram.db.query(text, values)
            this.#isExists = res.rows[0].count > 0
            return this.#isExists
        } catch (err) {
            console.log(err.stack)
            return false
        }
    }

    async registerUser(){
        const isCreated = await this.create();
        if (isCreated){
            this.sendMessageTo(this.chatId, this.messages.CREATE_USER_SUCCESS)
        } else {
            this.sendMessageTo(this.chatId, this.messages.CREATE_USER_ERR)
        }
        
        return isCreated
    }

    createMessage(fromID, toID, text, messageOptions){
        return new Message(this.telegram, this.messageFromTelegram, fromID, toID, text, messageOptions)
    }

    sendMessageTo(toID, text, messageOptions){
        const message = this.createMessage(0, toID, text, messageOptions)
        message.log()
        message.send()
    }

    async canDoAction(){
        const isExists = await this.isExists()
        if(isExists){
            return true
        }

        return await this.registerUser()
    }

    async doActionStart(){
        const isExists = await this.isExists()
        if(isExists){
            this.sendMessageTo(this.chatId, this.messages.START_USER_EXISTS);
            return
        }

        this.registerUser()
    }

    async doActionGetQuestion(){
        const canDoAction = await this.canDoAction()
        if (!canDoAction) return

        const lastAnswer = await this.getLastAnswer();
        let questionID = lastAnswer?.question_id || 0;
        let nextQuestionID = questionID;
        let answer = "";
        let answerOptions = this.telegram.messageOptions;
        
        const prevQuestion = await new Question(this.telegram, questionID).get();
        let question = prevQuestion;
        const lastQuestionInCourse = await prevQuestion.getLastQuestionInCourse();
        let isAllQuestionsAnswered = false;

        if (questionID >= lastQuestionInCourse && lastAnswer?.is_correct_answer ){
            isAllQuestionsAnswered = true
        }

        if (isAllQuestionsAnswered){
            this.sendMessageTo(this.chatId, this.messages.COURSE_COMPLETED, answerOptions)
            return
        }

        if (lastAnswer?.is_correct_answer){
            const answerDT = new Date(lastAnswer.answer_dt);
            const today = new Date();
            if (answerDT.getDate() == today.getDate()){
                this.sendMessageTo(this.chatId, this.messages.GET_ANSWER_TODAY_ALREADY_ANSWER, answerOptions)
                return
            }
            
            nextQuestionID++;
        }

        if (questionID !== nextQuestionID){
            question = await new Question(this.telegram, nextQuestionID).get()
        }
        
        const keyboard = question.keyboard;
        answer = `Вопрос №${nextQuestionID}: \n${question.text}`;

        answerOptions = {
            "parse_mode": "Markdown",
            "reply_markup": {  
                "keyboard": keyboard
            }
        }

        this.sendMessageTo(this.chatId, answer, answerOptions)
    }

    async doActionSetAnswer(){
        const canDoAction = await this.canDoAction()
        if (!canDoAction) return
        
        const lastAnswer = await this.getLastAnswer();
        let questionID = lastAnswer?.question_id || 0;
        let answer = "";
        let answerOptions = this.telegram.messageOptions;
        let isCourseCompleted = true;
        
        if (lastAnswer?.is_correct_answer){
            const answerDT = new Date(lastAnswer.answer_dt);
            const today = new Date();
            if (answerDT.getDate() == today.getDate()){
                answer = this.messages.GET_ANSWER_TODAY_ALREADY_ANSWER;
            } else {
                questionID++;
                isCourseCompleted = false
            }
        } else {
            isCourseCompleted = false
        }

        if (!isCourseCompleted){
            let question = await new Question(this.telegram, questionID).get();
            const isCorrectAnswer = question.checkAnswer(this.getAnswer());
            let isSaved;
            if (isCorrectAnswer){
                isSaved = await this.setAnswer(questionID, isCorrectAnswer);
                if (isSaved){
                    answer = this.messages.ANSWER_CORRECT;
                } else {
                    answer = this.messages.ANSWER_CORRECT_ERR;
                    const keyboard = question.keyboard;
                    answerOptions = {
                        "parse_mode": "Markdown",
                        "reply_markup": {  
                            "keyboard": keyboard
                        }
                    }
                }
            } else {
                isSaved = await this.setAnswer(questionID, isCorrectAnswer);
                const keyboard = question.keyboard;
                answerOptions = {
                    "parse_mode": "Markdown",
                    "reply_markup": {  
                        "keyboard": keyboard
                    }
                }
    
                if (isSaved){
                    answer = this.messages.ANSWER_INCORRECT;
                } else {
                    answer = this.messages.ANSWER_INCORRECT_ERR;
                }
            }
        }

        if (answer){
            this.sendMessageTo(this.chatId, answer, answerOptions)
        }
    }

    async setAnswer(questionId, isCorrectAnswer){
        const text = `INSERT INTO users_answers(user_id, question_id, is_correct_answer) VALUES($1, $2, $3);`;
        const values = [this.userId, questionId, isCorrectAnswer];

        try {
            const res = await this.telegram.db.query(text, values);
            return res.rowCount > 0;
        } catch (err) {
            console.log(err.stack);
            return false
        }
    }

    async getLastAnswer(){
        const text = `SELECT * FROM get_user_last_answer($1)`;
        const values = [this.userId];
    
        try {
            const res = await this.telegram.db.query(text, values);
            return res.rows[0];
        } catch (err) {
            console.log(err.stack);
        }
    }

    getAnswer(){
        return this.messageFromTelegram.text.replace(`${this.telegram.actions.ANSWER.name} `, '')
    }
}

module.exports = User