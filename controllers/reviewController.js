const express = require('express');
const Review = require('../models/reviewModel');
const APIFeatures = require('./../utils/apiFeatures.js');
const AppError = require('./../utils/appError.js');
const catchAsync = require('./../utils/catchAsync.js');
const factory = require('./handlerFactory.js');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const review = await Review.find(filter);
  res.status(200).json({
    message: 'sucess',
    data: review,
  });
});

exports.creatReview = catchAsync(async (req, res, next) => {
  //Allow nested tour
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    message: 'sucess',
    review: newReview,
  });
});

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);
