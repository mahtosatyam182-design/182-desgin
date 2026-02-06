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
    setupMobileMenu();
});

// ============== Utility Functions ==============

function createProductCard(product) {
    const imageUrl = product.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`;
    return `
        <div class="product-card">
            <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="product-info">
                <span class="product-category">${product.category || 'General'}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description || 'No description available'}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-outline btn-small" onclick="addToWishlist(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = 'position: fixed; top: 90px; right: 20px; z-index: 9999; max-width: 350px; animation: slideIn 0.3s ease;';
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
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
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    
    if (authButtons) authButtons.style.display = show ? 'flex' : 'none';
    if (userMenu) userMenu.style.display = show ? 'none' : 'flex';
}

function updateUserName() {
    const userNameEl = document.getElementById('user-name');
    if (userNameEl && currentUser) {
        userNameEl.textContent = `Hi, ${currentUser.name}`;
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
        showNotification('Please login to continue', 'danger');
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
    const product = cart.find(item => item.id === productId);
    
    if (product) {
        product.quantity++;
    } else {
        // Fetch product details
        fetch(`${API_BASE}/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const productData = data.data;
                    cart.push({
                        id: productData.id,
                        name: productData.name,
                        price: productData.price,
                        image: productData.image,
                        category: productData.category,
                        quantity: 1
                    });
                    saveCartToStorage();
                    updateCartBadge();
                    showNotification(`${productData.name} added to cart!`, 'success');
                }
            });
    }
    
    if (!cart.find(item => item.id === productId)) {
        // If product was just added, show notification
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
        showNotification('Already in wishlist!', 'danger');
    }
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
    if (!requireAuth()) return;
    
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

// ============== Mobile Menu ==============

function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
        });
    }
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('mobile-open');
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

// Add CSS for notifications and mobile menu
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    .nav-menu.mobile-open {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        background: white;
        padding: 20px;
        box-shadow: 0 5px 10px rgba(0,0,0,0.1);
    }
    .nav-menu.mobile-open li {
        margin: 10px 0;
    }
`;
document.head.appendChild(style);

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
    getAuthHeaders
};
