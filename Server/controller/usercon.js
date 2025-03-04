const express = require('express');
const pool = require('../db');
pool.connect((err, connection) => {
    
})
const usercon = {
    getAccounts: async (req, res) => {
        try {
            let sql = `SELECT * FROM accounts;`;
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
            await pool.query(sql, [full_name, email, password, mobile, gender, birthday ]);
            res.status(200).send({ message: "Register successfully" });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    getin4: async (req, res) => {
        const { id_account } = req.query;
        try {
            let sql = `SELECT * FROM accounts WHERE id_account = $1;`;
            const data = await pool.query(sql, [id_account]);
            res.status(200).json(data.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }
}

module.exports = usercon;