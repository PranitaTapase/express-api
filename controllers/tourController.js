const express = require('express');

const fs = require('fs');

exports.checkID = (req, res, next, val) => {
  console.log(`Tour Id is ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};
//create checkBody Middleware
exports.checkBody = function (req, res, next) {
  console.log('CheckBody');
  //check if body contains name and price
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Input',
    });
  }
  next();
};
//read Json data from file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Get Request
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

//Get data with parameters//:x? optional param
exports.getTour = (req, res) => {
  //console.log(req.params);
  const id = req.params.id * 1; //converting string to no
  const tour = tours.find((el) => el.id === id);

  //checkId
  /* //if(id > tours.length) {
    if(!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    } */

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};

//Post Request
exports.createTours = (req, res) => {
  //console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );

  //res.end('Done'); //always need to send response to complete req res cycle
};

//Patch Request
exports.updateTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

//Delete Request
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
