# Team Division of Responsibilities - E-Commerce Project

## Project Overview
A full-stack e-commerce application with React Admin Panel and EJS customer-facing pages, built on Node.js/Express backend with PostgreSQL database, Stripe payment integration, and deployed on Vercel/Render.

---

## Abdullah Asif (FA23-BCS-017)
**Role:** Frontend Developer - React Admin Panel & Advanced UI/UX

### 1. React Admin Panel Architecture
**Location:** `admin/src/`

#### Routing & Navigation (`App.jsx`)
- Implemented React Router v6 with nested routes
- Created route structure: `/`, `/products`, `/orders`, `/categories`
- Built `ProtectedRoute` component that:
  - Checks authentication status via `useAuth()` hook
  - Shows loading state during auth verification
  - Redirects unauthenticated users to `/login`
  - Prevents authenticated users from accessing login page

**Technical Implementation:**
```javascript
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return admin ? children : <Navigate to="/login" replace />;
};
```

#### State Management (`context/AuthContext.jsx`)
- Context API for global admin authentication state
- Features implemented:
  - **Persistent Sessions**: Stores admin data and JWT token in localStorage
  - **Auto-verification**: Checks token validity on app mount via `/admin/auth/me` endpoint
  - **Auto-logout**: Clears storage if token is invalid/expired
  - **Login/Logout Methods**: Centralized authentication functions
  
**Key Functions:**
- `verifyAuth()`: Validates stored token with backend
- `login()`: Authenticates admin and stores credentials
- `logout()`: Clears all auth data and redirects

#### Frontend-Backend Integration (`api/axios.js`)
- Axios instance configuration:
  - **Base URL**: Environment-based (`VITE_API_URL` or `/api`)
  - **Credentials**: `withCredentials: true` for cookie handling
  - **Request Interceptor**: Automatically adds JWT token to Authorization header
  - **Response Interceptor**: Handles 401 errors, triggers logout on auth failure
  - **Timeout**: 15-second timeout for all requests

**Error Handling:**
```javascript
if (error.response?.status === 401) {
  localStorage.clear();
  window.location.href = '/login';
}
```

#### Dashboard Components
**Pages Implemented:**
1. **Dashboard (`pages/Dashboard.jsx`)**: Statistics overview, charts, recent orders
2. **Products (`pages/Products.jsx`)**: Product CRUD with image upload, stock management
3. **Orders (`pages/Orders.jsx`)**: Order list, status updates, filtering
4. **Categories (`pages/Categories.jsx`)**: Category management with drag-drop sorting

**Reusable Components:**
- `Layout.jsx`: Sidebar navigation, header, responsive design
- `Table.jsx`: Generic data table with sorting, pagination, search
- `Modal.jsx`: Reusable modal for forms and confirmations
- `LoadingSpinner.jsx`: Loading states

### 2. Advanced EJS Templates
**Location:** `backend/src/views/pages/`

#### Customer-Facing Pages
1. **Cart (`cart.ejs`)**: 
   - Dynamic cart item rendering
   - Quantity update controls
   - Real-time subtotal calculations
   - Empty cart state handling

2. **Checkout (`checkout.ejs`)**:
   - Multi-step checkout flow
   - Shipping address form with validation
   - Order summary display
   - Stripe payment integration

3. **Order History (`orders.ejs`)**:
   - User's order list with filtering
   - Order status badges (pending, processing, shipped, delivered)
   - Order detail expansion

4. **Product Detail (`product-detail.ejs`)**:
   - Image gallery
   - Add to cart functionality
   - Stock availability display
   - Related products section

### 3. Responsive UI/UX Design

#### Tailwind CSS Configuration (`tailwind.config.js`)
```javascript
theme: {
  extend: {
    colors: {
      primary: '#0d6efd',    // Bootstrap-inspired
      secondary: '#6c757d',
      success: '#198754',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#0dcaf0',
    }
  }
}
```

**Responsive Breakpoints:**
- Mobile-first approach
- Tailwind's default breakpoints (sm, md, lg, xl, 2xl)
- Custom utility classes for consistent spacing

#### Bootstrap Integration (EJS Templates)
- Bootstrap 5 for customer-facing pages
- Consistent component styling (cards, buttons, forms)
- Responsive grid system for product listings

### 4. Key Features Implemented
- **Admin Authorization**: Role-based access control
- **Image Upload**: Product image management with preview
- **Real-time Updates**: Auto-refresh on data changes
- **Form Validation**: Client-side validation with error messages
- **Loading States**: Skeleton screens and spinners
- **Toast Notifications**: Success/error feedback

