const express = require('express');
const userControllers = require('./../controllers/userControllerRoute');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.addUser);
router
  .route('/:id')
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
