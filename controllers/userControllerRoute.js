const express = require('express');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError');

const filterObject = (obj, ...alloweFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (alloweFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Genrate error if user post the password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        401,
        'route is not for the password update please use /updatePassword route '
      )
    );
  }

  //2) update the user document or filter out fields thats not  allow to update
  const filterObjectBody = filterObject(req.body, 'email', 'name');
  //3) update the user document
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    filterObjectBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'sucess',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'sucess',
    data: null,
  });
};
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
