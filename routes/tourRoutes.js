const express = require('express');
const tourController = require('../controllers/tourControllerRoute');
const routers = express.Router();
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes.js');

// //POST tour/f2385/reviews
// //GET tour/f2385/reviews
// //GET tour/f2385/reviews/2334df455
routers.use('/:tourId/reviews', reviewRouter);

//Param middlware
// routers.param('id', tourController.checkId);
routers
  .route('/first-5-cheap')
  .get(tourController.aliasQuery, tourController.getAllTours);

routers
  .route('/tour-stats')
  .get(
    authController.protect,
    authController.restrictTO('admin', 'lead-guide'),
    tourController.getTourStats
  );
routers
  .route('/monthly-tour/:year')
  .get(
    authController.protect,
    authController.restrictTO('admin', 'lead-guide'),
    tourController.getMonthlyTour
  );
routers
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTO('admin', 'lead-guide'),
    tourController.addTour
  ); //Using param middleware to check the data format is correct.
routers
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTO('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTO('admin', 'lead-guide'),
    tourController.deleteTour
  );

routers
  .route('/tours-within/:distance/center/:latlang/unit/:unit')
  .get(tourController.getTourWithin);

module.exports = routers;
