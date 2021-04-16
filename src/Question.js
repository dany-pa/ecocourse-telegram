class Question {
    telegram;
    id;
    text;
    correct_answer;
    course_id;
    is_correct_answer;
    answers;
    constructor(telegram, id){
        this.telegram = telegram
        this.id = id
    }

    async get(){
        if (this.answers){
            return this
        }
        
        const text = 'SELECT * FROM questions WHERE id = $1';
        const values = [this.id]
        try {
            const res = await this.telegram.db.query(text, values);
            const text2 = 'SELECT * FROM answers WHERE question_id = $1';
            const values2 = [this.id]
    
            try {
                const res2 = await this.telegram.db.query(text2, values2);
                let question = res.rows[0];
                this.answers = res2.rows;
                this.correct_answer = question.correct_answer
                this.text = question.question
                this.course_id = question.course_id
                return this
            } catch (err) {
                console.log(err.stack)
                return false
            }
        } catch (err) {
            console.log(err.stack)
            return false
        }
    }

    get keyboard(){
        return this.answers.map(el=>{
            return [{ text: `${this.telegram.actions.ANSWER.name} ${el.answer}` }]
        });
    }

    checkAnswer(answer){
        const answerID = this.answers.filter(el=>el.answer == answer)[0]?.answer_id
        return this.correct_answer == answerID
    }

    async getLastQuestionInCourse(){
        const text = 'SELECT id FROM questions WHERE course_id = $1 ORDER BY id DESC LIMIT 1'
        const values = [this.course_id]
        try {
            const res = await this.telegram.db.query(text, values);
            return res.rows[0].id;
        } catch (err) {
            console.log(err.stack);
            return false
        }
    }
}

module.exports = Question