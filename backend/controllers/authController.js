const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/brevoEmail');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate Random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register User - Send OTP
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user && user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    if (user && !user.isEmailVerified) {
      // Update existing unverified user
      user.name = name;
      user.password = password;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // Create new user
      user = new User({
        name,
        email,
        password,
        role: 'customer',
        otp,
        otpExpiry,
        isEmailVerified: false,
      });
      await user.save();
    }

    // Send OTP via Brevo
    try {
      await sendOTPEmail(email, name, otp);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError.message);
      return res.status(500).json({
        success: false,
        message: 'Registration initiated but failed to send OTP. Please try again.',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration initiated. OTP sent to your email.',
      email,
      requiresOTPVerification: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify OTP and Complete Registration
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if OTP exists and is not expired
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please register again.' });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError.message);
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. Welcome to StepOut!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via Brevo
    try {
      await sendOTPEmail(email, user.name, otp);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to resend OTP. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP resent to your email',
      email,
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
      { $pull: { addresses: { _id: addressId } } },
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

// Update Address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Update address
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      fullName: fullName || user.addresses[addressIndex].fullName,
      phone: phone || user.addresses[addressIndex].phone,
      addressLine1: addressLine1 || user.addresses[addressIndex].addressLine1,
      addressLine2: addressLine2 || user.addresses[addressIndex].addressLine2,
      city: city || user.addresses[addressIndex].city,
      state: state || user.addresses[addressIndex].state,
      pincode: pincode || user.addresses[addressIndex].pincode,
      isDefault: isDefault !== undefined ? isDefault : user.addresses[addressIndex].isDefault,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
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
