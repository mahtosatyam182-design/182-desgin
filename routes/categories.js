/**
 * Category Routes - Categories Management
 * Day 4 Homework - Backend Integration Upgrade v2.0
 */

const express = require('express');
const router = express.Router();

const { verifyToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/categories
 * Get all categories
 */
router.get('/', (req, res) => {
  try {
    const categories = req.db.categories.getAll();
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

/**
 * GET /api/categories/:id
 * Get category by ID
 */
router.get('/:id', (req, res) => {
  try {
    const category = req.db.categories.getById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    // Get products in this category
    const products = req.db.products.getByCategory(category.id);
    
    res.json({
      success: true,
      data: {
        ...category,
        productCount: products.length,
        products
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category',
      message: error.message
    });
  }
});

/**
 * POST /api/categories
 * Create new category (admin only)
 */
router.post('/', verifyToken, requireAdmin, (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }
    
    // Check if category already exists
    const existingCategory = req.db.categories.getAll().find(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        error: 'Category with this name already exists'
      });
    }
    
    const newCategory = req.db.categories.create({
      name,
      description: description || ''
    });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create category',
      message: error.message
    });
  }
});

/**
 * PUT /api/categories/:id
 * Update category (admin only)
 */
router.put('/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const { name, description } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    
    const updatedCategory = req.db.categories.update(req.params.id, updates);
    
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update category',
      message: error.message
    });
  }
});

/**
 * DELETE /api/categories/:id
 * Delete category (admin only)
 */
router.delete('/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const deleted = req.db.categories.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete category',
      message: error.message
    });
  }
});

module.exports = router;
