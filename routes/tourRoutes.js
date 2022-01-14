const express = require('express');
const tourController = require('./../controllers/tourController');
//Another way: const {getAlltours, , } = require(''); 
const router = express.Router();

router.param('id', tourController.checkID);



router
    .route('/')
    .get(tourController.getAllTours)// Another way: .get(getAlltours)
    .post(tourController.checkBody,tourController.createTours);//chaining middleware

router
    .route('/:id/:x?')
    .get(tourController.getTour)
    .patch(tourController.checkBody,tourController.updateTours)
    .delete(tourController.deleteTour);

module.exports = router;