### 5. Deployment
- **Platform**: Vercel
- **Build Configuration**: Vite build system
- **Environment Variables**: API URL, Stripe public key
- **Deployment Script**: `npm run build && vercel deploy`

---

## Abdul Hannan (FA23-BCS-013)
**Role:** Backend Developer - Authentication & CRUD Operations

### 1. User Authentication System
**Location:** `backend/src/controllers/authController.js`

#### Registration Flow (`POST /api/auth/register`)
```javascript
const register = async (req, res) => {
  // 1. Extract user data from request
  const { firstName, lastName, email, password, phone } = req.body;
  
  // 2. Check if user already exists
  const existingUser = await db.User.findOne({ where: { email } });
  
  // 3. Create user (password auto-hashed by Sequelize hook)
  const user = await db.User.create({ firstName, lastName, email, password, phone });
  
  // 4. Generate JWT token
  const token = generateAccessToken({ userId: user.id, email: user.email });
  
  // 5. Set httpOnly cookie and return response
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ success: true, user: user.toSafeObject(), token });
};
```

**Security Features:**
- Password hashing with bcrypt (12 salt rounds)
- Email uniqueness validation
- JWT token generation
- HttpOnly cookies to prevent XSS attacks
- Safe user object (excludes password)

#### Login Flow (`POST /api/auth/login`)
- Email/password validation
- Password comparison using bcrypt
- JWT token generation on success
- Session creation with cookie

#### JWT Token Management
**Location:** `backend/src/utils/jwt.js`

**Token Structure:**
```javascript
generateAccessToken({ userId, email, role });
// Expires: 7 days
// Algorithm: HS256
// Secret: process.env.JWT_SECRET
```

### 2. Authentication Middleware
**Location:** `backend/src/middleware/auth.js`

#### Token Extraction Strategy
```javascript
const extractToken = (req, cookieName) => {
  // Priority 1: Check httpOnly cookie
  if (req.cookies?.[cookieName]) return req.cookies[cookieName];
  
  // Priority 2: Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
};
```

#### User Authentication (`authenticateUser`)
- Extracts token from cookie or header
- Verifies token signature and expiration
- Fetches user from database
- Attaches user object to `req.user`
- Returns 401 for invalid/missing tokens

#### Admin Authentication (`authenticateAdmin`)
- Similar to user auth but for admin routes
- Checks admin-specific token
- Attaches admin object to `req.admin`

### 3. Product CRUD Operations
**Location:** `backend/src/controllers/productController.js`

#### Get All Products (`GET /api/products`)
**Advanced Query Features:**
```javascript
{
  page: 1,              // Pagination
  limit: 12,            // Items per page
  categoryId: 5,        // Filter by category
  search: "laptop",     // Search in name/description
  minPrice: 100,        // Price range filtering
  maxPrice: 1000,
  sortBy: "price",      // Sort by field
  order: "ASC",         // Sort order
  featured: true,       // Filter featured products
  includeInactive: false // Admin-only: show inactive products
}
```

**Database Query:**
```javascript
const where = {};
if (categoryId) where.categoryId = categoryId;
if (search) where[Op.or] = [
  { name: { [Op.iLike]: `%${search}%` } },
  { description: { [Op.iLike]: `%${search}%` } }
];
if (minPrice) where.price = { [Op.gte]: minPrice };
if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };

const products = await db.Product.findAndCountAll({
  where,
  include: [{ model: db.Category, as: 'category' }],
  limit: parseInt(limit),
  offset: (page - 1) * limit,
  order: [[sortBy, order]]
});
```

#### Create Product (`POST /api/products`)
- Validates required fields (name, price, categoryId)
- Generates unique slug from product name
- Handles image URL
- Sets default stock and isActive status

#### Update Product (`PUT /api/products/:id`)
- Partial updates supported
- Slug regeneration if name changes
- Stock management

#### Delete Product (`DELETE /api/products/:id`)
- Soft delete (sets isActive to false)
- Or hard delete based on requirements

### 4. Category CRUD Operations
**Location:** `backend/src/controllers/categoryController.js`

**Endpoints Implemented:**
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

**Features:**
- Slug generation from category name
- Product count for each category
- Hierarchical category support (parent-child)

### 5. Input Validation & Error Handling

#### Validation Middleware
**Location:** `backend/src/utils/validators.js`

