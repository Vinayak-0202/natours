const mongoose = require('mongoose');

//creating DataBase Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tour must have name'],
    unique: true,
    trim: true,
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
  },
  startDates: [Date],
});

//Creating Data model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
