const express = require('express');
const morgan = require('morgan');
const tourRoutes = require(`${__dirname}/routes/tourRoutes.js`);
const userRoutes = require(`${__dirname}/routes/userRoutes.js`);

const app = express();

//1) MIDLEWAERS
app.use(morgan('dev'));
app.use(express.json()); //it is middleware is function which modify the incoming request data and here it modifies the  data to json format

app.use((req, res, next) => {
  console.log('This is the middlware function ');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
//Creating middleware tourRoutes and userRoutes
app.use('/api/v1/tours', tourRoutes); //mount the routes
app.use('/api/v1/users', userRoutes);

//START SERVER
app.listen(3000, () => {
  console.log('server started on  port no 3000');
});
