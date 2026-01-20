const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderDetails);
router.put('/:id/cancel', authenticate, cancelOrder);

// Admin routes
router.get('/', authenticate, authorize('admin'), getAllOrders);
router.put('/:id/status', authenticate, authorize('admin'), updateOrderStatus);

module.exports = router;
