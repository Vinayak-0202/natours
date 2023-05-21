const mongoose = require('mongoose');
const slugify = require('slugify');
//creating DataBase Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'tour must have name'],
      unique: true,
      trim: true,
    },
    slug: String,
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
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'tour must have price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'tour must have a description'],
    },
    difficulty: {
      type: String,
      required: [true, 'tour must have a difficult'],
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual properties -- In Mongoose, a virtual is a property that is not stored in MongoDB.
//Virtuals are typically used for computed properties on documents.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
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
//Creating Data model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
