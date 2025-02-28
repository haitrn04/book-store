const express = require('express');
const pool = require('../db');
pool.connect((err, connection) => {
    
})
const productcon ={
    addproduct: async (req, res) => {
        const {  book_name, id_genre, author, publisher, yopublication, price, discount, stock,image_data, description } = req.body;
        try {
            let sql = `INSERT INTO books ( book_name, id_genre, author, publisher, yopublication, price, discount, stock,image_data, description)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
            await pool.query(sql, [book_name, id_genre, author, publisher, yopublication, price, discount, stock,image_data, description]);
            res.status(200).send({ message: "Insert data into table books successfully" });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    editproduct: async (req, res) => {
        const { id_book, book_name, genre, author, publisher, yopublication, price, discount, stock, image_data,  description } = req.body;
        try {
            let sql = `UPDATE books
                        SET book_name=$2, genre=$3, author=$4, publisher=$5, yopublication=$6, price=$7, discount=$8, stock=$9,  image_data=$10, description=$11
                        WHERE id_book=$1;`;
            await pool.query(sql, [id_book, book_name, genre, author, publisher, yopublication, price, discount, stock, image_data, description]);
            res.status(200).send({ message: "Update data into table products successfully" });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    getProducts: async (req, res) => {
        try {
            let sql = `SELECT * FROM books;`;
            const data = await pool.query(sql);
            res.status(200).json(data.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    getProductbyID: async (req, res) => {
        const { id_book } = req.query;
        try {
            let sql = `SELECT * FROM books WHERE id_book=$1;`;
            const data = await pool.query(sql, [parseInt(id_book)]);
            res.status(200).json(data.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    deleteProductbyID: async(req, res) => {
        const {id_book} = req.query;
        try{
            let sql = `DELETE * FROM books WHERE id_book=$1;`;
            const data = await pool.query(sql, [parseInt(id_book)]);
            res.status(200).json(data.rows);
        } catch(e) {
            res.sendStatus(500)
        }
    }
}
 module.exports = productcon;