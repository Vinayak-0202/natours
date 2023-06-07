const AppError = require('./../utils/appError.js');
const catchAsync = require('./../utils/catchAsync.js');

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