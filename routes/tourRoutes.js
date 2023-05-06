const express = require('express');
const tourController = require('../controllers/tourControllerRoute');
const routers = express.Router();

//Param middlware
routers.param('id', tourController.checkId);

routers.route('/').get(tourController.getAllTours).post(tourController.addTour);
routers
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = routers;
