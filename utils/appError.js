class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    (this.statusCode = statusCode),
      (this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error');
    console.log('in appError.js ');
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
