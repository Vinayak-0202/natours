const express = require('express');
const path = require('path');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoutes = require(`${__dirname}/routes/tourRoutes.js`);
const userRoutes = require(`${__dirname}/routes/userRoutes.js`);
const reivewRoutes = require(`${__dirname}/routes/reviewRoutes.js`);
const viewRoutes = require(`${__dirname}/routes/viewRoutes.js`);
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const app = express();

//setting template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1)Global MIDLEWAERS

//serving static files
//app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//Security http header
app.use(helmet());

console.log(process.env.NODE_ENV);
if (!process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json()); //it is middleware is function which modify the incoming request data and here it modifies the  data to json format

//Limiting the request from same Api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many requrest from this IP please try again after one hour',
});

app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data santization against nosql
app.use(mongoSanitize());

//Data santization against XSS
app.use(xssClean());

//prevent param solution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'price',
      'maxGroupSize',
    ],
  })
);

app.use((req, res, next) => {
  console.log('This is the middlware function ');
  // console.log(req.headers);
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
// app.get('/', (req, res) => {
//   res.status(200).render('base');
// });

//Creating middleware tourRoutes and userRoutes
app.use('/', viewRoutes);
app.use('/api/v1/tours', tourRoutes); //mount the routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reivewRoutes);

app.all('*', (req, res, next) => {
  // const error = new Error('Cant determine the route that you enterd');
  // error.statusCode = 404;
  // error.status = 'fail';
  next(new AppError(404, 'Cant determine the route that you enterd'));
});

const scriptSrcUrls = ['https://unpkg.com/', 'https://tile.openstreetmap.org'];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org'];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

//Global Error Handling middleware
app.use(globalErrorHandler);
//START SERVER
module.exports = app;
