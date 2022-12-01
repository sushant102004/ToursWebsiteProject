const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authController')


router.route('/top-five-tours').get(tourController.getTopFiveTours, tourController.getAllTours)
router.route('/tour-stats').get(tourController.getToursStats)
// router.route('/:year').get(tourController.getMonthlyPlan)
 
router.route('/').get(authController.protectRoute, tourController.getAllTours).post(tourController.addNewTour)
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour)

module.exports = router;