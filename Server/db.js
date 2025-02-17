require('dotenv').config(); 

const { Pool } = require('pg');
const fs = require('fs');
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync('./ca.pem'), 
        rejectUnauthorized: true, 
    },
});

module.exports = pool;
