const express = require('express')
const pool = require('./db')

const port = process.env.PORT || 3005
const fs = require('fs');
const app = express()
const cors = require('cors');
app.use(cors());

//routes
app.use(express.json())

pool.connect((err, connection) => {
    
    console.log('connected db')
})



// api

/////////////////////// GET

app.get('/accounts', async (req, res) => {
    try {
        let sql = `SELECT * FROM accounts;`;
        const data = await pool.query(sql);
        res.status(200).json(data.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

/////////////////////// POST

app.post('/insert/accounts', async (req, res) => {
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
})

app.post('/register', async (req, res) => {
    const { full_name, email, password } = req.body
    try {
        let sql = ` INSERT INTO accounts (full_name, email, password, role)
                        VALUES ($1, $2, $3, 2);`;
        await pool.query(sql, [full_name, email, password ]);
        res.status(200).send({ message: "Register account successfully" });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let sql = `SELECT id_account, full_name, email, role, image_data FROM accounts WHERE email=$1 AND password=$2;`;
        const result = await pool.query(sql, [email, password]);

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Login successful', data: result.rows[0] });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
// admin
app.post('/addproduct', async (req, res) => {
    const { id_book, book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description } = req.body;
    try {
        let sql = `INSERT INTO books (id_book, book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`;
        await pool.query(sql, [id_book, book_name, id_genre, author, publisher, yopublication, price, discount, stock, image_data, description]);
        res.status(200).send({ message: "Insert data into table books successfully" });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// thieu anh
app.post('/editproduct', async (req, res) => {
    const { book_id, book_name, genre, author, publisher, yopublication, price, discount, stock,  description } = req.body;
    try {
        let sql = `UPDATE books
                    SET book_name=$2, genre=$3, author=$4, publisher=$5, yopublication=$6, price=$7, discount=$8, stock=$9,  description=$10
                    WHERE book_id=$1;`;
        await pool.query(sql, [book_id, book_name, genre, author, publisher, yopublication, price, discount, stock,  description]);
        res.status(200).send({ message: "Update data into table products successfully" });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
app.get('/products', async (req, res) => {
    try {
        let sql = `SELECT * FROM books;`;
        const data = await pool.query(sql);
        res.status(200).json(data.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get('/product', async (req, res) => {
    const { id_book } = req.query;
    try {
        let sql = `SELECT * FROM books WHERE id_book=$1;`;
        const data = await pool.query(sql, [parseInt(id_book)]);
        res.status(200).json(data.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

//user



// 
// API để tải ảnh lên
// app.post('/upload', upload.single('image'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No file uploaded');
//     }

//     const file = req.file;
//     const imageData = fs.readFileSync(file.path);
//     const imageName = file.originalname;

//     pool.query(
//         'INSERT INTO images (image_name, image_data) VALUES ($1, $2) RETURNING id',
//         [imageName, imageData],
//         (err, result) => {
//             if (err) {
//                 console.error('Database error:', err);
//                 return res.status(500).send('Error saving image');
//             }
//             res.send({ id: result.rows[0].id });
//         }
//     );
// });

// API để lấy ảnh
// app.get('/image/:id', (req, res) => {
//     const { id } = req.params;
//     pool.query('SELECT image_data FROM images WHERE id = $1', [id], (err, result) => {
//         if (err || result.rows.length === 0) {
//             return res.status(404).send('Image not found');
//         }
//         res.contentType('image/jpeg');
//         res.send(result.rows[0].image_data);
//     });
// });

app.listen(port, () => console.log(`Server has started on port: ${port}`))