const express = require('express');
const router = express.Router();
const ordercon = require('../controller/ordercon.js');


router.get('/getOrderByID/:id_order', ordercon.getOrderByID);  // lấy đơn hàng theo mã đơn hàng
router.get('/getOrders', ordercon.getOrders); // lấy tất cả đơn hàng
router.post('/addOrderAndOrderDetail', ordercon.addOrderAndOrderDetail);
router.get('/getOrderByAccountID/:id_account', ordercon.getOrderByAccountID);

router.post('/:id_order/status', ordercon.updateOrderStatus);
module.exports = router;
