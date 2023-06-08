const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require(`dotenv`);
dotenv.config({ path: `${__dirname}/../../config.env` });
const Tour = require('./../../models/tours.js');
const Review = require('./../../models/reviewModel.js');
const User = require('./../../models/userModel.js');

// console.log(process.env);
// app.get('env');
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
  })
  .then(() => console.log('Data Base connected sucsessfuly......'));

//READING THE JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

//IMPORTING DATA TO MONOGODB DATABASE COLLECTION
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data is added sucseefuly loaded...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA FROM DB
const deleteTourData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data is deleted succsess fully............');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteTourData();
}
console.log(process.argv);
