let config;
if (process.env.DATABASE_URL){
    config = {
        telegram_token: process.env.TELEGRAM_TOKEN,
        database_url: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
} else {
    config = require('../private/config.js')
}

module.exports = config;