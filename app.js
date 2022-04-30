const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//Middleware: Modify incoming data
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`)); //Static Files
//Creating our own Middleware
/*app.use((req,res, next) => {
    console.log('Hello from the Middleware');
    next();
})
*/
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


////Route Handlers
////Routes
//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id/:x?');
//app.post('/api/v1/tours');
//app.patch('/api/v1/tours/:id');
//app.delete('/api/v1/tours/:id');

app.use('/api/v1/tours', tourRouter); //Mounting the router
app.use('/api/v1/users', userRouter); //Mounting the router

//Handling Unhandles Routes
app.all('*', (req, res, next) => {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on this server!`,
  //   });

  //   const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  //   err.statusCode = 404;
  //   err.status = 'fail';
  //next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
//Starting Server
module.exports = app;
