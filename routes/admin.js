const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', adminController.getStats.bind(adminController));
router.get('/users', adminController.getAllUsers.bind(adminController));
router.put('/users/:id/role', adminController.updateUserRole.bind(adminController));
router.get('/orders', adminController.getAllOrders.bind(adminController));
router.put('/orders/:id/status', adminController.updateOrderStatus.bind(adminController));

module.exports = router;