**Validation Rules:**
```javascript
// Email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Password strength (min 8 chars, 1 uppercase, 1 number)
const isValidPassword = (password) => 
  /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

// Phone number validation
const isValidPhone = (phone) => /^\+?[\d\s-()]{10,}$/.test(phone);
```

#### Error Handler Middleware
**Location:** `backend/src/middleware/error.js`

**Handles Multiple Error Types:**
```javascript
// 1. Sequelize Validation Errors
if (err.name === 'SequelizeValidationError') {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    errors: err.errors.map(e => ({ field: e.path, message: e.message }))
  });
}

// 2. Unique Constraint Errors (duplicate email)
if (err.name === 'SequelizeUniqueConstraintError') {
  return res.status(400).json({
    success: false,
    message: `${err.errors[0].path} already exists`
  });
}

// 3. Foreign Key Constraint Errors
// 4. JWT Errors
// 5. Generic 500 errors
```

#### Async Handler Wrapper
```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```
- Wraps all controller functions
- Automatically catches async errors
- Passes errors to error handler middleware

### 6. EJS Template Development

#### Customer-Facing Pages
**Location:** `backend/src/views/pages/`

1. **Home Page (`home.ejs`)**
   - Hero section with featured products
   - Category showcase
   - New arrivals section

2. **Product Listing (`shop.ejs`)**
   - Grid/list view toggle
   - Filter sidebar (categories, price range)
   - Pagination

3. **Product Detail (`product-detail.ejs`)**
   - Product information display
   - Add to cart form
   - Reviews section

4. **Login/Register (`login.ejs`, `register.ejs`)**
   - Form validation
   - Error message display
   - Redirect handling

**Template Structure:**
```ejs
<%- include('../layouts/main.ejs') %>
  <%- include('../partials/navbar.ejs') %>
  
  <!-- Page content -->
  
  <%- include('../partials/footer.ejs') %>
<%- include('../layouts/main_end.ejs') %>
```

### 7. Database Seeding
**Location:** `backend/src/seeders/`

#### Seed Files Created:
1. **Admins (`20231213000001-demo-admins.js`)**
   ```javascript
   {
     username: 'superadmin',
     email: 'admin@ecommerce.com',
     password: bcrypt.hash('Admin@123', 12),
     role: 'super_admin'
   }
   ```

2. **Users (`20231213000002-demo-users.js`)**
   - 10-15 demo users with realistic data

3. **Categories (`20231213000003-demo-categories.js`)**
   - Electronics, Clothing, Books, etc.

4. **Products (`20231213000004-demo-products.js`)**
   - 50+ products with realistic prices, descriptions
   - Associated with categories

5. **Orders (`20231213000005-demo-orders.js`)**
   - Sample order history

**Seeding Command:**
```bash
npx sequelize-cli db:seed:all
```

### 8. API Testing & Documentation
**Location:** `API_DOCS.md`, `postman_collection.json`

#### Documentation Includes:
- Endpoint descriptions
- Request/response examples
- Authentication requirements
- Error responses
- Query parameter options

#### Postman Collection Features:
- Pre-request scripts for token injection
- Environment variables
- Test assertions
- Organized by resource (Auth, Products, Orders, etc.)

---

## Muhammad Ramzan (FA23-BCS-126)
**Role:** Backend Architect - Database, Payments, Security, Deployment

### 1. Backend Architecture
**Location:** `backend/src/`

#### Server Setup (`server.js`)
```javascript
const express = require('express');
const app = express();

// Middleware Stack
app.use(express.json());                    // JSON body parser
app.use(express.urlencoded({ extended: true })); // Form data parser
app.use(cookieParser());                    // Cookie parser
app.use(requestLogger);                     // Custom request logger
app.use(rateLimiter);                       // Rate limiting

// Static files
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);
```

### 2. Database Design with Sequelize ORM

#### Models
**Location:** `backend/src/models/`

**1. User Model (`User.js`)**
```javascript
{
  id: UUID (Primary Key),
  firstName: STRING,
  lastName: STRING,
  email: STRING (Unique),
  password: STRING (Hashed),
  phone: STRING,
  isActive: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}

// Hooks
beforeCreate: hash password with bcrypt
beforeUpdate: hash password if changed

// Methods
validatePassword(password): compares with hashed password
toSafeObject(): returns user without password
```

