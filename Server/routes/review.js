const express = require('express');
const router= express.Router();
const reviewcon = require('../controller/reviewcon');

router.post('/addReview', reviewcon.addReview);
router.get('/getBookReviewbyID/:id_book', reviewcon.getBookReviewbyID);
router.get('/getBookReviewbyIdBookAndIdOrder/:id_book/:id_order', reviewcon.getBookReviewbyIdBookAndIdOrder);
router.get('/getBookAllReviewCount/:id_book', reviewcon.getBookAllReviewCount);
module.exports = router;