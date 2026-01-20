const express = require('express');
const {
  getAllProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  addReview,
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin routes (must come before :id routes)
router.get('/admin/all-products', authenticate, authorize('admin'), getAdminProducts);
router.post('/', authenticate, authorize('admin'), createProduct);
router.put('/:id', authenticate, authorize('admin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductDetails);

// Protected routes
router.post('/:id/review', authenticate, addReview);

module.exports = router;