**2. Product Model (`Product.js`)**
```javascript
{
  id: UUID,
  name: STRING,
  slug: STRING (Unique, Indexed),
  description: TEXT,
  price: DECIMAL(10, 2),
  stock: INTEGER,
  categoryId: UUID (Foreign Key),
  imageUrl: STRING,
  isFeatured: BOOLEAN,
  isActive: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

**3. Order Model (`Order.js`)**
```javascript
{
  id: UUID,
  userId: UUID (Foreign Key),
  orderNumber: STRING (Unique),
  totalAmount: DECIMAL(10, 2),
  status: ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
  shippingAddress: TEXT,
  city: STRING,
  state: STRING,
  postalCode: STRING,
  country: STRING,
  stripeSessionId: STRING,
  paymentStatus: ENUM ('pending', 'paid', 'failed', 'refunded'),
  createdAt: DATE,
  updatedAt: DATE
}
```

**4. OrderItem Model (`OrderItem.js`)**
```javascript
{
  id: UUID,
  orderId: UUID (Foreign Key),
  productId: UUID (Foreign Key),
  quantity: INTEGER,
  price: DECIMAL(10, 2),
  subtotal: DECIMAL(10, 2)
}
```

**5. CartItem Model (`CartItem.js`)**
```javascript
{
  id: UUID,
  userId: UUID (Foreign Key),
  productId: UUID (Foreign Key),
  quantity: INTEGER,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Model Associations (`models/index.js`)
```javascript
// User associations
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
User.hasMany(CartItem, { foreignKey: 'userId', as: 'cartItems' });

// Product associations
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });

// Order associations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// CartItem associations
CartItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
```

#### Migrations
**Location:** `backend/src/migrations/`

**Migration Files (Executed in Order):**
1. `20231213000001-create-user.js` - Users table
2. `20231213000002-create-admin.js` - Admins table
3. `20231213000003-create-category.js` - Categories table
4. `20231213000004-create-product.js` - Products table
5. `20231213000005-create-order.js` - Orders table
6. `20231213000006-create-order-item.js` - Order items table
7. `20231213000007-create-cart-item.js` - Cart items table

**Migration Commands:**
```bash
npx sequelize-cli db:migrate        # Run migrations
npx sequelize-cli db:migrate:undo   # Rollback last migration
```

### 3. Stripe Payment Integration

#### Configuration
**Location:** `backend/src/config/stripe.js`
```javascript
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
  stripe,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_SUCCESS_URL: process.env.STRIPE_SUCCESS_URL,
  STRIPE_CANCEL_URL: process.env.STRIPE_CANCEL_URL
};
```

#### Checkout Session Creation
**Location:** `backend/src/controllers/orderController.js`

**Flow:**
```javascript
const createCheckoutSession = async (req, res) => {
  // 1. Get cart items for user
  const cartItems = await db.CartItem.findAll({
    where: { userId: req.user.id },
    include: [{ model: db.Product, as: 'product' }]
  });

  // 2. Validate cart is not empty
  if (cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  // 3. Create line items for Stripe
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        description: item.product.description,
        images: [item.product.imageUrl]
      },
      unit_amount: Math.round(item.product.price * 100) // Convert to cents
    },
    quantity: item.quantity
  }));

  // 4. Calculate total amount
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.product.price * item.quantity),
    0
  );

  // 5. Create order record (status: pending)
  const order = await db.Order.create({
    userId: req.user.id,
    orderNumber: generateOrderNumber(),
    totalAmount,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: req.body.shippingAddress,
    city: req.body.city,
    state: req.body.state,
    postalCode: req.body.postalCode,
    country: req.body.country
  });

  // 6. Create order items
  await Promise.all(cartItems.map(item =>
    db.OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.product.price * item.quantity
    })
  ));

  // 7. Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: STRIPE_CANCEL_URL,
    customer_email: req.user.email,
    client_reference_id: order.id,
    metadata: {
      orderId: order.id,
      userId: req.user.id
    }
  });

  // 8. Update order with session ID
  await order.update({ stripeSessionId: session.id });

  // 9. Return session URL
  res.json({
    success: true,
    sessionUrl: session.url,
    orderId: order.id
  });
};
```

#### Webhook Handling (`POST /api/orders/webhook`)
```javascript
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  // 1. Verify webhook signature
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    STRIPE_WEBHOOK_SECRET
  );

  // 2. Handle different event types
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // 3. Update order status
    await db.Order.update(
      { 
        status: 'processing',
        paymentStatus: 'paid'
      },
      { where: { stripeSessionId: session.id } }
    );

    // 4. Clear user's cart
    await db.CartItem.destroy({
      where: { userId: session.metadata.userId }
    });

    // 5. Reduce product stock
    const order = await db.Order.findOne({
      where: { id: session.metadata.orderId },
      include: [{ model: db.OrderItem, as: 'orderItems' }]
    });

    for (const item of order.orderItems) {
      await db.Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.productId }
      });
    }
  }

  res.json({ received: true });
};
```

### 4. Shopping Cart Management

#### Cart Operations
**Location:** `backend/src/controllers/cartController.js`

**Add to Cart (`POST /api/cart`)**
```javascript
const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // 1. Validate product exists and is active
  const product = await db.Product.findOne({
    where: { id: productId, isActive: true }
  });

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // 2. Check stock availability
  if (product.stock < quantity) {
    return res.status(400).json({ 
      message: 'Insufficient stock',
      availableStock: product.stock
    });
  }

  // 3. Check if item already in cart
  const existingItem = await db.CartItem.findOne({
    where: { userId: req.user.id, productId }
  });

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      return res.status(400).json({ message: 'Exceeds available stock' });
    }
    await existingItem.update({ quantity: newQuantity });
  } else {
    // Create new cart item
    await db.CartItem.create({
      userId: req.user.id,
      productId,
      quantity
    });
  }

  res.json({ success: true, message: 'Item added to cart' });
};
```

**Get Cart (`GET /api/cart`)**
- Fetches all cart items with product details
- Calculates subtotal for each item
- Returns total cart value and item count

**Update Quantity (`PUT /api/cart/:id`)**
- Validates stock availability
- Updates cart item quantity

**Remove from Cart (`DELETE /api/cart/:id`)**
- Deletes cart item
- Validates ownership (user can only delete their own cart items)

### 5. Product Recommendation System

#### Recommendation Algorithm
**Location:** `backend/src/controllers/productController.js`

**Recommendation Strategies:**

**1. Related Products (by Category)**
```javascript
const getRelatedProducts = async (productId) => {
  const product = await db.Product.findByPk(productId);
  
  return await db.Product.findAll({
    where: {
      categoryId: product.categoryId,
      id: { [Op.ne]: productId },  // Exclude current product
      isActive: true
    },
    limit: 4,
    order: sequelize.random()  // Randomize results
  });
};
```

**2. Featured Products**
```javascript
const getFeaturedProducts = async () => {
  return await db.Product.findAll({
    where: { isFeatured: true, isActive: true },
    limit: 8,
    order: [['createdAt', 'DESC']]
  });
};
```

**3. Popular Products (by Order Count)**
```javascript
const getPopularProducts = async () => {
  return await db.Product.findAll({
    attributes: [
      'id', 'name', 'price', 'imageUrl',
      [sequelize.fn('COUNT', sequelize.col('orderItems.id')), 'orderCount']
    ],
    include: [{
      model: db.OrderItem,
      as: 'orderItems',
      attributes: []
    }],
    group: ['Product.id'],
    order: [[sequelize.literal('orderCount'), 'DESC']],
    limit: 10,
    where: { isActive: true }
  });
};
```

**4. Recently Viewed (Session-based)**
- Stored in user session or localStorage
- Displayed on homepage/product pages

### 6. Order Management System

#### Order Status Workflow
```
pending → processing → shipped → delivered
                ↓
            cancelled
```

#### Admin Order Management
**Location:** `backend/src/controllers/adminController.js`

**Get All Orders (`GET /api/admin/orders`)**
```javascript
const orders = await db.Order.findAll({
  include: [
    { model: db.User, as: 'user', attributes: ['firstName', 'lastName', 'email'] },
    { 
      model: db.OrderItem,
      as: 'orderItems',
      include: [{ model: db.Product, as: 'product' }]
    }
  ],
  order: [['createdAt', 'DESC']]
});
```

**Update Order Status (`PUT /api/admin/orders/:id/status`)**
```javascript
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  
  // Validate status transition
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = await db.Order.findByPk(req.params.id);
  
  // Prevent status change after delivery
  if (order.status === 'delivered' && status !== 'delivered') {
    return res.status(400).json({ 
      message: 'Cannot change status of delivered order'
    });
  }

  await order.update({ status });
  
  // Send email notification to user
  // await sendOrderStatusEmail(order);

  res.json({ success: true, order });
};
```

### 7. Security Implementation

#### Password Security
```javascript
// User Model Hook
beforeCreate: async (user) => {
  user.password = await bcrypt.hash(user.password, 12);
};

// Password validation
validatePassword: async function(password) {
  return await bcrypt.compare(password, this.password);
};
```

#### JWT Security
**Location:** `backend/src/config/jwt.js`
```javascript
const COOKIE_OPTIONS = {
  httpOnly: true,           // Prevent XSS attacks
  secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
  sameSite: 'strict',       // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
};
```

#### Rate Limiting
**Location:** `backend/src/middleware/rateLimit.js`
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // Only 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later'
});
```

#### SQL Injection Prevention
- Sequelize ORM uses parameterized queries
- All input sanitized automatically

#### XSS Prevention
- HttpOnly cookies prevent JavaScript access
- EJS auto-escapes output by default
- Content Security Policy headers

### 8. Backend Deployment

#### Render Deployment
**Platform:** Render.com

**Configuration (`render.yaml`):**
```yaml
services:
  - type: web
    name: ecommerce-backend
    env: node
    buildCommand: npm install && npx sequelize-cli db:migrate
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: ecommerce-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: STRIPE_SECRET_KEY
        sync: false

