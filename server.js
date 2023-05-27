const mongoose = require('mongoose');
const dotenv = require(`dotenv`);
dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');

// console.log(process.env);
// app.get('env');

process.on('uncaughtException', (err) => {
  console.log('uncaught Exception... ');
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
  })
  .then(() => console.log('Data Base connected sucsessfuly......'));
//.catch((err) => console.log('Error is Occured...'));

const server = app.listen(process.env.PORT, () => {
  console.log('server started on  port no ', process.env.PORT);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejections ...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
