const express = require('express');
const router = express.Router();
const productcon = require('../controller/productcon');

router.get('/getproducts', productcon.getProducts);
router.get('/getproductbyid', productcon.getProductbyID);
router.post('/addproduct', productcon.addproduct);
router.post('/editproduct', productcon.editproduct);
router.delete('/deleteproduct', productcon.deleteProductbyID);
router.get('/getproductbygenre', productcon.getProductByGenre); 
router.get('/getproductbyname', productcon.findProduct);
module.exports = router;