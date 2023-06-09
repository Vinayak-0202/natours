const express = require('express');
const Tour = require('../models/tours');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  //1) get tour data from collection
  const tours = await Tour.find();

  //2)Build template
  //3)Reder that template useing tour data from each tour in Tour
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  //1)Get the data for requested tour (including review and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'rating review user',
  });
  //2)Build template

  //3)Render template using data from(1)
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour,
  });
});
