const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync.js');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPRIES_IN}`,
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

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'Sucsess',
    token: token,
    data: {
      user: newUser,
    },
  });
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
  const token = signToken(user._id);
  res.status(200).json({
    status: 'sucsess',
    token,
  });
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

exports.restrictTO = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return next(
        new AppError(403, 'you dont have permission to delete the tours')
      );
    }

    next();
  };
};
