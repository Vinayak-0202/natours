const mongoose = require('mongoose');

//creating DataBase Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tour must have name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'tour must have price'],
  },
});

//Creating Data model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
