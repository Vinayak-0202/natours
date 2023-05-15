const express = require('express');
const Tour = require('../models/tours.js');

//This param middleware call back function check the data is in correct format or not
exports.checkBody = (req, res, next) => {
  // console.log(req.body);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Bad Request Responce',
    });
  }

  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    // data: {
    //   toursData,
    // },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; //when we multiply string of digits by 1 it converts the string to number

  //if(id > toursData.length)
  res.status(200).json({
    status: 'success',
    // data: {
    //   tour,
    // },
  });
};

exports.addTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    // data: {
    //   tour: newTour,
    // },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    message: '<Updated Sucessfuly ...>',
  });
};

exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: 'sucsess',
    message: {
      data: '<Deleted Sucessfuly....>',
    },
  });
};
