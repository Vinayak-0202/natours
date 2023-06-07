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

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id, (err) => {
    if (err) return next(new AppError(404, 'Invalid Tour id'));
  });

  if (!tour) {
    return next(new AppError(404, 'Invalid Tour id'));
  }
  res.status(204).json({
    status: 'sucsess',
    message: {
      data: null,
    },
  });
});
