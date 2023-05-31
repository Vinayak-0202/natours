const express = require('express');
const userControllers = require('./../controllers/userControllerRoute');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.addUser);
router
  .route('/:id')
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
