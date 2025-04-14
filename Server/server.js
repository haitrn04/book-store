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
const { log } = require('console');

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

// API lấy thông tin sách từ message người dùng
app.get("/api/book-info", async (req, res) => {
    const message = req.query.message;

    if (!message) {
        return res.status(400).json({ success: false, error: "Thiếu message" });
    }

    const keywordMatch = message.match(/['"]([^'"]+)['"]/);
    const keyword = keywordMatch ? keywordMatch[1].toLowerCase() : null;

    let dbInfo = "";

    if (keyword) {
        try {
            const result = await pool.query(
                `
                SELECT 
                book_name, author, publisher, price, discount, stock, description
                FROM 
                books
                WHERE 
                LOWER(book_name) LIKE LOWER($1) AND is_active = true
                `,
                [`%${keyword}%`]
            );

            if (result.rows.length > 0) {
                dbInfo = result.rows.map((b) => {
                    console.log("Đã tìm thấy:\"", b.book_name, "\"");
                    const discounted = b.discount ? `${b.discount}%` : "0%";
                    return `**${b.book_name}**  
                        - Tác giả: *${b.author}*  
                        - Nhà xuất bản: *${b.publisher}*  
                        - Giá gốc: ${b.price} VNĐ  
                        - Giảm giá: ${discounted}
                        - Giá sau giảm: ${b.price - (b.price * (b.discount / 100))} VNĐ
                        - Còn trong kho: ${b.stock} 
                        - Mô tả: ${b.description?.slice(0, 200)}...`;
                }).join("\n\n");
            } else {
                dbInfo = "Không tìm thấy sách nào trong cơ sở dữ liệu phù hợp với yêu cầu.";
                console.log("Không tìm thấy!");
            }
            return res.json({ success: true, dbInfo });
        } catch (err) {
            console.error("DB error:", err);
            return res.status(500).json({ success: false, error: "Lỗi truy vấn database." });
        }
    } else {
        return res.json({ success: true, dbInfo: "" });
    }
});


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
app.post('/sendmail', async (req, res) => {
    const { emailadd, subject, htmlcontent } = req.body;
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
        if (err) {
            console.log(err)
            res.json('Opps error occured')
        } else {
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

// API để gọi Gemini API
app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt } = req.body;
        const apiKey = process.env.GEMINI_API_KEY; // Lấy API Key từ .env

        const data = {
            contents: [
                {
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
        };
        const response = await axios({
            method: "POST",
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`,
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                key: apiKey,
            },
            data: data,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error);
        res.status(500).json({ error: "Lỗi khi tạo phản hồi từ Gemini" });
    }
});

server.listen(port, () => console.log(`Server has started on port: ${port}`));
