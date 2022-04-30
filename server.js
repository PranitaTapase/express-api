process.on('uncaughtException', (err) => {
  console.log(err.name, ':', err.message);
  console.log('Unhandled Exception. Shutting Down');
  process.exit(1);
});

/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

//Uncaught Exceptions: Errors in sync code

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => console.log("DB connection successful"));
//.catch(err => console.log('ERR'));




//Environment Variable
// console.log(app.get('env')); //Set by Express
//console.log(process.env);//Set by Nodejs
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running at ${port}`);
});

//Handle Unhandled Rejection
process.on('unhandledRejection', err => {
  const msg = err.message;
  console.log(err.name, msg.substring(0,msg.indexOf('(')));
  console.log('Unhandled Rejection. Shutting Down'); 
  server.close(() => {
    process.exit(1); //0: Success; 1: Unhandled exception
  })
})

