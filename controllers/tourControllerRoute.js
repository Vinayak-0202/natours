const express = require('express');
const Tour = require('../models/tours.js');
const AppError = require('./../utils/appError.js');
const catchAsync = require('./../utils/catchAsync.js');
const factory = require('./handlerFactory.js');

//Middleware is used to alias query for user --it set or manuplate the query..
exports.aliasQuery = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,ratingAverage';
  req.query.fields = 'name,duration,difficulty,price,summary';
  next();
};

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   const featuer = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limit()
//     .paginate();
//   const tours = await featuer.query;

//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

exports.getAllTours = factory.getAll(Tour);

// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate({
//     path: 'reviews',
//     select: 'review',
//   });
//   //Tour.findOne({_id:req.param.id})
//   if (!tour) {
//     return next(new AppError(404, 'Invalid Tour id'));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

exports.getTour = factory.getOne(Tour, { path: 'reviews', select: 'review' });

// exports.addTour = catchAsync(async (req, res, next) => {
//   // const newTour= new Tour({});
//   // newTour.save();
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

exports.addTour = factory.creatOne(Tour);

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//       runValidators: true,
//     },
//     (err) => {
//       if (err) return next(new AppError(404, 'Invalid Tour id'));
//     }
//   );

//   if (!tour) {
//     console.log('herre is error');
//     return next(new AppError(404, 'Invalid Tour id'));
//   }
//   res.status(200).json({
//     status: 'sucess',
//     data: {
//       tour,
//     },
//   });
// });
exports.updateTour = factory.updateOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id, (err) => {
//     if (err) return next(new AppError(404, 'Invalid Tour id'));
//   });

//   if (!tour) {
//     return next(new AppError(404, 'Invalid Tour id'));
//   }
//   res.status(204).json({
//     status: 'sucsess',
//     message: {
//       data: null,
//     },
//   });
// });
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        maxprice: { $max: '$price' },
        minprice: { $min: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'sucsessful',
    data: {
      stats,
    },
  });
});

exports.getMonthlyTour = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plans = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  res.status(200).json({
    status: 'sucsessful',
    data: {
      plans,
    },
  });
});

// tours-within/:distance/center/:latlang/unit/:unit
// tours-within/250/center/3405,-4508/unit/:km

exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlang, unit } = req.params;
  const [lat, lang] = latlang.split(',');
  console.log(lat, lang);

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.2;

  if (!lat || !lang) {
    next(new AppError(404, 'please provide longitude and latitude '));
  }

  const tour = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lang, lat], radius] } },
  });

  res.status(200).json({
    status: 'sucess',
    tours: tour.length,
    data: {
      tour,
    },
  });
});

exports.getDistance = catchAsync(async (req, res, next) => {
  const { latlang, unit } = req.params;
  const [lat, lang] = latlang.split(',');
  console.log(lat, lang);

  if (!lat || !lang) {
    next(new AppError(404, 'please provide longitude and latitude '));
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lang * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: 0.001,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'sucess',
    data: {
      distances,
    },
  });
});
