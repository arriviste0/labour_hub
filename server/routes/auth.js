const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Employer = require('../models/Employer');
const { auth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for OTP requests
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 OTP requests per windowMs
  message: 'Too many OTP requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Generate OTP (mock implementation - replace with actual SMS service)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// Send OTP
router.post('/otp/send', 
  otpLimiter,
  [
    body('phone').isMobilePhone('en-IN').withMessage('Please enter a valid Indian mobile number'),
    body('role').isIn(['worker', 'employer']).withMessage('Role must be worker or employer')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phone, role } = req.body;

      // Check if user already exists
      let user = await User.findByPhone(phone);
      
      if (user && user.role !== role) {
        return res.status(400).json({ 
          error: 'Phone number already registered with different role' 
        });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store OTP
      otpStore.set(phone, {
        otp,
        expiry: otpExpiry,
        role,
        attempts: 0
      });

      // TODO: Integrate with actual SMS service (Twilio, etc.)
      console.log(`OTP for ${phone}: ${otp}`);

      // In production, send actual SMS
      // await sendSMS(phone, `Your OTP is: ${otp}. Valid for 10 minutes.`);

      res.json({ 
        message: 'OTP sent successfully',
        phone,
        role,
        // Remove in production
        debug: { otp, expiry: new Date(otpExpiry) }
      });

    } catch (error) {
      console.error('OTP send error:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  }
);

// Verify OTP and register/login
router.post('/otp/verify',
  [
    body('phone').isMobilePhone('en-IN').withMessage('Please enter a valid Indian mobile number'),
    body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits'),
    body('role').isIn(['worker', 'employer']).withMessage('Role must be worker or employer')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phone, otp, role } = req.body;

      // Verify OTP
      const storedOTP = otpStore.get(phone);
      
      if (!storedOTP) {
        return res.status(400).json({ error: 'OTP expired or not found' });
      }

      if (storedOTP.otp !== otp) {
        storedOTP.attempts += 1;
        
        if (storedOTP.attempts >= 3) {
          otpStore.delete(phone);
          return res.status(400).json({ error: 'Too many failed attempts. Please request new OTP.' });
        }
        
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      if (storedOTP.role !== role) {
        return res.status(400).json({ error: 'Role mismatch' });
      }

      if (Date.now() > storedOTP.expiry) {
        otpStore.delete(phone);
        return res.status(400).json({ error: 'OTP expired' });
      }

      // OTP verified successfully
      otpStore.delete(phone);

      // Check if user exists
      let user = await User.findByPhone(phone);
      let isNewUser = false;

      if (!user) {
        // Create new user
        user = new User({
          phone,
          role,
          isPhoneVerified: true,
          status: 'active'
        });
        await user.save();
        isNewUser = true;
      } else {
        // Update existing user
        user.isPhoneVerified = true;
        user.lastLogin = new Date();
        user.resetLoginAttempts();
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { userId: user._id, type: 'refresh' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        message: isNewUser ? 'User registered successfully' : 'Login successful',
        token,
        refreshToken,
        user: {
          id: user._id,
          phone: user.phone,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified,
          status: user.status,
          profileCompleted: user.profileCompleted
        },
        isNewUser
      });

    } catch (error) {
      console.error('OTP verify error:', error);
      res.status(500).json({ error: 'Failed to verify OTP' });
    }
  }
);

// Login with password (for employers)
router.post('/login',
  loginLimiter,
  [
    body('phone').isMobilePhone('en-IN').withMessage('Please enter a valid Indian mobile number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['worker', 'employer']).withMessage('Role must be worker or employer')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phone, password, role } = req.body;

      // Find user
      const user = await User.findByPhone(phone);
      
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (user.role !== role) {
        return res.status(400).json({ error: 'Invalid role for this user' });
      }

      if (user.status !== 'active') {
        return res.status(400).json({ error: 'Account is not active' });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(400).json({ error: 'Account is temporarily locked. Please try again later.' });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        await user.incLoginAttempts();
        return res.status(400).json({ error: 'Invalid password' });
      }

      // Reset login attempts on successful login
      await user.resetLoginAttempts();
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { userId: user._id, type: 'refresh' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        message: 'Login successful',
        token,
        refreshToken,
        user: {
          id: user._id,
          phone: user.phone,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified,
          status: user.status,
          profileCompleted: user.profileCompleted
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Set password (for workers or new users)
router.post('/set-password',
  auth,
  [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { password } = req.body;
      const userId = req.user.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.password = password;
      await user.save();

      res.json({ message: 'Password set successfully' });

    } catch (error) {
      console.error('Set password error:', error);
      res.status(500).json({ error: 'Failed to set password' });
    }
  }
);

// Refresh token
router.post('/refresh-token',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { refreshToken } = req.body;

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      
      if (decoded.type !== 'refresh') {
        return res.status(400).json({ error: 'Invalid token type' });
      }

      // Check if user exists
      const user = await User.findById(decoded.userId);
      if (!user || user.status !== 'active') {
        return res.status(400).json({ error: 'User not found or inactive' });
      }

      // Generate new access token
      const newToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token: newToken,
        user: {
          id: user._id,
          phone: user.phone,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified,
          status: user.status,
          profileCompleted: user.profileCompleted
        }
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ error: 'Invalid refresh token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'Refresh token expired' });
      }
      res.status(500).json({ error: 'Failed to refresh token' });
    }
  }
);

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get profile data based on role
    let profile = null;
    if (user.role === 'worker') {
      profile = await Worker.findOne({ userId: user._id });
    } else if (user.role === 'employer') {
      profile = await Employer.findOne({ userId: user._id });
    }

    res.json({
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        status: user.status,
        profileCompleted: user.profileCompleted,
        lastLogin: user.lastLogin
      },
      profile
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    // In a more sophisticated system, you might want to blacklist the token
    // For now, we'll just return success
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Change password
router.post('/change-password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password changed successfully' });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
);

module.exports = router;
