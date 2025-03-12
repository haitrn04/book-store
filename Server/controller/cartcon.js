const pool = require('../db');
pool.connect((err, connection) => {});

const cartcon = {
    addToCart: async (req, res) => {
        const { id_account, id_product, quantity } = req.body;
        try {
            let sql = `INSERT INTO cart (id_account, id_product, quantity)
                       VALUES ($1, $2, $3);`;
            await pool.query(sql, [id_account, id_product, quantity]);
            res.status(200).send({ message: "Product added to cart successfully" });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    getCart: async (req, res) => {
        const { id_account } = req.query;
        try {
            let sql = `SELECT * FROM cart WHERE id_account=$1;`;
            const { rows } = await pool.query(sql, [id_account]);
            res.status(200).send(rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    deleteCart: async (req, res) => {
        const { id_account, id_product } = req.query;
        try {
            let sql = `DELETE FROM cart WHERE id_account=$1, id_account=$2;`;
            await pool.query(sql, [id_account, id_product]);
            res.status(200).send({ message: "Product deleted from cart successfully" });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
    changeQuantity: async (req, res) => {
        const {id_account, id_product, quant} = req.body;
        try {
            let sql =`UPDATE cart SET (quantity=$3) WHERE id_account=$1, id_account=$2`;
            await pool.query(sql,[id_account, id_product, quant]);
            res.status(200).send({ message: "Product added to cart successfully" })
        } catch (error) {
            
        }
    }
};
module.exports = cartcon;