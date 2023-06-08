const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//post /:tourId/435355/reviews
//GET /:tourId/45323/reviews/454664
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTO('user'),
    reviewController.setTourIdUser,
    reviewController.creatReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
