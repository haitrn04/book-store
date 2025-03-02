const express = require('express');
const router = express.Router();
const productcon = require('../controller/productcon');

router.get('/getproducts', productcon.getProducts);
router.get('/getproductbyid', productcon.getProductbyID);
router.post('/addproduct', productcon.addproduct); // Fix syntax error
router.post('/editproduct', productcon.editproduct);
router.delete('/deleteproduct', productcon.deleteProductbyID);

module.exports = router;