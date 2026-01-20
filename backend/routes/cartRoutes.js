const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getCart);
router.post('/add', authenticate, addToCart);
router.put('/update', authenticate, updateCartItem);
router.delete('/remove', authenticate, removeFromCart);
router.delete('/clear', authenticate, clearCart);

module.exports = router;
