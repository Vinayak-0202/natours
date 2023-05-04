const express = require('express');
const fs = require('fs');
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    data: {
      toursData,
    },
  });
};

exports.getTour = (req, res) => {
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

exports.addTour = (req, res) => {
  //console.log(req.body);
  const newId = toursData[toursData.length - 1].id + 1;
  //Object.assign is used to add new properties to the exisiting object
  const newTour = Object.assign({ id: newId }, req.body);

  //push the new tour to the toursData array
  toursData.push(newTour);
  //write this to the file tours-simple.json
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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

exports.updateTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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
