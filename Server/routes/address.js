const express = require('express');
const router = express.Router();
const addresscon = require('../controller/addresscon');

router.post('/addaddress', addresscon.addAddress);
router.get('/getaddress', addresscon.getAddress);
router.delete('/deleteaddress', addresscon.deleteAddress);
router.post('/editaddress', addresscon.editAddress);

module.exports = router;