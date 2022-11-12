const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController')


router.route('/top-five-tours').get(tourController.getTopFiveTours, tourController.getAllTours)
router.route('/tour-stats').get(tourController.getToursStats)

router.route('/').get(tourController.getAllTours).post(tourController.addNewTour)
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour)

module.exports = router;