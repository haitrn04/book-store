const express = require('express');
const router = express.Router();
const usercon = require('../controller/usercon');

router.get('/accounts', usercon.getAccounts);
router.get('/genre', usercon.getGenre);
router.post('/register', usercon.register);
router.get('/infor', usercon.getin4);
router.post('/editinfor', usercon.editin4);
router.get('/getusername',usercon.getAccountbyName);
router.post('/changepass', usercon.changePass);
module.exports = router;