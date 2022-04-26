const express = require('express');
const tourController = require('../controllers/tourController');
//Another way: const {getAlltours, , } = require('');
const router = express.Router();

//router.param('id', tourController.checkID);
//API: Aliasing
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours) // Another way: .get(getAlltours)
  .post(tourController.createTours); //chaining middleware

router
  .route('/:id/:x?')
  .get(tourController.getTour)
  .patch(tourController.updateTours)
  .delete(tourController.deleteTour);

module.exports = router;
