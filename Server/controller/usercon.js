const express = require('express');
const cors = require('cors');
const pool = require('../db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({ origin: '*' }));

// Middleware for handling JSON and URL encoded data
app.use(express.json({ limit: '250mb' }));
app.use(express.urlencoded({ limit: '250mb', extended: true }));

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.memoryStorage(), // Store image in memory
    limits: { fileSize: 250 * 1024 * 1024 } // Limit file size to 50MB
});
pool.connect((err, connection) => {

})
const usercon = {
    getAccounts: async (req, res) => {
        try {
            let sql = `SELECT id_account, email, encode(image_data, 'base64') AS image_data, role, full_name, phone_num, gender, birthday FROM accounts;`;
            const data = await pool.query(sql);
            res.status(200).json(data.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    getGenre: async (req, res) => {
        try {
            let sql = `SELECT * FROM genre;`;
            const data = await pool.query(sql);
            res.status(200).json(data.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    insertAccounts: async (req, res) => {
        const { full_name, email, password, role } = req.body
        try {
            let sql = ` INSERT INTO accounts (full_name, email, password, role)
                            VALUES ($1, $2, $3, $4);`;
            await pool.query(sql, [full_name, email, password, role]);
            res.status(200).send({ message: "Insert data into table accounts successfully" });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    register: async (req, res) => {

        const { full_name, email, password, mobile, gender, birthday } = req.body
        try {
            let sql = ` INSERT INTO accounts (full_name, email, password, role, phone_num, gender, birthday )
                            VALUES ($1, $2, $3, 2, $4, $5, $6);`;
            await pool.query(sql, [full_name, email, password, mobile, gender, birthday]);
            res.status(200).send({ message: "Register successfully" });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    getin4: async (req, res) => {
        const { id_account } = req.query;
        try {
            let sql = `SELECT id_account, email, encode(image_data, 'base64') AS image_data, role, full_name, phone_num, gender, birthday FROM accounts WHERE id_account = $1;`;
            const data = await pool.query(sql, [id_account]);
            res.status(200).json(data.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    editin4: [
        upload.single('image_data'), // Changed from 'imageData' to 'image_data' to match frontend
        async (req, res) => {
            try {
                const { id_account, ...fields } = req.body;
                if (!id_account) {
                    return res.status(400).json({ error: 'Missing account ID' });
                }

                const updates = [];
                const values = [];
                let index = 1;

                for (const key in fields) {
                    if (fields[key]) {  // Only include non-empty fields
                        updates.push(`${key} = $${index}`);
                        values.push(fields[key]);
                        index++;
                    }
                }

                // Handle image upload if present
                if (req.file) {
                    updates.push(`image_data = $${index}`);
                    values.push(req.file.buffer);
                    index++;
                }

                // Check if there are any fields to update
                if (updates.length === 0) {
                    return res.status(400).json({ error: 'No fields to update' });
                }

                // Add id_account as the last parameter
                values.push(parseInt(id_account));
                const sql = `UPDATE accounts SET ${updates.join(', ')} WHERE id_account = $${index}`;

                await pool.query(sql, values);
                res.status(200).json({ message: 'Account edited successfully' });
            } catch (error) {
                console.error('Unexpected error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    ]

}

module.exports = usercon;