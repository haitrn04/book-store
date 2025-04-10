require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

let sslConfig = {
    ssl: {
        rejectUnauthorized: false,
    },
};

const caPath = path.join(__dirname, 'cacert.pem');

try {
    if (fs.existsSync(caPath)) {
        sslConfig.ssl.ca = fs.readFileSync(caPath);
        sslConfig.ssl.rejectUnauthorized = true;
    } else {
        console.error('Warning: ca.pem file not found. SSL connection may fail.');
    }
} catch (err) {
    console.error('Error reading ca.pem file:', err);
}

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ...sslConfig,
});

module.exports = pool;