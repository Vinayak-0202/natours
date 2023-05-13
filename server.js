const mongoose = require('mongoose');
const dotenv = require(`dotenv`);
dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');

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

//creating schema for our database
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

const testTour = new Tour({
  name: 'the Himalayas',
  rating: 4.7,
  price: 40000,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log('ERORR is Ocured'));

app.listen(process.env.PORT, () => {
  console.log('server started on  port no ', process.env.PORT);
});
