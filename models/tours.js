const mongoose = require('mongoose');
const slugify = require('slugify');
//const User = require('./userModel');
//const router = require('../routes/reviewRoutes');

// const validator = require('validator');
//creating DataBase Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'tour must have name'],
      unique: true,
      trim: true,
      maxlength: [50, 'the name of the Tour must less than the or equal to 50'],
      minlength: [
        10,
        'the name of the Tour must greater than the or equal to 10',
      ],
      //  validate: [validator.isAlpha, 'Tour must contain only charaecterstics'],
    },
    slug: String,
    secreatTour: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      required: [true, 'tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'tour must have the  gruop size'],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be greater or equal to 1'],
      max: [5, 'rating must less than or equal to 5'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'tour must have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        //THIS FUNCTION Only points to the  current doc on new document creation
        validator: function (val) {
          return val < this.price;
        },
        message: 'the priceDiscount:({VALUE}) must less than the price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'tour must have a description'],
    },
    difficulty: {
      type: String,
      required: [true, 'tour must have a difficult'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'the value must be easy, midium, difficulty',
      },
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//indexing
tourSchema.index({ price: 1, ratingAverage: -1 });
tourSchema.index({ slug: 1 });

//Virtual properties -- In Mongoose, a virtual is a property that is not stored in MongoDB.
//Virtuals are typically used for computed properties on documents.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Document middleware  --> runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidePromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromises);
//   next();
// });

//Query Middleware--> runs before and after the certain query excuted.
//tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secreatTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeAt',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(
    `Query take a ${Date.now() - this.start} milliseconds to excute `
  );
  next();
});

//Aggregate middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secreatTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

//Creating Data model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
