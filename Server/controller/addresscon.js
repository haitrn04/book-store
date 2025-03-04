const express = require('express');
const pool = require('../db');
pool.connect((err, connection) => {
    
})

const addresscon = {
    addAddress: async (req, res) => {
        const { id_account, full_name, phone_number, detailed_address, province, district, ward } = req.body
        try {
            let sql = ` INSERT INTO address (id_account, full_name, phone_number, detailed_address, province, district, ward)
                            VALUES ($1, $2, $3, $4, $5, $6, $7);`;
            await pool.query(sql, [id_account, full_name, phone_number, detailed_address, province, district, ward]);
            res.status(200).send({ message: "Insert data into table address successfully" });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    getAddress: async (req, res) => {
        const { id_account } = req.query;
        try {
            let sql = `SELECT * FROM address WHERE id_account=$1;`;
            const { rows } = await pool.query(sql, [id_account]);
            res.status(200).send(rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    deleteAddress: async (req, res) => {
        const { address_id } = req.query;
        try {
            let sql = `DELETE FROM address WHERE address_id=$1;`;
            await pool.query(sql, [address_id]);
            res.status(200).send({ message: "Delete data from table address successfully" });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    editAddress: async (req, res) => {
        const { address_id, id_account, full_name, phone_number, detailed_address, province, district, ward } = req.body;
        try {
            let sql = `UPDATE address
                        SET full_name=$3, phone_number=$4, detailed_address=$5, province=$6, district=$7, ward=$8
                        WHERE address_id=$1 AND id_account=$2;`;
            await pool.query(sql, [address_id, id_account, full_name, phone_number, detailed_address, province, district, ward]);
            res.status(200).send({ message: "Update data into table address successfully" });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }
}

module.exports = addresscon;