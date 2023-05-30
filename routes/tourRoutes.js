const express = require('express');
const tourController = require('../controllers/tourControllerRoute');
const routers = express.Router();
const authController = require('../controllers/authController');

//Param middlware
// routers.param('id', tourController.checkId);
routers
  .route('/first-5-cheap')
  .get(tourController.aliasQuery, tourController.getAllTours);

routers.route('/tour-stats').get(tourController.getTourStats);
routers.route('/monthly-tour/:year').get(tourController.getMonthlyTour);
routers
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.addTour); //Using param middleware to check the data format is correct.
routers
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTO('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = routers;
