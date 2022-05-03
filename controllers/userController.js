const express = require('express');

const fs = require('fs');

//read Json data from file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

////Route Handlers
exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
