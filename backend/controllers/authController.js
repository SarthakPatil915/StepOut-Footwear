const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: 'customer',
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded admin credentials for demo
    const ADMIN_EMAIL = 'admin@stepout.com';
    const ADMIN_PASSWORD = 'StepOut@123';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Check if admin exists in database, if not create one
    let admin = await User.findOne({ email: ADMIN_EMAIL });

    if (!admin) {
      admin = new User({
        name: 'StepOut Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      });
      await admin.save();
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Address
exports.addAddress = async (req, res) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

    const address = {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { addresses: address } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Addresses
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { addresses: { addressId } } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
