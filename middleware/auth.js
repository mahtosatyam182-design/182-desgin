/**
 * JWT Authentication Middleware
 * Day 4 Homework - Backend Integration Upgrade
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce-secret-key-day4';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate JWT token for user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Verify JWT token middleware
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'No token provided',
      message: 'Please login to access this resource'
    });
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token format',
      message: 'Token should be: Bearer <token>'
    });
  }
  
  const token = parts[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'Please login again'
      });
    }
    
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      message: 'Authentication failed'
    });
  }
};

/**
 * Admin-only middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
      message: 'Admin privileges required'
    });
  }
  next();
};

/**
 * Optional auth - attaches user if token present but doesn't require it
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next();
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next();
  }
  
  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    // Token invalid but continue anyway
  }
  
  next();
};

module.exports = {
  generateToken,
  verifyToken,
  requireAdmin,
  optionalAuth,
  JWT_SECRET
};
