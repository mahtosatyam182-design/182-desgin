/**
 * Product Routes - Enhanced with Pagination, Search, Filters
 * Day 4 Homework - Backend Integration Upgrade v2.0
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/products
 * Get all products with pagination, search, and filters
 * Query params: page, limit, search, category, minPrice, maxPrice, featured, sortBy, sortOrder
 */
router.get('/', (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      featured,
      sortBy = 'id',
      sortOrder = 'asc'
    } = req.query;
    
    const result = req.db.products.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      featured,
      sortBy,
      sortOrder
    });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

/**
 * GET /api/products/featured
 * Get featured products
 */
router.get('/featured', (req, res) => {
  try {
    const products = req.db.products.getFeatured();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured products',
      message: error.message
    });
  }
});

/**
 * GET /api/products/categories
 * Get all product categories
 */
router.get('/categories', (req, res) => {
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
 * GET /api/products/:id
 * Get product by ID
 */
router.get('/:id', (req, res) => {
  try {
    const product = req.db.products.getById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Get product reviews
    const reviews = req.db.reviews.getByProductId(product.id);
    
    res.json({
      success: true,
      data: {
        ...product,
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

/**
 * POST /api/products
 * Create new product (admin only in routes definition)
 */
router.post('/', (req, res) => {
  try {
    const { name, description, price, category, categoryId, stock, image, sku, featured } = req.body;
    
    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        error: 'Name and price are required'
      });
    }
    
    const newProduct = req.db.products.create({
      name,
      description: description || '',
      price: parseFloat(price),
      category: category || 'Uncategorized',
      categoryId: categoryId || null,
      stock: parseInt(stock) || 0,
      image: image || '',
      sku: sku || '',
      featured: featured || false
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message
    });
  }
});

/**
 * PUT /api/products/:id
 * Update product
 */
router.put('/:id', (req, res) => {
  try {
    const { name, description, price, category, stock, image, featured } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price) updates.price = parseFloat(price);
    if (category) updates.category = category;
    if (stock !== undefined) updates.stock = parseInt(stock);
    if (image !== undefined) updates.image = image;
    if (featured !== undefined) updates.featured = featured;
    
    const updatedProduct = req.db.products.update(req.params.id, updates);
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: error.message
    });
  }
});

/**
 * DELETE /api/products/:id
 * Delete product
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = req.db.products.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

module.exports = router;
