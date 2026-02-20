const express = require('express');
const { registerUser, loginUser, adminLogin, getUserProfile, updateUserProfile, addAddress, getAddresses, updateAddress, deleteAddress, getAllUsers } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);

// Protected routes
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

// Address routes
router.post('/addresses', authenticate, addAddress);
router.get('/addresses', authenticate, getAddresses);
router.put('/addresses/:addressId', authenticate, updateAddress);
router.delete('/addresses/:addressId', authenticate, deleteAddress);

// Admin routes
router.get('/users', authenticate, authorize('admin'), getAllUsers);

module.exports = router;
