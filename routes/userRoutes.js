const express = require('express');
const userControllers = require('./../controllers/userControllerRoute');
const authController = require('./../controllers/authController');
const errorController = require('../controllers/errorController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Protect all middleware after this midlware.
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);
router.delete('/deleteMe', userControllers.deleteMe);

router.patch('/updateMe', userControllers.updateMe);

router.get(
  '/me',

  userControllers.getMe,
  userControllers.getUser
);

router.use(authController.restrictTO('admin'));

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.addUser);
router
  .route('/:id')
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
