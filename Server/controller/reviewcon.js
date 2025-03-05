const pool = require("../db");
pool.connect((err, connection) => {

});

const reviewcon = {
    addReview: async (req, res ) => {
        const {id_order, rating, review_text, created_at} = req.body;
        try {
            let sql = `INSERT INTO reviews (id_order, rating, review_text, created_at)
            VALUES ();`;
            await pool.query(sql,[id_order, rating, review_text, created_at]);
            res.status(200).send({ message: "Review added successfully" });
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    },
    getReviewbyID: async (req, res) => {
        const id_book = req.body;
        try {
            let sql= `SELECT * FROM reviews WHERE id_book =$1`;
            const data = await pool.query(sql, [id_book]);
            res.status(200).send(data);
        } catch (error) {
            console.error(err);
            res.sendStatus(500);
        }
    }
}

module.exports = reviewcon;