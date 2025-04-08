const express = require('express');
const pool = require('./db');
const http = require('http');
require('dotenv').config();

const nodemailer = require('nodemailer');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const addressRouter = require('./routes/address');
const reviewRouter = require('./routes/review');
const orderRouter = require('./routes/order');
const port = process.env.PORT || 3005;
const fs = require('fs');
const app = express();
const cors = require('cors');
app.use(cors({ origin: '*' }));

const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const qs = require('qs');

//routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const server = http.Server(app);

pool.connect((err, connection) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('connected db');
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

// api

/////////////////////// GET

app.use('/accounts', userRouter);
app.use('/address', addressRouter);
app.use('/order', orderRouter);
app.use('/products', productRouter);
app.use('/address', addressRouter);
app.use('/review', reviewRouter);
/////////////////////// POST
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let sql = `SELECT id_account, email, encode(image_data, 'base64') AS image_data, role, full_name, phone_num, gender, birthday FROM accounts WHERE email=$1 AND password=$2;`;
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
app.post('/sendmail', async(req,res)=> {
    const { emailadd,subject, htmlcontent } = req.body;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.Email_User,
            pass: process.env.Email_Password
        
        }
    })
    const mailOptions = {
        from: process.env.Email_User,
        to: emailadd,
        subject: subject,
        html: htmlcontent,
    }
    transporter.sendMail(mailOptions, (err, result) => {
        if (err){
        console.log(err)
            res.json('Opps error occured')
        } else{
            res.json('thanks for e-mailing me');
        }
    })
});

// ZaloPay Payment
app.post('/payment', async (req, res) => {
    const { user_name, total_price, items } = req.body;
    const embed_data = {
        redirecturl: "https://onelink.zalopay.vn/pay-order",
    };

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: user_name,
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: total_price,
        description: `BookStore - ZaloPay payment for the order #${transID}`,
        bank_code: "",
    };
    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order })
        console.log(result.data);
        res.status(200).json({
            data: result.data,
            app_trans_id: order.app_trans_id
        });
    } catch (error) {
        console.log(error.message);
        res.status(500);
    }
});
app.post("/order-status/:app_trans_id", async (req, res) => {
    const app_trans_id = req.params.app_trans_id;
    let postData = {
        app_id: config.app_id,
        app_trans_id: app_trans_id, // Input your app_trans_id
    }

    let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
        method: 'post',
        url: 'https://sb-openapi.zalopay.vn/v2/query',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(postData)
    };

    try {
        const response = await axios(postConfig);
        return res.status(200).json(response.data);
    } catch (error) {
        console.log(error.message);
    }
});

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