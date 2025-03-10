const express = require('express');
const router = express.Router();
const ordercon = require('../controller/ordercon.js');


router.get('/getOrderByID/:id_order', ordercon.getOrderByID);
router.get('/getOrders', ordercon.getOrders);
router.post('/addOrderAndOrderDetail', ordercon.addOrderAndOrderDetail);

module.exports = router;
