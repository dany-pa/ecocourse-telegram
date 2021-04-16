const TelegramBot = require('node-telegram-bot-api');
const User = require('./User.js')
const Question = require('./Question.js')
const schedule = require('node-schedule');

class Bot {
    adminTelegram;
    bot;
    db;
    messageOptions = {
        "parse_mode": "Markdown",
        "reply_markup": { remove_keyboard: true}
    };
    actions;
    schedulerTime = {
        // https://github.com/node-schedule/node-schedule
        second: "0",
        minute: "0",
        hour: "12",
        day: "*",
        month: "*",
        dayOfWeek: "*",
    };
    scheduler;

    constructor(token, db, actions, adminTelegram){
        this.bot = new TelegramBot(token, {polling: true});
        this.db = db
        this.actions = actions
        this.adminTelegram = adminTelegram
    }

    user(messageFromTelegram){
        return new User(this, messageFromTelegram)
    }

    async sendNewQuestionToAll(){
        try {
            const res = await this.db.query('SELECT chat_id, user_id FROM users');
            let users = res.rows;
            users.forEach(async (u)=>{
                const user = this.user({
                    from: {
                        id: u.user_id
                    },
                    chat: {
                        id: u.chat_id
                    },
                    date: parseInt(new Date().getTime()/1000)
                })
                const lastAnswer = await user.getLastAnswer()
                const isUserStartAnswered = lastAnswer !== undefined;
                if (!isUserStartAnswered) return
                
                let questionID = lastAnswer?.question_id || 0;
                const question = await new Question(this, questionID).get();
                const lastQuestionInCourse = await question.getLastQuestionInCourse();

                if (questionID >= lastQuestionInCourse) return
                
                const answerDT = new Date(lastAnswer.answer_dt);
                const today = new Date();
                if (answerDT.getDate() == today.getDate()) return 
                
                if(lastAnswer?.is_correct_answer){
                    user.sendMessageTo(u.chat_id, user.messages.HAVE_NEW_QUESTION)
                } else {
                    user.sendMessageTo(u.chat_id, user.messages.HAVE_NEW_QUESTION_LAST_NOT_ANSWERED);
                }
            });
           
        } catch (err) {
            console.log(err.stack)
            return false
        }
    }

    startScheduler(options = this.schedulerTime){
        const schedulerTimeStr = Object.values(options).join(' ');
        this.scheduler = schedule.scheduleJob(schedulerTimeStr, ()=>{
            this.sendNewQuestionToAll()
        });
    }
}

module.exports = Bot