databases:
  - name: ecommerce-db
    databaseName: ecommerce
    plan: starter
```

**Deployment Steps:**
1. Push code to GitHub repository
2. Connect Render to GitHub repo
3. Configure environment variables
4. Render auto-deploys on git push to main branch

**Database Hosting:**
- PostgreSQL on Render
- Automatic backups
- Connection pooling enabled

**Environment Variables Set:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NODE_ENV=production
PORT=3000
```

---

## Integration Points

### Frontend ↔ Backend Communication

1. **Authentication Flow:**
   - React Admin sends login credentials → Backend validates → Returns JWT token
   - Token stored in localStorage + httpOnly cookie
   - All subsequent requests include token in Authorization header

2. **Data Fetching:**
   - Admin Panel: Axios requests to `/api/admin/*` endpoints
   - Customer Pages: EJS renders server-side with data from controllers

3. **Real-time Updates:**
   - Admin actions trigger API calls
   - Response updates React state
   - UI re-renders automatically

### Database ↔ Backend Integration

1. **Sequelize ORM:**
   - Models define table structure
   - Migrations create/modify tables
   - Seeders populate initial data
   - Associations enable complex queries

2. **Query Optimization:**
   - Eager loading with `include`
   - Indexes on frequently queried fields (slug, email)
   - Pagination to limit result sets

