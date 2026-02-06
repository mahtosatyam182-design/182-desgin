/**
 * Order Routes - Enhanced with JWT Authentication
 * Day 4 Homework - Backend Integration Upgrade v2.0
 */

const express = require('express');
const router = express.Router();

const { verifyToken, requireAdmin } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

/**
 * GET /api/orders
 * Get current user's orders
 */
router.get('/', verifyToken, (req, res) => {
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
 * GET /api/orders/all
 * Get all orders (admin only)
 */
router.get('/all', verifyToken, requireAdmin, (req, res) => {
  try {
    const { status, userId } = req.query;
    
    const orders = req.db.orders.getAll({ status, userId });
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch all orders',
      message: error.message
    });
  }
});

/**
 * GET /api/orders/:id
 * Get order by ID
 */
router.get('/:id', verifyToken, (req, res) => {
  try {
    const order = req.db.orders.getById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Check if user owns the order or is admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: error.message
    });
  }
});

/**
 * POST /api/orders
 * Create new order
 */
router.post('/', verifyToken, validateOrder, (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;
    
    // Calculate total price
    let total = 0;
    const orderItems = items.map(item => {
      const product = req.db.products.getById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      return {
        productId: item.productId,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        itemTotal
      };
    });
    
    const newOrder = req.db.orders.create({
      userId,
      items: orderItems,
      total,
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'credit_card'
    });
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
});

/**
 * PUT /api/orders/:id/status
 * Update order status (admin only)
 */
router.put('/:id/status', verifyToken, requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const updatedOrder = req.db.orders.updateStatus(req.params.id, status);
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      message: error.message
    });
  }
});

/**
 * POST /api/orders/:id/cancel
 * Cancel order
 */
router.post('/:id/cancel', verifyToken, (req, res) => {
  try {
    const order = req.db.orders.getById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Check if user owns the order
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    // Only pending orders can be cancelled
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending orders can be cancelled'
      });
    }
    
    const cancelledOrder = req.db.orders.cancel(order.id);
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: cancelledOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order',
      message: error.message
    });
  }
});

module.exports = router;
