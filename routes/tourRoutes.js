const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController')

router.param('id', tourController.checkID)


router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.addNewTour)
router.route('/:id').get(tourController.getSpecificTour)

module.exports = router;