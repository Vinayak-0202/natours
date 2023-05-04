const express = require('express');
const userControllers = require('./../controllers/userControllerRoute');

const routes = express.Router();

routes
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.addUser);
routes
  .route('/:id')
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = routes;
