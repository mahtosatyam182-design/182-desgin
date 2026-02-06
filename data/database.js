/**
 * Enhanced Mock Database for E-commerce Application
 * Day 4 Homework - Backend Integration Upgrade
 * Features: Pagination, Search, Categories, Reviews, JWT Auth Support
 */

const { v4: uuidv4 } = require('uuid');

// Helper function to generate image URL with price in Rs
const getImageUrl = (text, price) => {
  const priceText = price ? `Rs${Math.round(price)}` : '';
  const combined = `${text}${priceText ? ' - ' + priceText : ''}`;
  return `https://placehold.co/300x200/667eea/ffffff?text=${encodeURIComponent(combined)}`;
};

// Real product images from Unsplash
const productImages = {
  'Laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
  'Smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop',
  'Wireless Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
  'Cotton T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop',
  'Coffee Maker': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
  'Smart Watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
  'Tablet Pro': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop',
  'Wireless Mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop',
  'Mechanical Keyboard': 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300&h=200&fit=crop',
  'Gaming Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=200&fit=crop',
  'USB-C Hub': 'https://images.unsplash.com/photo-1626255151878-c9f5a7429d5a?w=300&h=200&fit=crop',
  'Portable SSD': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=300&h=200&fit=crop',
  'Webcam HD': 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=300&h=200&fit=crop',
  'Bluetooth Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop',
  'Wireless Earbuds': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop',
  'Studio Microphone': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&h=200&fit=crop',
  'Audio Interface': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
  'DJ Controller': 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=300&h=200&fit=crop',
  'Soundbar': 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300&h=200&fit=crop',
  'Vinyl Player': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=300&h=200&fit=crop',
  'Denim Jacket': 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=200&fit=crop',
  'Running Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
  'Leather Belt': 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=300&h=200&fit=crop',
  'Winter Jacket': 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=200&fit=crop',
  'Sunglasses': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=200&fit=crop',
  'Wool Sweater': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=200&fit=crop',
  'Yoga Pants': 'https://images.unsplash.com/photo-1506619216599-9d16d47faad1?w=300&h=200&fit=crop',
  'Casual Dress': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=200&fit=crop',
  'Blender': 'https://images.unsplash.com/photo-1570222094114-28a9d88a2ef5?w=300&h=200&fit=crop',
  'Air Fryer': 'https://images.unsplash.com/photo-1626139576127-55d33b30d6e2?w=300&h=200&fit=crop',
  'Robot Vacuum': 'https://images.unsplash.com/photo-1588862073904-8d91d6a54c5a?w=300&h=200&fit=crop',
  'Electric Kettle': 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=300&h=200&fit=crop',
  'Toaster Oven': 'https://images.unsplash.com/photo-1585664624472-0c91834c480b?w=300&h=200&fit=crop',
  'Rice Cooker': 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=300&h=200&fit=crop',
  'Air Purifier': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=200&fit=crop',
  'Desk Lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=200&fit=crop',
  'Smart Thermostat': 'https://images.unsplash.com/photo-1558002038-10914166d5cc?w=300&h=200&fit=crop',
  'Security Camera': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
  'Power Bank': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=200&fit=crop',
  'Smart Plug': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
  'Humidifier': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=200&fit=crop',
  'Electric Toothbrush': 'https://images.unsplash.com/photo-1609619385002-0b8e368b6c3d?w=300&h=200&fit=crop',
  'Hair Dryer': 'https://images.unsplash.com/photo-1599695438159-7e3e313080de?w=300&h=200&fit=crop',
  'Neck Pillow': 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=300&h=200&fit=crop',
  'Resistance Bands': 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=300&h=200&fit=crop',
  'Hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=200&fit=crop'
};

// Exchange rate: 1 USD = 83 INR
const USD_TO_INR = 83;

// Helper to get product image
const getProductImage = (name) => productImages[name] || getImageUrl(name);

