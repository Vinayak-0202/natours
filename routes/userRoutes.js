const express = require('express');
const userControllers = require('./../controllers/userControllerRoute');
const authController = require('./../controllers/authController');
const errorController = require('../controllers/errorController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
router.delete('/deleteMe', authController.protect, userControllers.deleteMe);

router.patch('/updateMe', authController.protect, userControllers.updateMe);

router.get(
  '/me',
  authController.protect,
  userControllers.getMe,
  userControllers.getUser
);
router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.addUser);
router
  .route('/:id')
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
