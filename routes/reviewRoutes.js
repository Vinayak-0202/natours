const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//post /:tourId/435355/reviews
//GET /:tourId/45323/reviews/454664

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTO('user'),
    reviewController.setTourIdUser,
    reviewController.creatReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTO('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTO('user', 'admin'),
    reviewController.updateReview
  );

module.exports = router;
