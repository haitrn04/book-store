const express = require('express');
const pool = require('./db');
const http = require('http');

const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const addressRouter = require('./routes/address');
const orderRouter = require('./routes/order');
const port = process.env.PORT || 3005;
const fs = require('fs');
const app = express();
const cors = require('cors');
app.use(cors({ origin: '*' }));

//routes
app.use(express.json());
const server = http.Server(app);

pool.connect((err, connection) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('connected db');
    }
});

// api

/////////////////////// GET

app.use('/accounts', userRouter);
app.use('/address', addressRouter);
app.use('/order', orderRouter);
/////////////////////// POST
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

app.use('/products', productRouter);

app.post('/editinfor', async (req, res) => {
    const { id_account, full_name, image_data, gender, birthday } = req.body;
    try {
        let sql = `UPDATE accounts
                    SET full_name=$2, image_data=$3, gender=$4, birthday=$5 
                    WHERE id_account=$1;`;
        await pool.query(sql, [id_account, full_name, image_data, gender, birthday]);
        res.status(200).send({ message: "Update data into table accounts successfully" });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.use('/address', addressRouter);

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

server.listen(port, () => console.log(`Server has started on port: ${port}`));