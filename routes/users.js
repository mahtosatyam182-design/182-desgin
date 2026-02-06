/**
 * User Routes - Enhanced with JWT Authentication
 * Day 4 Homework - Backend Integration Upgrade v2.0
 */

const express = require('express');
const router = express.Router();

const { generateToken, verifyToken, requireAdmin } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');

/**
 * POST /api/users/register
 * Register new user
 */
router.post('/register', validateRegistration, (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const existingUser = req.db.users.getByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }
    
    const newUser = req.db.users.create({
      name,
      email,
      password
    });
    
    // Generate JWT token
    const token = generateToken(newUser);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
      message: error.message
    });
  }
});

/**
 * POST /api/users/login
 * User login with JWT token generation
 */
router.post('/login', validateLogin, (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = req.db.users.getByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // For demo purposes, accepting any password matching
    // In production, use bcrypt.compare(password, user.password)
    const safeUser = req.db.users.getById(user.id);
    
    const token = generateToken(safeUser);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: safeUser,
        token,
        tokenType: 'Bearer',
        expiresIn: '24h'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

/**
 * GET /api/users/profile
 * Get current user profile (auth required)
 */
router.get('/profile', verifyToken, (req, res) => {
  try {
    const user = req.db.users.getById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
});

/**
 * PUT /api/users/profile
 * Update current user profile (auth required)
 */
router.put('/profile', verifyToken, (req, res) => {
  try {
    const { name, email } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    
    const updatedUser = req.db.users.update(req.user.id, updates);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

/**
 * GET /api/users/orders
 * Get current user's orders (auth required)
 */
router.get('/orders', verifyToken, (req, res) => {
  try {
    const orders = req.db.orders.getByUserId(req.user.id);
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
});

/**
 * GET /api/users
 * Get all users (admin only)
 */
router.get('/', verifyToken, requireAdmin, (req, res) => {
  try {
    const users = req.db.users.getAll();
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID (admin only or self)
 */
router.get('/:id', verifyToken, (req, res) => {
  try {
    // Only allow users to access their own profile or admins
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    const user = req.db.users.getById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

/**
 * PUT /api/users/:id
 * Update user (admin only)
 */
router.put('/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    
    const updatedUser = req.db.users.update(req.params.id, updates);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
});

module.exports = router;
