const pool = require("../db");
pool.connect((err, connection) => {

});

const reviewcon = {
    addReview: async (req, res ) => {
        const {id_order, rating, review_text, created_at, id_book} = req.body;
        try {
            let sql = `INSERT INTO reviews (id_order, rating, review_text, created_at, id_book)
            VALUES ($1, $2, $3, $4, $5);`;
            await pool.query(sql,[id_order, rating, review_text, created_at, id_book]);
            res.status(200).send({ message: "Review added successfully" });
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    },
    getBookReviewbyID: async (req, res) => {
        const id_book = req.body;
        try {
            let sql= `SELECT * FROM reviews WHERE id_book =$1`;
            const data = await pool.query(sql, [id_book]);
            res.status(200).send(data);
        } catch (error) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    getBookReviewbyorderID: async (req, res) => {
        const id_order = req.body;
        try {
            let sql= `SELECT * FROM reviews WHERE id_order =$1`;
            const data = await pool.query(sql, [id_order]);
            res.status(200).send(data);
        } catch (error) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    deleteReview: async (req, res) => {
        const id = req.body;
        try {
            let sql = `DELETE FROM reviews WHERE id = $1;`;
            await pool.query(sql,[id]);
            res.status(200).json({ message: "Review deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500);
        }
    }
}

module.exports = reviewcon;