const express = require('express');
const cors = require('cors');
const pool = require('../db');
const multer = require('multer');

const app = express();
app.use(cors({ origin: '*' }));

// Middleware for JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Multer configuration for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 250 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: `Unexpected field: ${err.field}. Expected 'imageData'.` });
        }
        return res.status(400).json({ error: err.message });
    }
    next(err);
};

const reviewcon = {
    addReview: [
        upload.single('image_data'), // Updated field name
        handleMulterError,
        async (req, res) => {
            const { id_order, rating, review_text, created_at, id_book } = req.body;
            const imageData = req.file ? req.file.buffer : null;

            try {
                if (!id_order || !rating || !id_book) {
                    return res.status(400).json({ error: 'Missing required fields: id_order, rating, id_book' });
                }

                const fields = ['id_order', 'rating', 'id_book'];
                const values = [id_order, rating, id_book];

                if (review_text) {
                    fields.push('review_text');
                    values.push(review_text);
                }
                if (created_at) {
                    fields.push('created_at');
                    values.push(created_at);
                }
                if (imageData) {
                    fields.push('image_data');
                    values.push(imageData);
                }

                const sql = `INSERT INTO reviews (${fields.join(', ')}) 
                            VALUES (${fields.map((_, i) => `$${i + 1}`).join(', ')}) 
                             RETURNING *`;

                const result = await pool.query(sql, values);
                res.status(201).json({ message: 'Review added successfully', review: result.rows[0] });
            } catch (error) {
                console.error('Error adding review:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    ],
    getBookReviewbyID: async (req, res) => {
        const { id_book } = req.params;
        try {
            if (!id_book) {
                return res.status(400).json({ error: 'Missing id_book' });
            }
            const sql = `SELECT 
                            r.id_order, 
                            r.rating, 
                            r.review_text, 
                            r.created_at, 
                            r.id_book, 
                            r.id, 
                            encode(r.image_data, 'base64') AS image_data,
                            a.full_name AS user_name
                        FROM 
                            reviews r
                        JOIN 
                            orders o ON r.id_order = o.id_order
                        JOIN 
                            accounts acc ON o.id_account = acc.id_account
                        JOIN 
                            address a ON acc.id_account = a.id_account
                        WHERE 
                            r.id_book = $1`;
            const data = await pool.query(sql, [id_book]);
            res.status(200).json(data.rows);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getBookReviewbyIdBookAndIdOrder: async (req, res) => {
        const { id_book, id_order } = req.params;
        try {
            if (!id_book) {
                return res.status(400).json({ error: 'Missing id_book' });
            }
            const sql = `SELECT id_order, rating, review_text, created_at, id_book, id, encode(image_data, 'base64') AS image_data FROM reviews WHERE id_book = $1 and id_order = $2`;
            const data = await pool.query(sql, [id_book, id_order]);
            res.status(200).json(data.rows);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getBookAllReviewCount: async (req, res) => {
        const { id_book } = req.params;
        try {
            if (!id_book) {
                return res.status(400).json({ error: 'Missing id_book' });
            }
            const sql = `SELECT count(id_book) as count, round(avg(rating),2) as rating FROM reviews WHERE id_book = $1`;
            const data = await pool.query(sql, [id_book]);
            res.status(200).json(data.rows);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = reviewcon;