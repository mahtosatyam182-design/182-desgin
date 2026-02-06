/**
 * Input Validation Middleware
 * Day 4 Homework - Backend Integration Upgrade
 */

/**
 * Validate product input
 */
const validateProduct = (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters');
  }
  
  if (name && name.length > 100) {
    errors.push('Product name must be less than 100 characters');
  }
  
  if (price !== undefined && (isNaN(price) || price < 0)) {
    errors.push('Price must be a positive number');
  }
  
  if (stock !== undefined && (isNaN(stock) || stock < 0 || !Number.isInteger(stock))) {
    errors.push('Stock must be a non-negative integer');
  }
  
  if (description && description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

/**
 * Validate user registration input
 */
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (password && password.length > 50) {
    errors.push('Password must be less than 50 characters');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

/**
 * Validate user login input
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  
  if (!email) {
    errors.push('Email is required');
  }
  
  if (!password) {
    errors.push('Password is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

/**
 * Validate order input
 */
const validateOrder = (req, res, next) => {
  const { userId, items } = req.body;
  const errors = [];
  
  if (!userId) {
    errors.push('User ID is required');
  }
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Order must contain at least one item');
  }
  
  if (items && Array.isArray(items)) {
    items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item ${index + 1}: Product ID is required`);
      }
      if (!item.quantity || item.quantity < 1 || !Number.isInteger(item.quantity)) {
        errors.push(`Item ${index + 1}: Quantity must be a positive integer`);
      }
    });
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

/**
 * Sanitize input - prevent XSS attacks
 */
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#x27;')
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };
  
  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  next();
};

module.exports = {
  validateProduct,
  validateRegistration,
  validateLogin,
  validateOrder,
  sanitizeInput
};
