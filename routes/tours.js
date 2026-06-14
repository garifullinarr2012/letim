const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', tourController.getAllTours.bind(tourController));
router.get('/:id', tourController.getTourById.bind(tourController));
router.post('/', authenticate, requireAdmin, tourController.createTour.bind(tourController));
router.put('/:id', authenticate, requireAdmin, tourController.updateTour.bind(tourController));
router.delete('/:id', authenticate, requireAdmin, tourController.deleteTour.bind(tourController));

module.exports = router;