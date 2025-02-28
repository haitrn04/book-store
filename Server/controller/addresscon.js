const express = require('express');
const pool = require('../db');
pool.connect((err, connection) => {
    
})

const addresscon = {
    addAddress: async (req, res) => {
        const { id_account, address, phone } = req.body
        try {
            let sql = ` INSERT INTO address (id_account, address, phone)
                            VALUES ($1, $2, $3);`;
            await pool.query(sql, [id_account, address, phone]);
            res.status(200).send({ message: "Insert data into table address successfully" });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
}

module.exports = addresscon;