const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoutes = require(`${__dirname}/routes/tourRoutes.js`);
const userRoutes = require(`${__dirname}/routes/userRoutes.js`);

const app = express();

//1) MIDLEWAERS
console.log(process.env.NODE_ENV);
if (!process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json()); //it is middleware is function which modify the incoming request data and here it modifies the  data to json format

app.use((req, res, next) => {
  console.log('This is the middlware function ');
  console.log(req.headers);
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(express.static(`${__dirname}/public`));

//ROUTES
//Creating middleware tourRoutes and userRoutes
app.use('/api/v1/tours', tourRoutes); //mount the routes
app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
  // const error = new Error('Cant determine the route that you enterd');
  // error.statusCode = 404;
  // error.status = 'fail';
  next(new AppError(404, 'Cant determine the route that you enterd'));
});

//Global Error Handling middleware
app.use(globalErrorHandler);
//START SERVER
module.exports = app;
