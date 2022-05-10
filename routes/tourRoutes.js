const express = require('express');
const tourController = require('../controllers/tourController');
//Another way: const {getAlltours, , } = require('');
const router = express.Router();
const authController = require('../controllers/authController');
//router.param('id', tourController.checkID);
//API: Aliasing
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours) // Another way: .get(getAlltours)
  .post(tourController.createTours); //chaining middleware

router
  .route('/:id/:x?')
  .get(tourController.getTour)
  .patch(tourController.updateTours)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
//