### Payment Flow Integration

1. **Cart → Checkout → Stripe → Order:**
   - User adds items to cart (stored in database)
   - Proceeds to checkout (validates cart)
   - Creates Stripe session (line items from cart)
   - Redirects to Stripe hosted checkout
   - Webhook confirms payment
   - Order status updated, cart cleared

---

## Technology Stack Summary

### Frontend (Abdullah)
- **React 18** with React Router v6
- **Vite** build tool
- **Tailwind CSS** for styling
- **Axios** for API requests
- **Context API** for state management
- **EJS** template engine

### Backend (Abdul Hannan & Muhammad Ramzan)
- **Node.js** runtime
- **Express.js** framework
- **PostgreSQL** database
- **Sequelize ORM** for database operations
- **bcrypt** for password hashing
- **jsonwebtoken** for JWT authentication
- **Stripe API** for payments
- **express-rate-limit** for rate limiting
- **cookie-parser** for cookie handling

### Deployment
- **Vercel** - React Admin Panel
- **Render** - Node.js Backend + PostgreSQL Database

---

## Testing & Quality Assurance

### API Testing (Abdul Hannan)
- Postman collection with 30+ endpoints tested
- Test cases for success and error scenarios
- Documentation of expected responses

### Manual Testing
- Cart flow: Add → Update → Checkout → Payment
- Authentication: Register → Login → Protected Routes
- Admin operations: CRUD on products, orders, categories
- Error handling: Invalid inputs, expired tokens, insufficient stock

---

## Conclusion

This project demonstrates a production-ready e-commerce application with:
- **Secure authentication & authorization**
- **Complete payment processing** with Stripe
- **Scalable database design** with proper relationships
- **Modern React frontend** with protected routes
- **RESTful API** with comprehensive error handling
- **Responsive UI** for both admin and customer interfaces
- **Cloud deployment** on industry-standard platforms

Each team member contributed specialized skills to create a cohesive, full-stack application that handles real-world e-commerce requirements.
