const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.post('/', orderController.createOrder.bind(orderController));
router.get('/', orderController.getUserOrders.bind(orderController));
router.get('/:id', orderController.getOrderDetails.bind(orderController));
router.post('/:id/cancel', orderController.cancelOrder.bind(orderController));

module.exports = router;