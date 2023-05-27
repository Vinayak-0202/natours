const express = require('express');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync.js');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user,
    },
  });
});

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};
