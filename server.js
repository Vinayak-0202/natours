const dotenv = require(`dotenv`);
dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');

// console.log(process.env);
// app.get('env');
app.listen(process.env.PORT, () => {
  console.log('server started on  port no 3000');
});
