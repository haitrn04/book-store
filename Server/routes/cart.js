const express = require('express');
const router = express.Router();
const cartcon = require('../controller/cartcon');

router.post('/addtocart', cartcon.addToCart);
router.get('/getcart', cartcon.getCart);
router.delete('/deletecart', cartcon.deleteCart);
router.post('/changequant', +cartcon.changeQuantity);
module.exports = router;