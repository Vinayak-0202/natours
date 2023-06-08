const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync.js');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPRIES_IN}`,
  });
};

const creatSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPRIES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.eventNames.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token, cookieOption);

  //Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'sucsess',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt: req.body.passwordChangeAt,
  });

  creatSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check email or password actualy exists
  if (!email || !password) {
    return next(new AppError(400, 'please provide the email id and password'));
  }

  //check if the user email id and password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(401, 'Invalid email or password'));
  }

  //if everyThing ok send token to client
  creatSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Get token and check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(401, 'your not  loged in please login to get access ')
    );
  }

  //2)validate the token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3)check if user still exits
  const freshUser = await User.findById(decode.id);

  if (!freshUser)
    return next(
      new AppError(401, 'The user  belonging to this token no longer exits')
    );

  //4)check user changes password after token issued
  if (freshUser.changePasswordAfter(decode.iat)) {
    return next(
      new AppError(401, 'recently password is changed , log in again')
    );
  }

  //Grant Access to the route
  req.user = freshUser;
  next();
});

exports.restrictTO = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError(403, 'you dont have permission to delete the tours')
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(401, 'email is invalid please please provide valid email id')
    );
  }
  //2) genrate the random reset  token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3)send it to current email of user
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit your reset password req and confirm password to ${resetUrl}, if don't 
  forgate the password ignore this message `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid only for 10 min)',
      message,
    });

    res.status(201).json({
      status: 'sucess',
      message: 'Token is sent to your email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpirIn = undefined;
    await user.save({ validateBeforeSave: false });

    return new AppError(
      500,
      'There was error in sending the email try again later'
    );
  }

  next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on token
  const hasedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hasedToken,
    passwordResetExpirIn: { $gt: Date.now() },
  });

  //2) If the token has not expired , and there is user , set the new password
  if (!user) {
    return next(new AppError(400, 'token is invalid or token expires'));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpirIn = undefined;
  await user.save();

  //3) update changePasswordAt property for user
  //4)log the user in, send jwt
  creatSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)get user from collection
  const user = await User.findById(req.user.id).select('+password');

  if (!user) return next(new AppError(401, 'please login to update password'));

  if (!(await user.correctPassword(req.body.password, user.password)))
    return next(new AppError(401, 'Invlid Password enter correct password'));

  user.password = req.body.NewPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  creatSendToken(user, 200, res);
});
