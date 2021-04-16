class Message {
    telegram;
    fromID = 0;
    chatId = 0;
    messageOptions;
    
    toID = 0;
    text = "";
    messageDT = "";

    constructor(telegram, messageFromTelegram, fromID, toID, text, messageOptions){
        this.fromID = fromID
        this.toID = toID
        this.text = text

        this.telegram = telegram;
        this.chatId = messageFromTelegram.chat.id;
        this.messageDT = messageFromTelegram.date;
        this.messageOptions = messageOptions;
    }

    log(){
        try {
            this.telegram.db.query(
                `INSERT INTO messages_log("from", "to", "text", "message_dt") VALUES($1, $2, $3, $4);`, 
                [this.fromID, this.toID, this.text, new Date(this.messageDT * 1000)]
            );
        } catch (err) {
            console.log(err.stack);
        }
    }

    send(){
        this.telegram.bot.sendMessage(this.chatId, this.text, this.messageOptions || this.telegram.messageOptions);
    }
}

module.exports = Message