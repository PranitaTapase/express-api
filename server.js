/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => console.log("DB connection successful"));




//Environment Variable
// console.log(app.get('env')); //Set by Express
//console.log(process.env);//Set by Nodejs
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running at ${port}`);
});