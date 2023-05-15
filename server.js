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

app.listen(process.env.PORT, () => {
  console.log('server started on  port no ', process.env.PORT);
});
