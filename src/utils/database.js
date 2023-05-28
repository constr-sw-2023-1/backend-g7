require('dotenv').config();
const config = require('../utils/config');
const { Pool } = require('pg');

const pool = new Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database
});

module.exports = pool;