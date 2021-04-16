const config = require('./config.js')
const { Pool } = require('pg');
const db = new Pool({
    connectionString: config.database_url,
    ssl: config.ssl
});

module.exports = db