const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//Middleware: Modify incoming data
app.use(express.json());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));//Static Files
//Creating our own Middleware
app.use((req,res, next) => {
    console.log('Hello from the Middleware');
    next();
})

app.use((req,res, next) =>{
    req.requestTime = new Date().toISOString();
    next();
})

////Route Handlers
////Routes
//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id/:x?');
//app.post('/api/v1/tours');
//app.patch('/api/v1/tours/:id');
//app.delete('/api/v1/tours/:id');

app.use('/api/v1/tours',tourRouter); //Mounting the router
app.use('/api/v1/users',userRouter); //Mounting the router

//Starting Server
module.exports = app;

