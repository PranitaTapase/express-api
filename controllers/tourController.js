const express = require('express');
//const fs = require('fs');
const Tour = require('../models/tourModels');

/* exports.checkID = (req, res, next, val) => {
  console.log(`Tour Id is ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};
 */
//create checkBody Middleware
/* exports.checkBody = function (req, res, next) {
  console.log('CheckBody');
  //check if body contains name and price
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Input',
    });
  }
  next();
}; */
/* //read Json data from file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
); */

//Get Request
exports.getAllTours = async (req, res) => {
  //console.log(req.requestTime);
  try {
    //1A.Filtering API request
    //Build Query
    console.log(req.query);
    /*     const tours = await Tour.find({
      difficulty: 'easy',
    }); */

    //const tours = await Tour.find().where('difficulty').equals('easy');

    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    //console.log(req.query,queryObj);

    //1B.Advanced Filtering
    //{difficulty: 'easy', price: {$gte: 1000}}
    //{ difficulty: 'easy', price: { gte: '1000' } }
    //gte,gt,lte,lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    //2.Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    //Execute query
    const tours = await query;
    //Send Response
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//Get data with parameters//:x? optional param
exports.getTour = async (req, res) => {
  //console.log(req.params);
  //const id = req.params.id * 1; //converting string to no
  /* const tour = tours.find((el) => el.id === id);

  //checkId
  /* //if(id > tours.length) {
    if(!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    } */
  /*
  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  }); */
  //MongoDB Data
  try {
    const tour = await Tour.findById(req.params.id); //findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tours: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//Post Request
exports.createTours = async (req, res) => {
  //console.log(req.body);
  try {
    //Create Documents
    // const newTour = new Tout({});
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent',
    });
  }

  //res.end('Done'); //always need to send response to complete req res cycle
};

//Patch Request
exports.updateTours = async (req, res) => {
  try {
    const tour = await Tour.findOneAndUpdate(req.param.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent',
    });
  }
};

//Delete Request
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent',
    });
  }
};
