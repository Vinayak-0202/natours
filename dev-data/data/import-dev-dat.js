const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require(`dotenv`);
dotenv.config({ path: `${__dirname}/../../config.env` });
const Tour = require('./../../models/tours.js');

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
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//IMPORTING DATA TO MONOGODB DATABASE COLLECTION
const importData = async () => {
  try {
    await Tour.create(tours);
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