// Mock data storage with enhanced structure
const database = {
  products: [
    {
      id: 1,
      name: 'Laptop',
      description: 'High-performance laptop with 16GB RAM',
      price: 999.99 * USD_TO_INR,
      originalPrice: 999.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 50,
      image: getProductImage('Laptop'),
      sku: 'ELEC-001',
      rating: 4.5,
      reviewCount: 25,
      featured: true,
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString()
    },
    {
      id: 2,
      name: 'Smartphone',
      description: 'Latest smartphone with 5G capability and 128GB storage',
      price: 699.99 * USD_TO_INR,
      originalPrice: 699.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 100,
      image: getProductImage('Smartphone'),
      sku: 'ELEC-002',
      rating: 4.8,
      reviewCount: 42,
      featured: true,
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date('2024-02-01').toISOString()
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      description: 'Premium noise-canceling wireless headphones',
      price: 199.99 * USD_TO_INR,
      originalPrice: 199.99,
      currency: 'INR',
      category: 'Audio',
      categoryId: 2,
      stock: 75,
      image: getProductImage('Wireless Headphones'),
      sku: 'AUDIO-001',
      rating: 4.3,
      reviewCount: 18,
      featured: false,
      createdAt: new Date('2024-02-10').toISOString(),
      updatedAt: new Date('2024-02-10').toISOString()
    },
    {
      id: 4,
      name: 'Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt - available in multiple colors',
      price: 24.99 * USD_TO_INR,
      originalPrice: 24.99,
      currency: 'INR',
      category: 'Clothing',
      categoryId: 3,
      stock: 200,
      image: getProductImage('Cotton T-Shirt'),
      sku: 'CLTH-001',
      rating: 4.1,
      reviewCount: 56,
      featured: false,
      createdAt: new Date('2024-02-15').toISOString(),
      updatedAt: new Date('2024-02-15').toISOString()
    },
    {
      id: 5,
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with 12-cup capacity',
      price: 79.99 * USD_TO_INR,
      originalPrice: 79.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 30,
      image: getProductImage('Coffee Maker'),
      sku: 'HOME-001',
      rating: 4.6,
      reviewCount: 31,
      featured: true,
      createdAt: new Date('2024-02-20').toISOString(),
      updatedAt: new Date('2024-02-20').toISOString()
    },
    {
      id: 6,
      name: 'Smart Watch',
      description: 'Fitness tracking smartwatch with heart rate monitor',
      price: 299.99 * USD_TO_INR,
      originalPrice: 299.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 60,
      image: getProductImage('Smart Watch'),
      sku: 'ELEC-003',
      rating: 4.4,
      reviewCount: 67,
      featured: false,
      createdAt: new Date('2024-03-01').toISOString(),
      updatedAt: new Date('2024-03-01').toISOString()
    },
    {
      id: 7,
      name: 'Tablet Pro',
      description: '12-inch tablet with stylus support and keyboard dock',
      price: 799.99 * USD_TO_INR,
      originalPrice: 799.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 45,
      image: getProductImage('Tablet Pro'),
      sku: 'ELEC-004',
      rating: 4.6,
      reviewCount: 34,
      featured: true,
      createdAt: new Date('2024-03-05').toISOString(),
      updatedAt: new Date('2024-03-05').toISOString()
    },
    {
      id: 8,
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with programmable buttons',
      price: 49.99 * USD_TO_INR,
      originalPrice: 49.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 150,
      image: getProductImage('Wireless Mouse'),
      sku: 'ELEC-005',
      rating: 4.2,
      reviewCount: 89,
      featured: false,
      createdAt: new Date('2024-03-10').toISOString(),
      updatedAt: new Date('2024-03-10').toISOString()
    },
    {
      id: 9,
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with Cherry MX switches',
      price: 129.99 * USD_TO_INR,
      originalPrice: 129.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 80,
      image: getProductImage('Mechanical Keyboard'),
      sku: 'ELEC-006',
      rating: 4.7,
      reviewCount: 56,
      featured: false,
      createdAt: new Date('2024-03-15').toISOString(),
      updatedAt: new Date('2024-03-15').toISOString()
    },
    {
      id: 10,
      name: 'Gaming Monitor',
      description: '27-inch 144Hz gaming monitor with 1ms response',
      price: 449.99 * USD_TO_INR,
      originalPrice: 449.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 35,
      image: getProductImage('Gaming Monitor'),
      sku: 'ELEC-007',
      rating: 4.8,
      reviewCount: 42,
      featured: true,
      createdAt: new Date('2024-03-20').toISOString(),
      updatedAt: new Date('2024-03-20').toISOString()
    },
    {
      id: 11,
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI and SD card reader',
      price: 59.99 * USD_TO_INR,
      originalPrice: 59.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 200,
      image: getProductImage('USB-C Hub'),
      sku: 'ELEC-008',
      rating: 4.3,
      reviewCount: 67,
      featured: false,
      createdAt: new Date('2024-03-25').toISOString(),
      updatedAt: new Date('2024-03-25').toISOString()
    },
    {
      id: 12,
      name: 'Portable SSD',
      description: '1TB portable SSD with USB 3.2 connectivity',
      price: 109.99 * USD_TO_INR,
      originalPrice: 109.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 120,
      image: getProductImage('Portable SSD'),
      sku: 'ELEC-009',
      rating: 4.6,
      reviewCount: 45,
      featured: false,
      createdAt: new Date('2024-03-30').toISOString(),
      updatedAt: new Date('2024-03-30').toISOString()
    },
    {
      id: 13,
      name: 'Webcam HD',
      description: '1080p webcam with built-in microphone for video calls',
      price: 79.99 * USD_TO_INR,
      originalPrice: 79.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 90,
      image: getProductImage('Webcam HD'),
      sku: 'ELEC-010',
      rating: 4.1,
      reviewCount: 38,
      featured: false,
      createdAt: new Date('2024-04-01').toISOString(),
      updatedAt: new Date('2024-04-01').toISOString()
    },
    {
      id: 14,
      name: 'Bluetooth Speaker',
      description: 'Waterproof Bluetooth speaker with 20-hour battery',
      price: 89.99 * USD_TO_INR,
      originalPrice: 89.99,
      currency: 'INR',
      category: 'Audio',
      categoryId: 2,
      stock: 110,
      image: getProductImage('Bluetooth Speaker'),
      sku: 'AUDIO-002',
      rating: 4.5,
      reviewCount: 72,
      featured: true,
      createdAt: new Date('2024-04-05').toISOString(),
      updatedAt: new Date('2024-04-05').toISOString()
    },
    {
      id: 15,
      name: 'Wireless Earbuds',
      description: 'True wireless earbuds with active noise cancellation',
      price: 149.99 * USD_TO_INR,
      originalPrice: 149.99,
      currency: 'INR',
      category: 'Audio',
      categoryId: 2,
      stock: 180,
      image: getProductImage('Wireless Earbuds'),
      sku: 'AUDIO-003',
      rating: 4.4,
      reviewCount: 95,
      featured: false,
      createdAt: new Date('2024-04-10').toISOString(),
      updatedAt: new Date('2024-04-10').toISOString()
    },
    {
      id: 16,
      name: 'Studio Microphone',
      description: 'Professional condenser microphone for recording',
      price: 199.99 * USD_TO_INR,
      originalPrice: 199.99,
      currency: 'INR',
      category: 'Audio',
      categoryId: 2,
      stock: 40,
      image: getProductImage('Studio Microphone'),
      sku: 'AUDIO-004',
      rating: 4.7,
      reviewCount: 28,
      featured: false,
      createdAt: new Date('2024-04-15').toISOString(),
      updatedAt: new Date('2024-04-15').toISOString()
    },
    {
      id: 17,
      name: 'Audio Interface',
      description: 'USB audio interface for music production',
      price: 159.99 * USD_TO_INR,
      originalPrice: 159.99,
      currency: 'INR',
      category: 'Audio',
      categoryId: 2,
      stock: 35,
      image: getProductImage('Audio Interface'),
      sku: 'AUDIO-005',
      rating: 4.6,
      reviewCount: 22,
      featured: false,
      createdAt: new Date('2024-04-20').toISOString(),
      updatedAt: new Date('2024-04-20').toISOString()
    },
    {
      id: 18,
      name: 'DJ Controller',
      description: 'Professional DJ controller with performance pads',
      price: 349.99 * USD_TO_INR,
      originalPrice: 349.99,
      currency: 'INR',
      category: 'Audio',
      categoryId: 2,
      stock: 25,
      image: getProductImage('DJ Controller'),
      sku: 'AUDIO-006',
      rating: 4.8,
      reviewCount: 18,
      featured: true,
      createdAt: new Date('2024-04-25').toISOString(),
      updatedAt: new Date('2024-04-25').toISOString()
    },
    {
      id: 19,
      name: 'Soundbar',
      description: '2.1 channel soundbar with wireless subwoofer',
      price: 249.99 * USD_TO_INR,
      originalPrice: 249.99,
      currency: 'INR',
      category: 'Audio',
      categoryId: 2,
      stock: 55,
      image: getProductImage('Soundbar'),
      sku: 'AUDIO-007',
      rating: 4.5,
      reviewCount: 48,
      featured: false,
      createdAt: new Date('2024-04-30').toISOString(),
      updatedAt: new Date('2024-04-30').toISOString()
    },
    {
      id: 20,
      name: 'Vinyl Player',
      description: 'Belt-drive vinyl record player with built-in preamp',
      price: 299.99 * USD_TO_INR,
      originalPrice: 299.99,
      currency: 'INR',
      category: 'Audio',
      categoryId: 2,
      stock: 30,
      image: getProductImage('Vinyl Player'),
      sku: 'AUDIO-008',
      rating: 4.7,
      reviewCount: 35,
      featured: false,
      createdAt: new Date('2024-05-01').toISOString(),
      updatedAt: new Date('2024-05-01').toISOString()
    },
    {
      id: 21,
      name: 'Denim Jacket',
      description: 'Classic denim jacket with modern fit',
      price: 89.99 * USD_TO_INR,
      originalPrice: 89.99,
      currency: 'INR',
      category: 'Clothing',
      categoryId: 3,
      stock: 75,
      image: getProductImage('Denim Jacket'),
      sku: 'CLTH-002',
      rating: 4.4,
      reviewCount: 42,
      featured: true,
      createdAt: new Date('2024-05-05').toISOString(),
      updatedAt: new Date('2024-05-05').toISOString()
    },
    {
      id: 22,
      name: 'Running Shoes',
      description: 'Lightweight running shoes with responsive cushioning',
      price: 129.99 * USD_TO_INR,
      originalPrice: 129.99,
      currency: 'INR',
      category: 'Clothing',
      categoryId: 3,
      stock: 120,
      image: getProductImage('Running Shoes'),
      sku: 'CLTH-003',
      rating: 4.5,
      reviewCount: 78,
      featured: false,
      createdAt: new Date('2024-05-10').toISOString(),
      updatedAt: new Date('2024-05-10').toISOString()
    },
    {
      id: 23,
      name: 'Leather Belt',
      description: 'Genuine leather belt with metal buckle',
      price: 39.99 * USD_TO_INR,
      originalPrice: 39.99,
      currency: 'INR',
      category: 'Clothing',
      categoryId: 3,
      stock: 150,
      image: getProductImage('Leather Belt'),
      sku: 'CLTH-004',
      rating: 4.2,
      reviewCount: 56,
      featured: false,
      createdAt: new Date('2024-05-15').toISOString(),
      updatedAt: new Date('2024-05-15').toISOString()
    },
    {
      id: 24,
      name: 'Winter Jacket',
      description: 'Insulated winter jacket with hood',
      price: 189.99 * USD_TO_INR,
      originalPrice: 189.99,
      currency: 'INR',
      category: 'Clothing',
      categoryId: 3,
      stock: 50,
      image: getProductImage('Winter Jacket'),
      sku: 'CLTH-005',
      rating: 4.6,
      reviewCount: 33,
      featured: true,
      createdAt: new Date('2024-05-20').toISOString(),
      updatedAt: new Date('2024-05-20').toISOString()
    },
    {
      id: 25,
      name: 'Sunglasses',
      description: 'Polarized sunglasses with UV protection',
      price: 79.99 * USD_TO_INR,
      originalPrice: 79.99,
      currency: 'INR',
      category: 'Clothing',
      categoryId: 3,
      stock: 100,
      image: getProductImage('Sunglasses'),
      sku: 'CLTH-006',
      rating: 4.3,
      reviewCount: 61,
      featured: false,
      createdAt: new Date('2024-05-25').toISOString(),
      updatedAt: new Date('2024-05-25').toISOString()
    },
    {
      id: 26,
      name: 'Wool Sweater',
      description: 'Soft merino wool sweater for cold weather',
      price: 99.99 * USD_TO_INR,
      originalPrice: 99.99,
      currency: 'INR',
      category: 'Clothing',
      categoryId: 3,
      stock: 65,
      image: getProductImage('Wool Sweater'),
      sku: 'CLTH-007',
      rating: 4.5,
      reviewCount: 29,
      featured: false,
      createdAt: new Date('2024-05-30').toISOString(),
      updatedAt: new Date('2024-05-30').toISOString()
    },
    {
      id: 27,
      name: 'Yoga Pants',
      description: 'High-waist yoga pants with four-way stretch',
      price: 59.99 * USD_TO_INR,
      originalPrice: 59.99,
      currency: 'INR',
      category: 'Clothing',
      categoryId: 3,
      stock: 180,
      image: getProductImage('Yoga Pants'),
      sku: 'CLTH-008',
      rating: 4.4,
      reviewCount: 94,
      featured: false,
      createdAt: new Date('2024-06-01').toISOString(),
      updatedAt: new Date('2024-06-01').toISOString()
    },
    {
      id: 28,
      name: 'Casual Dress',
      description: 'Midi dress perfect for casual occasions',
      price: 69.99 * USD_TO_INR,
      originalPrice: 69.99,
      currency: 'INR',
      category: 'Clothing',
      categoryId: 3,
      stock: 85,
      image: getProductImage('Casual Dress'),
      sku: 'CLTH-009',
      rating: 4.3,
      reviewCount: 47,
      featured: false,
      createdAt: new Date('2024-06-05').toISOString(),
      updatedAt: new Date('2024-06-05').toISOString()
    },
    {
      id: 29,
      name: 'Blender',
      description: 'High-speed blender with smoothie preset',
      price: 89.99 * USD_TO_INR,
      originalPrice: 89.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 70,
      image: getProductImage('Blender'),
      sku: 'HOME-002',
      rating: 4.5,
      reviewCount: 52,
      featured: true,
      createdAt: new Date('2024-06-10').toISOString(),
      updatedAt: new Date('2024-06-10').toISOString()
    },
    {
      id: 30,
      name: 'Air Fryer',
      description: 'Digital air fryer with 8 cooking presets',
      price: 119.99 * USD_TO_INR,
      originalPrice: 119.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 90,
      image: getProductImage('Air Fryer'),
      sku: 'HOME-003',
      rating: 4.6,
      reviewCount: 68,
      featured: false,
      createdAt: new Date('2024-06-15').toISOString(),
      updatedAt: new Date('2024-06-15').toISOString()
    },
    {
      id: 31,
      name: 'Robot Vacuum',
      description: 'Smart robot vacuum with mapping technology',
      price: 399.99 * USD_TO_INR,
      originalPrice: 399.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 40,
      image: getProductImage('Robot Vacuum'),
      sku: 'HOME-004',
      rating: 4.5,
      reviewCount: 45,
      featured: true,
      createdAt: new Date('2024-06-20').toISOString(),
      updatedAt: new Date('2024-06-20').toISOString()
    },
    {
      id: 32,
      name: 'Electric Kettle',
      description: 'Stainless steel electric kettle with temperature control',
      price: 49.99 * USD_TO_INR,
      originalPrice: 49.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 110,
      image: getProductImage('Electric Kettle'),
      sku: 'HOME-005',
      rating: 4.4,
      reviewCount: 73,
      featured: false,
      createdAt: new Date('2024-06-25').toISOString(),
      updatedAt: new Date('2024-06-25').toISOString()
    },
    {
      id: 33,
      name: 'Toaster Oven',
      description: 'Convection toaster oven with rotisserie',
      price: 149.99 * USD_TO_INR,
      originalPrice: 149.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 45,
      image: getProductImage('Toaster Oven'),
      sku: 'HOME-006',
      rating: 4.3,
      reviewCount: 38,
      featured: false,
      createdAt: new Date('2024-06-30').toISOString(),
      updatedAt: new Date('2024-06-30').toISOString()
    },
    {
      id: 34,
      name: 'Rice Cooker',
      description: 'Multi-function rice cooker with fuzzy logic',
      price: 79.99 * USD_TO_INR,
      originalPrice: 79.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 60,
      image: getProductImage('Rice Cooker'),
      sku: 'HOME-007',
      rating: 4.5,
      reviewCount: 41,
      featured: false,
      createdAt: new Date('2024-07-01').toISOString(),
      updatedAt: new Date('2024-07-01').toISOString()
    },
    {
      id: 35,
      name: 'Air Purifier',
      description: 'HEPA air purifier for rooms up to 500 sq ft',
      price: 249.99 * USD_TO_INR,
      originalPrice: 249.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 35,
      image: getProductImage('Air Purifier'),
      sku: 'HOME-008',
      rating: 4.6,
      reviewCount: 27,
      featured: true,
      createdAt: new Date('2024-07-05').toISOString(),
      updatedAt: new Date('2024-07-05').toISOString()
    },
    {
      id: 36,
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness and color',
      price: 44.99 * USD_TO_INR,
      originalPrice: 44.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 130,
      image: getProductImage('Desk Lamp'),
      sku: 'HOME-009',
      rating: 4.2,
      reviewCount: 55,
      featured: false,
      createdAt: new Date('2024-07-10').toISOString(),
      updatedAt: new Date('2024-07-10').toISOString()
    },
    {
      id: 37,
      name: 'Smart Thermostat',
      description: 'WiFi thermostat with voice control compatibility',
      price: 199.99 * USD_TO_INR,
      originalPrice: 199.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 50,
      image: getProductImage('Smart Thermostat'),
      sku: 'HOME-010',
      rating: 4.7,
      reviewCount: 33,
      featured: false,
      createdAt: new Date('2024-07-15').toISOString(),
      updatedAt: new Date('2024-07-15').toISOString()
    },
    {
      id: 38,
      name: 'Security Camera',
      description: 'Indoor security camera with night vision',
      price: 79.99 * USD_TO_INR,
      originalPrice: 79.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 100,
      image: getProductImage('Security Camera'),
      sku: 'ELEC-011',
      rating: 4.3,
      reviewCount: 62,
      featured: false,
      createdAt: new Date('2024-07-20').toISOString(),
      updatedAt: new Date('2024-07-20').toISOString()
    },
    {
      id: 39,
      name: 'Power Bank',
      description: 'High-capacity power bank with fast charging',
      price: 49.99 * USD_TO_INR,
      originalPrice: 49.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 200,
      image: getProductImage('Power Bank'),
      sku: 'ELEC-012',
      rating: 4.4,
      reviewCount: 85,
      featured: false,
      createdAt: new Date('2024-07-25').toISOString(),
      updatedAt: new Date('2024-07-25').toISOString()
    },
    {
      id: 40,
      name: 'Smart Plug',
      description: 'WiFi smart plug with energy monitoring',
      price: 24.99 * USD_TO_INR,
      originalPrice: 24.99,
      currency: 'INR',
      category: 'Electronics',
      categoryId: 1,
      stock: 250,
      image: getProductImage('Smart Plug'),
      sku: 'ELEC-013',
      rating: 4.1,
      reviewCount: 112,
      featured: false,
      createdAt: new Date('2024-07-30').toISOString(),
      updatedAt: new Date('2024-07-30').toISOString()
    },
    {
      id: 41,
      name: 'Humidifier',
      description: 'Ultrasonic humidifier with essential oil diffuser',
      price: 69.99 * USD_TO_INR,
      originalPrice: 69.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 75,
      image: getProductImage('Humidifier'),
      sku: 'HOME-011',
      rating: 4.4,
      reviewCount: 39,
      featured: false,
      createdAt: new Date('2024-08-01').toISOString(),
      updatedAt: new Date('2024-08-01').toISOString()
    },
    {
      id: 42,
      name: 'Electric Toothbrush',
      description: 'Sonic electric toothbrush with pressure sensor',
      price: 89.99 * USD_TO_INR,
      originalPrice: 89.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 90,
      image: getProductImage('Electric Toothbrush'),
      sku: 'HOME-012',
      rating: 4.5,
      reviewCount: 71,
      featured: false,
      createdAt: new Date('2024-08-05').toISOString(),
      updatedAt: new Date('2024-08-05').toISOString()
    },
    {
      id: 43,
      name: 'Hair Dryer',
      description: 'Ionic hair dryer with diffuser and concentrator',
      price: 79.99 * USD_TO_INR,
      originalPrice: 79.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 80,
      image: getProductImage('Hair Dryer'),
      sku: 'HOME-013',
      rating: 4.3,
      reviewCount: 54,
      featured: false,
      createdAt: new Date('2024-08-10').toISOString(),
      updatedAt: new Date('2024-08-10').toISOString()
    },
    {
      id: 44,
      name: 'Neck Pillow',
      description: 'Memory foam neck pillow for travel',
      price: 29.99 * USD_TO_INR,
      originalPrice: 29.99,
      currency: 'INR',
      category: 'Home',
      categoryId: 4,
      stock: 150,
      image: getProductImage('Neck Pillow'),
      sku: 'HOME-014',
      rating: 4.2,
      reviewCount: 83,
      featured: false,
      createdAt: new Date('2024-08-15').toISOString(),
      updatedAt: new Date('2024-08-15').toISOString()
    },
    {
      id: 45,
      name: 'Resistance Bands',
      description: 'Set of 5 resistance bands with carrying case',
      price: 19.99 * USD_TO_INR,
      originalPrice: 19.99,
      currency: 'INR',
      category: 'Clothing',
      categoryId: 3,
      stock: 300,
      image: getProductImage('Resistance Bands'),
      sku: 'CLTH-010',
      rating: 4.1,
      reviewCount: 125,
      featured: false,
      createdAt: new Date('2024-08-20').toISOString(),
      updatedAt: new Date('2024-08-20').toISOString()
    },
    {
      id: 46,
      name: 'Hoodie',
      description: 'Classic pullover hoodie with kangaroo pocket',
      price: 59.99 * USD_TO_INR,
      originalPrice: 59.99,
      currency: 'INR',
      category: 'Clothing',
      categoryId: 3,
      stock: 140,
      image: getProductImage('Hoodie'),
      sku: 'CLTH-011',
      rating: 4.4,
      reviewCount: 67,
      featured: false,
      createdAt: new Date('2024-08-25').toISOString(),
      updatedAt: new Date('2024-08-25').toISOString()
    }
  ],
  categories: [
    { id: 1, name: 'Electronics', description: 'Electronic devices and gadgets', createdAt: new Date().toISOString() },
    { id: 2, name: 'Audio', description: 'Audio equipment and accessories', createdAt: new Date().toISOString() },
    { id: 3, name: 'Clothing', description: 'Apparel and fashion items', createdAt: new Date().toISOString() },
    { id: 4, name: 'Home', description: 'Home and kitchen appliances', createdAt: new Date().toISOString() }
  ],
  users: [
    {
      id: 1,
      uuid: uuidv4(),
      name: 'John Doe',
      email: 'john@example.com',
      password: '$2a$10$X7.H6Gq5Q5Q5Q5Q5Q5Q5QOEzF3Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5', // password123
      role: 'customer',
      createdAt: new Date('2024-01-15').toISOString()
    },
    {
      id: 2,
      uuid: uuidv4(),
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: '$2a$10$X7.H6Gq5Q5Q5Q5Q5Q5Q5QOEzF3Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5',
      role: 'admin',
      createdAt: new Date('2024-02-01').toISOString()
    }
  ],
  orders: [],
  reviews: [
    { id: 1, productId: 1, userId: 1, userName: 'John Doe', rating: 5, comment: 'Excellent laptop! Very fast and reliable.', createdAt: new Date('2024-02-20').toISOString() },
    { id: 2, productId: 1, userId: 2, userName: 'Jane Smith', rating: 4, comment: 'Good performance, slightly expensive.', createdAt: new Date('2024-02-21').toISOString() },
    { id: 3, productId: 2, userId: 1, userName: 'John Doe', rating: 5, comment: 'Best smartphone ever!', createdAt: new Date('2024-02-22').toISOString() }
  ]
};

