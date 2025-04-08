const express = require('express');
const router = express.Router();
const usercon = require('../controller/usercon');

router.get('/accounts', usercon.getAccounts);
router.post('/register', usercon.register);
router.get('/infor', usercon.getin4);
router.post('/editinfor', usercon.editin4);
router.post('/changepass', usercon.changePass);
router.get('/getCountUser', usercon.getCountUser);
router.get('/genre', usercon.getGenre);
module.exports = router;
