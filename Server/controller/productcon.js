const express = require('express');
const cors = require('cors');
const pool = require('../db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({ origin: '*' }));

// Middleware for handling JSON and URL encoded data
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.memoryStorage(), // Store image in memory
    limits: { fileSize: 100 * 1024 * 1024 } // Limit file size to 50MB
});

const productcon = {
    addproduct: [
        upload.single('imageData'),
        async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'No file uploaded' });
                }

                const imageData = req.file.buffer;
                const { book_name, id_genre, author, publisher, yopublication, price, discount, stock, description } = req.body;

                if (!book_name || !id_genre || !author || !publisher || !yopublication || !price || !discount || !stock || !description) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const sql = `
                    INSERT INTO books (book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_book;
                `;

                const values = [
                    book_name,
                    parseInt(id_genre),
                    author,
                    publisher,
                    yopublication,
                    parseInt(price),
                    parseInt(discount),
                    parseInt(stock),
                    imageData,
                    description
                ];

                const result = await pool.query(sql, values);
                res.status(200).json({ message: 'Book added successfully', id_book: result.rows[0].id_book });

            } catch (error) {
                console.error('Unexpected error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    ],

    editproduct:[
        upload.single('imageData'),
        async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'No file uploaded' });
                }

                const imageData = req.file.buffer;
                const { id_book, book_name, id_genre, author, publisher, yopublication, price, discount, stock, description } = req.body;

                if ( !id_book||!book_name || !id_genre || !author || !publisher || !yopublication || !price || !discount || !stock || !description) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const sql = `
                    UPDATE books SET (book_name=$2, id_genre=$3, author =$4, publisher=$5, yopublication=$6, price=$7, discount=$8, stock=$9, image_data=$10, description=$11)
                    WHERE id_book=$1;`;

                const values = [
                    parseInt(id_book),
                    book_name,
                    parseInt(id_genre),
                    author,
                    publisher,
                    yopublication,
                    parseInt(price),
                    parseInt(discount),
                    parseInt(stock),
                    imageData,
                    description
                ];

                const result = await pool.query(sql, values);
                res.status(200).json({ message: 'Book edited successfully', id_book: result.rows[0].id_book });

            } catch (error) {
                console.error('Unexpected error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    ],

    getProducts: async (req, res) => {
        try {
            const sql = `SELECT id_book, book_name, id_genre, author, publisher, yopublication, price, discount, stock, encode(image_data, 'base64') AS image_data, description FROM books;`;
            const data = await pool.query(sql);
            res.status(200).json(data.rows);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getProductbyID: async (req, res) => {
        const { id_book } = req.query;
        try {
            const sql = `SELECT  id_book, book_name, b.id_genre, author, publisher, yopublication, price, discount, stock, genre, encode(image_data, 'base64') AS image_data, description FROM books as b join genre as g on b.id_genre = g.id_genre WHERE id_book=$1;`;
            const data = await pool.query(sql, [parseInt(id_book)]);
            res.status(200).json(data.rows);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getProductByGenre: async (req, res) => {
        const { id_genre } = req.query;  // Use req.query instead of req.body
        try {
            const sql = `
                SELECT 
                    id_book, book_name, author, publisher, yopublication, price, discount, stock, 
                    encode(image_data, 'base64') AS image_data, description 
                FROM books 
                WHERE id_genre=$1;
            `;
            const data = await pool.query(sql, [parseInt(id_genre)]);
            res.status(200).json(data.rows);
    
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    
    deleteProductbyID: async (req, res) => {
        const { id_book } = req.query;
        try {
            const sql = `DELETE FROM books WHERE id_book=$1;`;
            await pool.query(sql, [parseInt(id_book)]);
            res.status(200).json({ message: "Book deleted successfully" });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getProductbyName: async (req, res) => {
        const { book_name } = req.query;
        try {
            const sql = `SELECT * FROM books WHERE book_name=$1;`;
            const data = await pool.query(sql, [book_name]);
            res.status(200).json(data.rows);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = productcon;
