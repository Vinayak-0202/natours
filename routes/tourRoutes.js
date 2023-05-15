const express = require('express');
const tourController = require('../controllers/tourControllerRoute');
const routers = express.Router();

//Param middlware
// routers.param('id', tourController.checkId);

routers
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.addTour); //Using param middleware to check the data format is correct.
routers
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = routers;
