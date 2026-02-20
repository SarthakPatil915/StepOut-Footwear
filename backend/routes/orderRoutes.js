const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin routes (before param routes)
router.get('/', authenticate, authorize('admin'), getAllOrders);

// Protected routes
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderDetails);
router.put('/:id/cancel', authenticate, cancelOrder);
router.put('/:id/status', authenticate, authorize('admin'), updateOrderStatus);

// Razorpay Payment Routes
router.post('/payment/create-razorpay-order', authenticate, createRazorpayOrder);
router.post('/payment/verify-razorpay', authenticate, verifyRazorpayPayment);

module.exports = router;
