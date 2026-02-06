/**
 * E-commerce Backend - Express.js Server v2.0
 * Day 4 Homework Submission - Upgraded with JWT Auth, Validation, Logging
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import middleware
const { verifyToken, requireAdmin } = require('./middleware/auth');
const { sanitizeInput, validateProduct, validateRegistration, validateLogin, validateOrder } = require('./middleware/validation');
const { requestLogger, apiLogger, errorLogger } = require('./middleware/logger');

// Import routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');
const reviewRoutes = require('./routes/reviews');

// Import database
const db = require('./data/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ============== MIDDLEWARE ==============

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize input
app.use(sanitizeInput);

// Request logging
app.use(requestLogger);
app.use(apiLogger);

// Make database available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// ============== API ROUTES ==============

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'E-commerce API v2.0 is running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Products API (public)
app.use('/api/products', productRoutes);

// Categories API (public)
app.use('/api/categories', categoryRoutes);

// Users API (auth required for most endpoints)
app.use('/api/users', userRoutes);

// Orders API (auth required)
app.use('/api/orders', verifyToken, orderRoutes);

// Reviews API (auth required for create, public for read)
app.use('/api/reviews', reviewRoutes);

// Admin routes (admin only)
app.use('/api/admin/products', verifyToken, requireAdmin, productRoutes);

// ============== STATIC FILES ==============

// Serve frontend
app.use(express.static('frontend'));

// ============== ROOT ENDPOINTS ==============

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to E-commerce API v2.0',
    version: '2.0.0',
    description: 'Day 4 Homework - Backend Integration with JWT Auth',
    features: [
      'JWT Authentication',
      'Input Validation',
      'Request Logging',
      'Pagination & Search',
      'Categories Management',
      'Product Reviews',
      'Admin Role System'
    ],
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      users: '/api/users',
      orders: '/api/orders',
      reviews: '/api/reviews',
      admin: '/api/admin/products'
    },
    documentation: {
      authentication: 'Bearer token in Authorization header',
      pagination: 'Query params: page, limit',
      search: 'Query param: search',
      filters: 'Query params: category, minPrice, maxPrice, featured'
    }
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'E-commerce API Documentation',
    version: '2.0.0',
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      login: 'POST /api/users/login'
    },
    endpoints: {
      Products: {
        'GET /api/products': 'Get all products (with pagination & filters)',
        'GET /api/products/:id': 'Get product by ID',
        'GET /api/products/featured': 'Get featured products',
        'POST /api/products': 'Create product (admin only)',
        'PUT /api/products/:id': 'Update product (admin only)',
        'DELETE /api/products/:id': 'Delete product (admin only)'
      },
      Categories: {
        'GET /api/categories': 'Get all categories',
        'GET /api/categories/:id': 'Get category by ID',
        'POST /api/categories': 'Create category (admin only)',
        'PUT /api/categories/:id': 'Update category (admin only)',
        'DELETE /api/categories/:id': 'Delete category (admin only)'
      },
      Users: {
        'POST /api/users/register': 'Register new user',
        'POST /api/users/login': 'Login user',
        'GET /api/users/profile': 'Get current user profile',
        'PUT /api/users/profile': 'Update profile',
        'GET /api/users/orders': 'Get user orders'
      },
      Orders: {
        'GET /api/orders': 'Get user orders',
        'POST /api/orders': 'Create new order',
        'GET /api/orders/:id': 'Get order by ID',
        'PUT /api/orders/:id/status': 'Update order status (admin only)',
        'POST /api/orders/:id/cancel': 'Cancel order'
      },
      Reviews: {
        'GET /api/reviews/product/:productId': 'Get product reviews',
        'POST /api/reviews': 'Add review',
        'DELETE /api/reviews/:id': 'Delete review'
      }
    },
    queryParameters: {
      pagination: { page: 'Page number (default: 1)', limit: 'Items per page (default: 10)' },
      filters: { search: 'Search in name/description', category: 'Filter by category', minPrice: 'Minimum price', maxPrice: 'Maximum price', featured: 'Featured products only' },
      sorting: { sortBy: 'Field to sort by', sortOrder: 'asc or desc' }
    }
  });
});

// ============== ERROR HANDLING ==============

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    suggestion: 'Visit /api/docs for API documentation'
  });
});

// Error logger
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============== SERVER START ==============

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🛒  E-commerce API v2.0 - Running Successfully!          ║
║                                                           ║
║   Server:     http://localhost:${PORT}                       ║
║   API:        http://localhost:${PORT}/api                   ║
║   Docs:       http://localhost:${PORT}/api/docs              ║
║   Frontend:   http://localhost:${PORT}                        ║
║                                                           ║
║   Features:                                                ║
║   ✓ JWT Authentication                                    ║
║   ✓ Input Validation                                      ║
║   ✓ Request Logging                                       ║
║   ✓ Pagination & Search                                   ║
║   ✓ Categories & Reviews                                   ║
║   ✓ Admin Role System                                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
  
  // Initialize database
  db.initialize();
});

module.exports = app;
