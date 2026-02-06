// ShopMax E-Commerce Store - Main JavaScript

// API Base URL
const API_BASE = '/api';

// State Management
let currentUser = null;
let cart = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    updateCartBadge();
    checkAuthState();
});

// ============== Utility Functions ==============

function createProductCard(product) {
    const imageUrl = product.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`;
    const rating = product.rating || 4.5;
    const reviewCount = product.reviewCount || 0;
    const originalPrice = product.originalPrice ? product.originalPrice > product.price : false;
    
    return `
        <div class="product-card">
            <div style="position: relative;">
                <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                <div class="product-actions">
                    <button class="product-action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="product-action-btn" onclick="quickView(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category || 'General'}</span>
                <a href="product-details.html?id=${product.id}" class="product-name">${product.name}</a>
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <span>${rating.toFixed(1)} (${reviewCount} reviews)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">₹${product.price.toFixed(2)}</span>
                    ${originalPrice ? `<span class="original-price">₹${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="btn btn-primary btn-small product-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

function showNotification(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============== Authentication Functions ==============

function checkAuthState() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        currentUser = JSON.parse(user);
        showAuthButtons(false);
        updateUserName();
    } else {
        showAuthButtons(true);
    }
}

function showAuthButtons(show) {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    
    if (authSection) authSection.style.display = show ? 'flex' : 'none';
    if (userSection) userSection.style.display = show ? 'none' : 'flex';
}

function updateUserName() {
    const displayName = document.getElementById('display-name');
    if (displayName && currentUser) {
        displayName.textContent = currentUser.name.split(' ')[0];
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.data;
            localStorage.setItem('token', currentUser.token);
            localStorage.setItem('user', JSON.stringify(currentUser));
            showAuthButtons(false);
            updateUserName();
            return { success: true };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function register(name, email, password) {
    try {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            return { success: true, data: data.data };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    showAuthButtons(true);
    showNotification('You have been logged out', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function requireAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Please login to continue', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    return true;
}

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

// ============== Cart Functions ==============

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

function addToCart(productId) {
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        // Fetch product details
        fetch(`${API_BASE}/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const product = data.data;
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                        quantity: 1
                    });
                    saveCartToStorage();
                    updateCartBadge();
                    showNotification(`${product.name} added to cart!`, 'success');
                }
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                showNotification('Error adding to cart', 'error');
            });
    }
    
    if (!existingItem) {
        showNotification('Product added to cart!', 'success');
    }
    
    saveCartToStorage();
    updateCartBadge();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartBadge();
    
    // Refresh cart display if on cart page
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

function updateCartQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            updateCartBadge();
            
            // Refresh cart display if on cart page
            if (window.location.pathname.includes('cart.html')) {
                displayCartItems();
            }
        }
    }
}

function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartBadge();
    
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// ============== Wishlist Functions ==============

function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Added to wishlist!', 'success');
    } else {
        showNotification('Already in wishlist!', 'error');
    }
}

function quickView(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// ============== Order Functions ==============

async function createOrder(shippingInfo) {
    if (!requireAuth()) return;
    
    const orderData = {
        items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
        })),
        total: getCartTotal(),
        shippingAddress: shippingInfo
    };
    
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            clearCart();
            showNotification('Order placed successfully!', 'success');
            return { success: true, orderId: data.data.id };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function loadOrders() {
    if (!requireAuth()) return [];
    
    try {
        const response = await fetch(`${API_BASE}/users/orders`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        return [];
    }
}

// ============== API Testing ==============

async function testApi(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: getAuthHeaders()
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Export functions for use in other scripts
window.ShopMax = {
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    addToWishlist,
    createOrder,
    loadOrders,
    testApi,
    requireAuth,
    getAuthHeaders,
    showNotification
};
