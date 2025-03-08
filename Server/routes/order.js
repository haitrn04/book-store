const express = require('express');
const router = express.Router();
const ordercon = require('../controller/ordercon.js');

router.post('/addOrderAndOrderDetail', ordercon.addOrderAndOrderDetail);

module.exports = router;