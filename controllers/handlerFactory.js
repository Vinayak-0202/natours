const AppError = require('./../utils/appError.js');
const catchAsync = require('./../utils/catchAsync.js');
const APIFeatures = require('./../utils/apiFeatures.js');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id, (err) => {
      if (err) return next(new AppError(404, 'Invalid doc id'));
    });

    if (!doc) {
      return next(new AppError(404, 'Invalid doc id'));
    }
    res.status(204).json({
      status: 'sucsess',
      message: {
        data: null,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
      (err) => {
        if (err) return next(new AppError(404, 'Invalid document id'));
      }
    );

    if (!doc) {
      console.log('herre is error');
      return next(new AppError(404, 'Invalid document id'));
    }

    res.status(200).json({
      status: 'sucess',
      data: {
        data: doc,
      },
    });
  });

exports.creatOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const newTour= new Tour({});
    // newTour.save();
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        doc: doc,
      },
    });
  });

exports.getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOption) query = query.populate(popOption);
    const doc = await query;

    if (!doc) {
      return next(new AppError(404, 'Invalid document id'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const featuer = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    const doc = await featuer.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