// Enhanced Product operations with search, pagination, filters
const productOperations = {
  getAll: (options = {}) => {
    let products = [...database.products];
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      featured,
      sortBy = 'id',
      sortOrder = 'asc',
      page = 1,
      limit = 10 
    } = options;
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Category filter
    if (category) {
      products = products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase() ||
        p.categoryId === parseInt(category)
      );
    }
    
    // Price range filter
    if (minPrice !== undefined) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice !== undefined) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    // Featured filter
    if (featured !== undefined) {
      products = products.filter(p => p.featured === (featured === 'true' || featured === true));
    }
    
    // Sorting
    products.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    });
    
    // Pagination
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedProducts = products.slice(offset, offset + parseInt(limit));
    
    return {
      data: paginatedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },
  
  getById: (id) => database.products.find(p => p.id === parseInt(id)),
  
  getByCategory: (categoryId) => database.products.filter(p => p.categoryId === parseInt(categoryId)),
  
  getFeatured: () => database.products.filter(p => p.featured),
  
  create: (product) => {
    const inrPrice = product.price * USD_TO_INR;
    const newProduct = {
      id: Math.max(...database.products.map(p => p.id)) + 1,
      ...product,
      price: inrPrice,
      originalPrice: product.price,
      currency: 'INR',
      image: product.image || getProductImage(product.name),
      rating: 0,
      reviewCount: 0,
      featured: product.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    database.products.push(newProduct);
    return newProduct;
  },
  
  update: (id, updates) => {
    const index = database.products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;
    
    database.products[index] = {
      ...database.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return database.products[index];
  },
  
  delete: (id) => {
    const index = database.products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;
    database.products.splice(index, 1);
    return true;
  },
  
  getCategories: () => database.categories,
  
  getCategoryById: (id) => database.categories.find(c => c.id === parseInt(id)),
  
  getCategoryByName: (name) => database.categories.find(c => c.name.toLowerCase() === name.toLowerCase())
};

// Enhanced User operations with password hashing support
const userOperations = {
  getAll: () => {
    return database.users.map(({ password, ...user }) => user);
  },
  
  getById: (id) => {
    const user = database.users.find(u => u.id === parseInt(id));
    if (user) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  },
  
  getByEmail: (email) => database.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  
  getByUUID: (uuid) => {
    const user = database.users.find(u => u.uuid === uuid);
    if (user) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  },
  
  create: (userData) => {
    const newUser = {
      id: database.users.length + 1,
      uuid: uuidv4(),
      ...userData,
      role: userData.role || 'customer',
      createdAt: new Date().toISOString()
    };
    database.users.push(newUser);
    
    const { password, ...safeUser } = newUser;
    return safeUser;
  },
  
  update: (id, updates) => {
    const index = database.users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return null;
    
    database.users[index] = {
      ...database.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const { password, ...safeUser } = database.users[index];
    return safeUser;
  }
};

// Review operations
const reviewOperations = {
  getByProductId: (productId) => database.reviews.filter(r => r.productId === parseInt(productId)),
  
  getByUserId: (userId) => database.reviews.filter(r => r.userId === parseInt(userId)),
  
  create: (reviewData) => {
    const newReview = {
      id: database.reviews.length + 1,
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    database.reviews.push(newReview);
    
    // Update product rating
    const product = database.products.find(p => p.id === reviewData.productId);
    if (product) {
      const productReviews = database.reviews.filter(r => r.productId === reviewData.productId);
      product.rating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      product.reviewCount = productReviews.length;
    }
    
    return newReview;
  },
  
  delete: (id) => {
    const index = database.reviews.findIndex(r => r.id === id);
    if (index === -1) return false;
    database.reviews.splice(index, 1);
    return true;
  }
};

// Order operations (enhanced)
const orderOperations = {
  getAll: (options = {}) => {
    let orders = [...database.orders];
    
    if (options.userId) {
      orders = orders.filter(o => o.userId === parseInt(options.userId));
    }
    
    if (options.status) {
      orders = orders.filter(o => o.status === options.status);
    }
    
    return orders;
  },
  
  getById: (id) => database.orders.find(o => o.id === parseInt(id)),
  
  getByUserId: (userId) => database.orders.filter(o => o.userId === parseInt(userId)),
  
  create: (orderData) => {
    const newOrder = {
      id: database.orders.length + 1,
      uuid: uuidv4(),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    database.orders.push(newOrder);
    return newOrder;
  },
  
  updateStatus: (id, status) => {
    const index = database.orders.findIndex(o => o.id === parseInt(id));
    if (index === -1) return null;
    
    database.orders[index] = {
      ...database.orders[index],
      status,
      updatedAt: new Date().toISOString()
    };
    return database.orders[index];
  },
  
  cancel: (id) => orderOperations.updateStatus(id, 'cancelled')
};

// Export all operations
module.exports = {
  products: productOperations,
  users: userOperations,
  orders: orderOperations,
  reviews: reviewOperations,
  categories: {
    getAll: () => database.categories,
    getById: (id) => database.categories.find(c => c.id === parseInt(id)),
    create: (data) => {
      const newCategory = {
        id: database.categories.length + 1,
        ...data,
        createdAt: new Date().toISOString()
      };
      database.categories.push(newCategory);
      return newCategory;
    },
    update: (id, data) => {
      const index = database.categories.findIndex(c => c.id === parseInt(id));
      if (index === -1) return null;
      database.categories[index] = { ...database.categories[index], ...data };
      return database.categories[index];
    },
    delete: (id) => {
      const index = database.categories.findIndex(c => c.id === parseInt(id));
      if (index === -1) return false;
      database.categories.splice(index, 1);
      return true;
    }
  },
  
  initialize: () => {
    console.log('Enhanced database initialized with pagination, search, categories, and reviews');
    return true;
  }
};
