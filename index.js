const Bot = require('./src/Bot.js')
const Message = require('./src/Message.js')
const config = require('./src/config.js')
const db = require('./src/db.js')

const telegramActions = {
    START: {
        name: '/start',
        regexp: /\/start/
    },
    GET_QUESTION: {
        name: '/задание',
        regexp: /\/задание/
    },
    ANSWER: {
        name: '/ответ',
        regexp: /\/ответ/
    },
}

const telegram = new Bot(config.telegram_token, db, telegramActions, '@excelsiorer')
telegram.startScheduler()


telegram.bot.onText(telegram.actions.START.regexp, async (msg) => {
    const user = telegram.user(msg)
    await user.doActionStart()
});

telegram.bot.onText(telegram.actions.GET_QUESTION.regexp, async (msg) => {
    const user = telegram.user(msg)
    await user.doActionGetQuestion()
});

telegram.bot.onText(telegram.actions.ANSWER.regexp, async (msg) => {
    const user = telegram.user(msg)
    await user.doActionSetAnswer()
});

telegram.bot.on('message', async (msg) => {
    const message = new Message(telegram, msg, msg.from.id, 0, msg.text)
    message.log()
});