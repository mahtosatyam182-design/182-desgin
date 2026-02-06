# 🛒 E-Commerce Store

A full-stack e-commerce application built with Express.js backend and vanilla HTML/CSS/JavaScript frontend.

## Features

- **Authentication**: JWT-based user login and registration
- **Shopping Cart**: Persistent cart with add/remove/update functionality
- **Products**: Browse, search, filter, and sort products
- **Categories**: Organize products by categories
- **Orders**: Place orders and track order history
- **Reviews**: Rate and review products
- **API Documentation**: Interactive API docs with testing capability

## Pages

1. **Home** (`index.html`) - Hero section, featured products, categories
2. **Products** (`products.html`) - Product catalog with filters
3. **Cart** (`cart.html`) - Shopping cart management
4. **Login** (`login.html`) - User authentication
5. **Register** (`register.html`) - New user registration
6. **Orders** (`orders.html`) - Order history and tracking
7. **API Docs** (`api-docs.html`) - Complete API documentation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend+backened

# Install dependencies
npm install

# Start the server
npm start
```

### Running the Application

The server will start on `http://localhost:3000`

```bash
node server.js
```

## Demo Credentials

- **Email**: john@example.com
- **Password**: password123

## API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination & filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/orders` - Get user orders

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (admin)
- `POST /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Add review
- `DELETE /api/reviews/:id` - Delete review

## Project Structure

```
frontend+backened/
├── data/
│   └── database.js          # In-memory database
├── frontend/
│   ├── css/
│   │   └── styles.css       # Main stylesheet
│   ├── js/
│   │   └── app.js           # Main JavaScript file
│   ├── index.html           # Home page
│   ├── products.html        # Products page
│   ├── cart.html            # Shopping cart
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   ├── orders.html          # Orders page
│   └── api-docs.html        # API documentation
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── validation.js        # Input validation
│   └── logger.js            # Request logging
├── routes/
│   ├── products.js          # Products routes
│   ├── categories.js        # Categories routes
│   ├── users.js             # Users routes
│   ├── orders.js            # Orders routes
│   └── reviews.js           # Reviews routes
├── server.js                # Express server
└── package.json
```

## Technologies Used

- **Backend**: Express.js, JWT, CORS
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Font Awesome**: Icons
- **Google Fonts**: Typography

## License

MIT License
