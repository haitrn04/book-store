const express = require('express');
const router= express.Router();
const reviewcon = require('../controller/reviewcon');

router.post('/addreview', reviewcon.addReview);
router.get('getBookReview', reviewcon.getBookReviewbyID);
router.delete('delReview', reviewcon.deleteReview);

module.exports = router;