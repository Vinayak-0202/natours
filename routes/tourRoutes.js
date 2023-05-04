const express = require('express');
const tourController = require('../controllers/tourControllerRoute');
const routes = express.Router();

routes.route('/').get(tourController.getAllTours).post(tourController.addTour);
routes
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = routes;
