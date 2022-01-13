const express = require('express');
const tourController = require('./../controllers/tourController');
//Another way: const {getAlltours, , } = require(''); 
const router = express.Router();

router.param('id', tourController.checkID);

//create checkBody Middleware
const checkBody = function (req,res, next) {
    console.log('CheckBody');
    //check if body contains name and price
    console.log(req);
    next();
}

router
    .route('/')
    .get(tourController.getAllTours)// Another way: .get(getAlltours)
    .post(tourController.createTours);

router
    .route('/:id/:x?')
    .get(tourController.getTour)
    .patch(checkBody,tourController.updateTours)
    .delete(tourController.deleteTour);

module.exports = router;