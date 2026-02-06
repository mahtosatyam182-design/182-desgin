/**
 * Review Routes - Product Reviews System
 * Day 4 Homework - Backend Integration Upgrade v2.0
 */

const express = require('express');
const router = express.Router();

const { verifyToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/reviews/product/:productId
 * Get all reviews for a product (public)
 */
router.get('/product/:productId', (req, res) => {
  try {
    const reviews = req.db.reviews.getByProductId(req.params.productId);
    
    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    
    res.json({
      success: true,
      count: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      message: error.message
    });
  }
});

/**
 * GET /api/reviews/user/:userId
 * Get all reviews by a user (auth required)
 */
router.get('/user/:userId', verifyToken, (req, res) => {
  try {
    const reviews = req.db.reviews.getByUserId(req.params.userId);
    
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user reviews',
      message: error.message
    });
  }
});

/**
 * POST /api/reviews
 * Create a new review (auth required)
 */
router.post('/', verifyToken, (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    
    // Validation
    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Product ID and rating are required'
      });
    }
    
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be an integer between 1 and 5'
      });
    }
    
    // Check if product exists
    const product = req.db.products.getById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    const newReview = req.db.reviews.create({
      productId,
      userId,
      userName,
      rating,
      comment: comment || ''
    });
    
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: newReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create review',
      message: error.message
    });
  }
});

/**
 * DELETE /api/reviews/:id
 * Delete a review (owner or admin only)
 */
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const review = req.db.reviews.getByUserId(req.user.id).find(r => r.id === reviewId);
    
    // Check if user owns the review or is admin
    if (!review && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only delete your own reviews'
      });
    }
    
    const deleted = req.db.reviews.delete(reviewId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete review',
      message: error.message
    });
  }
});

module.exports = router;
