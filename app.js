const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

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

//2)ROUTE HANDLERS
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    data: {
      toursData,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; //when we multiply string of digits by 1 it converts the string to number

  const tour = toursData.find((el) => el.id === id);
  //if(id > toursData.length)

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const addTour = (req, res) => {
  //console.log(req.body);
  const newId = toursData[toursData.length - 1].id + 1;
  //Object.assign is used to add new properties to the exisiting object
  const newTour = Object.assign({ id: newId }, req.body);

  //push the new tour to the toursData array
  toursData.push(newTour);
  //write this to the file tours-simple.json
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData), //Json.stringify converts the  java script object to JSON format and write it to the filestring
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > toursData.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'sucess',
    message: '<Updated Sucessfuly ...>',
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > toursData.length) {
    return res.status(204).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'sucsess',
    message: {
      data: '<Deleted Sucessfuly....>',
    },
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};

const addUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3) ROUTES
const tourRoutes = express.Router();
const userRoutes = express.Router();

tourRoutes.route('/').get(getAllTours).post(addTour);
tourRoutes.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRoutes.route('/').get(getAllUsers).post(addUser);
userRoutes.route('/:id').patch(updateUser).delete(deleteUser);

//Creating middleware tourRoutes and userRoutes
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

//SERVER LISTNING
app.listen(3000, () => {
  console.log('server started on  port no 3000');
});
