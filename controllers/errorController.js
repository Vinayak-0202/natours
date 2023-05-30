const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  console.log('in handleCastError');
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateFiledsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value ${value}, please  use another value`;
  return new AppError(400, message);
};
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const handleValidationError = (err) => {
  const values = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input: ${values.join('. ')}`;
  return new AppError(400, message);
};

const handleJWTError = (err) =>
  new AppError(401, 'Invalid Token, Please login again');

const handleTokenExpire = (err) =>
  new AppError(401, 'Token has expired , log in again');

const sendProdError = (err, res) => {
  //operational , trusted error send messages to clilient
  console.log('inside sendProdError', err.isOperational);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //programing or other unknown error :don't leak unknown error
  } else {
    //log error message
    console.error('There is Error..');
    //send message to client..
    res.status(500).json({
      status: 'fail',
      meaasage: 'Something went wrong..',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('in production error handler');
    let error = Object.assign(err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFiledsDB(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError') error = handleTokenExpire(error);
    sendProdError(error, res);
  }

  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: err.message,
  // });
};
