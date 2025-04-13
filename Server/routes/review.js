const express = require('express');
const router= express.Router();
const reviewcon = require('../controller/reviewcon');

router.post('/addReview', reviewcon.addReview);
router.get('/getBookReviewbyID/:id_book', reviewcon.getBookReviewbyID);

module.exports = router;