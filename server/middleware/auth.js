const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is active
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Account is not active.' });
    }

    // Add user info to request
    req.user = {
      userId: user._id,
      role: user.role,
      phone: user.phone
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access denied. Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

// Specific role middlewares
const requireWorker = authorize('worker');
const requireEmployer = authorize('employer');
const requireAdmin = authorize('admin');

// Optional authentication middleware (for public routes that can show different content for logged-in users)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user && user.status === 'active') {
        req.user = {
          userId: user._id,
          role: user.role,
          phone: user.phone
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Rate limiting middleware for specific actions
const createRateLimiter = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Specific rate limiters
const profileUpdateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 updates per 15 minutes
  'Too many profile updates. Please try again later.'
);

const jobPostLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10, // 10 job posts per hour
  'Too many job posts. Please try again later.'
);

const applicationLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  20, // 20 applications per 15 minutes
  'Too many job applications. Please try again later.'
);

module.exports = {
  auth,
  authorize,
  requireWorker,
  requireEmployer,
  requireAdmin,
  optionalAuth,
  profileUpdateLimiter,
  jobPostLimiter,
  applicationLimiter
};
