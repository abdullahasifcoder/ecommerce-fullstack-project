# 🎓 E-Commerce Platform - Complete Viva Preparation Guide

**Project Name:** Full-Stack E-Commerce Platform with Admin Panel  
**Technologies:** Node.js, Express, PostgreSQL, React, Stripe  
**Purpose:** Final Year Project / Lab Exam  
**Last Updated:** December 15, 2025

---

## 📚 Table of Contents

1. [Project Overview & Real-World Purpose](#1-project-overview--real-world-purpose)
2. [Quick Start Commands](#2-quick-start-commands)
3. [Technology Stack Explained](#3-technology-stack-explained)
4. [System Architecture](#4-system-architecture)
5. [User Roles & Authentication](#5-user-roles--authentication)
6. [Database Design](#6-database-design)
7. [Backend Architecture](#7-backend-architecture)
8. [Customer Frontend (EJS)](#8-customer-frontend-ejs)
9. [Admin Panel (React)](#9-admin-panel-react)
10. [Shopping Cart & Checkout Flow](#10-shopping-cart--checkout-flow)
11. [Payment Integration (Stripe)](#11-payment-integration-stripe)
12. [Security Measures](#12-security-measures)
13. [Deployment](#13-deployment)
14. [Common Viva Questions & Answers](#14-common-viva-questions--answers)

---

## 1. Project Overview & Real-World Purpose

### What is this project?

This is a **complete e-commerce website** similar to Amazon or Daraz, where:
- **Customers** can browse products, add items to cart, and purchase using credit cards
- **Admins** can manage products, categories, and orders through a separate dashboard
- **Payments** are processed securely through Stripe (a real payment gateway)

### Real-World Use Case

Think of it like this: You walk into a supermarket (customer site), pick items, go to checkout, pay with your card (Stripe), and get a receipt (order confirmation). The supermarket manager (admin) uses a separate system to add new products, check inventory, and track sales.

### Why This Project Matters

1. **Full-stack skills:** You learn both frontend (what users see) and backend (server logic)
2. **Real payment processing:** Integration with actual payment gateway
3. **Role-based access:** Different interfaces for customers vs. admins
4. **Production-ready:** Uses industry-standard tools and security practices

---

## 2. Quick Start Commands

### ⚡ First Time Setup

```bash
# Navigate to project folder
cd d:/UNI/semester_5/Subjects/ADB/lab/FinalLabexamproject

# Option 1: Windows - Automated Setup
setup.bat

# Option 2: Manual Setup
cd backend
npm install
npm run migrate
npm run seed

cd ../admin
npm install
```

### 🚀 Starting the Application (Every Time)

You need **2 terminals** running simultaneously:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
✅ Runs on: http://localhost:3000

**Terminal 2 - Admin Panel:**
```bash
cd admin
npm run dev
```
✅ Runs on: http://localhost:5174

### 🔑 Login Credentials

**Customer Account:**
- Email: `demo@test.com`
- Password: `Demo@123`

**Admin Account:**
- Email: `admin@ecommerce.com`
- Password: `Admin@123`

**Stripe Test Card (For Checkout):**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVV: Any 3 digits (e.g., `123`)

---

## 3. Technology Stack Explained

### Backend Technologies

| Technology | What It Does | Why We Use It |
|------------|-------------|---------------|
| **Node.js** | JavaScript runtime (lets us run JS on server) | Fast, popular, same language as frontend |
| **Express.js** | Web framework (handles HTTP requests) | Simple, minimal, industry standard |
| **PostgreSQL** | Relational database (stores all data) | Powerful, handles relationships well |
| **Sequelize** | ORM (talks to database using JavaScript) | Avoids writing raw SQL, easier to work with |
| **JWT** | JSON Web Tokens (authentication) | Secure, stateless user sessions |
| **bcrypt** | Password hashing (security) | One-way encryption, can't be reversed |
| **Stripe** | Payment processing API | Real payment gateway, industry standard |

### Frontend Technologies

**Customer Site:**
| Technology | What It Does | Why We Use It |
|------------|-------------|---------------|
| **EJS** | Templating engine (generates HTML) | Server-side rendering, SEO-friendly |
| **Bootstrap 5** | CSS framework (styling) | Responsive, looks good on all devices |
| **Vanilla JS** | Plain JavaScript (interactivity) | No extra dependencies, lightweight |

**Admin Panel:**
| Technology | What It Does | Why We Use It |
|------------|-------------|---------------|
| **React** | UI library (builds interactive interfaces) | Component-based, reusable, modern |
| **Vite** | Build tool (bundles code) | Super fast, modern replacement for Webpack |
| **Tailwind CSS** | Utility-first CSS framework | Quick styling, customizable |
| **Axios** | HTTP client (API calls) | Cleaner than fetch, better error handling |
| **Recharts** | Charting library | Beautiful graphs for dashboard |

---

## 4. System Architecture

### High-Level Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Customer Site  │         │  Admin Panel    │         │   Stripe API    │
│  (EJS + Boot-   │         │  (React + Vite) │         │   (Payment)     │
│   strap)        │         │                 │         │                 │
│  Port 3000      │         │  Port 5174      │         │  External       │
└────────┬────────┘         └────────┬────────┘         └────────┬────────┘
         │                           │                           │
         │    HTTP/HTTPS             │    HTTP/HTTPS            │
         │    (REST API)             │    (REST API)            │
         │                           │                           │
         └───────────────┬───────────┘                           │
                         │                                       │
                   ┌─────▼──────┐                                │
                   │  Backend   │◄───────────────────────────────┘
                   │  (Express) │         Webhook
                   │  Port 3000 │
                   └─────┬──────┘
                         │
                         │ SQL Queries
                         │ (via Sequelize)
                         │
                   ┌─────▼──────┐
                   │ PostgreSQL │
                   │  Database  │
                   └────────────┘
```

### How Components Communicate

1. **Customer visits website** → Browser loads EJS pages from backend
2. **Customer adds to cart** → JavaScript sends API request to backend
3. **Admin logs in** → React app authenticates with backend API
4. **Payment processing** → Backend creates Stripe session → User pays → Stripe sends webhook to backend
5. **All data** is stored in PostgreSQL database

### Why This Architecture?

- **Separation of Concerns:** Customer site, admin panel, and backend are independent
- **Scalability:** Each part can be deployed separately
- **Security:** Admin and customer areas are completely separate
- **Flexibility:** Can easily add mobile app using same backend API

---

## 5. User Roles & Authentication

### Two Types of Users

#### 1. Customers (Regular Users)
- **Can do:**
  - Register and login
  - Browse products
  - Add to cart
  - Checkout and pay
  - View order history
  - Update profile
- **Cannot do:**
  - Access admin panel
  - Manage products
  - See other users' orders

#### 2. Admins (Store Managers)
- **Can do:**
  - Login to admin panel
  - Add/edit/delete products
  - Manage categories
  - View all orders
  - Update order status
  - View sales statistics
- **Cannot do:**
  - Shop on customer site (separate system)
  - Access customer passwords

### How Authentication Works (Simple Explanation)

**Think of it like a movie ticket:**

1. **Register/Login** = Buy a ticket at the counter
2. **JWT Token** = The ticket stub you receive
3. **httpOnly Cookie** = Security guard holds your ticket (you can't lose it)
4. **Protected Routes** = Movie theater doors that check your ticket
5. **Logout** = Throwing away the ticket when you leave

**Technical Flow:**

```
User Login
   │
   ├─► Backend checks email + password in database
   │
   ├─► If correct, create JWT token (like a signed permission slip)
   │
   ├─► Store token in httpOnly cookie (browser can't access it with JavaScript)
   │
   └─► Send back user info (without password)

Protected Request
   │
   ├─► User tries to access cart/orders
   │
   ├─► Browser automatically sends cookie
   │
   ├─► Backend middleware checks JWT token
   │
   ├─► If valid, allow access
   │
   └─► If invalid/expired, return 401 Unauthorized
```

### JWT Token Explained (For Viva)

**What is JWT?**
- JSON Web Token = A string like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Contains: User ID, email, role, expiration time
- **Signed** with secret key (like a government seal on official documents)

**Why JWT instead of sessions?**
- **Stateless:** Server doesn't need to remember who's logged in
- **Scalable:** Works across multiple servers
- **Secure:** Can't be tampered with (signature verification)

**Security Features:**
- Stored in **httpOnly cookies** (JavaScript can't steal it)
- Has **expiration time** (7 days in our case)
- Uses **strong secret key** (long random string)
- **Different tokens** for customers vs. admins

---

## 6. Database Design

### Tables and Relationships

```
Users (Customers)
  ├─ id (Primary Key)
  ├─ name
  ├─ email (Unique)
  ├─ password (Hashed)
  ├─ phone
  ├─ shippingAddress
  └─ Relationships:
       ├─ Has Many: CartItems
       └─ Has Many: Orders

Admins (Store Managers)
  ├─ id (Primary Key)
  ├─ name
  ├─ email (Unique)
  ├─ password (Hashed)
  ├─ role (superadmin/admin/manager)
  └─ isActive (Boolean)

Categories
  ├─ id (Primary Key)
  ├─ name
  ├─ slug (URL-friendly name)
  ├─ description
  ├─ image
  ├─ parentId (Self-referencing for subcategories)
  └─ Relationships:
       └─ Has Many: Products

Products
  ├─ id (Primary Key)
  ├─ name
  ├─ description
  ├─ shortDescription
  ├─ price
  ├─ comparePrice
  ├─ stock
  ├─ images (Array)
  ├─ categoryId (Foreign Key)
  └─ Relationships:
       ├─ Belongs To: Category
       ├─ Has Many: CartItems
       └─ Has Many: OrderItems

CartItems (Temporary shopping cart)
  ├─ id (Primary Key)
  ├─ userId (Foreign Key)
  ├─ productId (Foreign Key)
  ├─ quantity
  └─ Relationships:
       ├─ Belongs To: User
       └─ Belongs To: Product

Orders (Purchase records)
  ├─ id (Primary Key)
  ├─ userId (Foreign Key)
  ├─ orderNumber (Unique)
  ├─ totalAmount
  ├─ status (pending/paid/shipped/delivered)
  ├─ paymentMethod
  ├─ stripeSessionId
  ├─ shippingAddress
  └─ Relationships:
       ├─ Belongs To: User
       └─ Has Many: OrderItems

OrderItems (Individual products in an order)
  ├─ id (Primary Key)
  ├─ orderId (Foreign Key)
  ├─ productId (Foreign Key)
  ├─ quantity
  ├─ price (at time of purchase)
  └─ Relationships:
       ├─ Belongs To: Order
       └─ Belongs To: Product
```

### Why These Relationships?

**One-to-Many (1:N):**
- One User → Many Orders (a customer can place multiple orders)
- One Category → Many Products (a category contains multiple products)
- One Order → Many OrderItems (an order has multiple products)

**Many-to-Many (M:N):**
- Users ↔ Products through CartItems (many users can cart many products)
- Orders ↔ Products through OrderItems (many orders can have many products)

### Database Indexes

```sql
-- For faster queries
Users: email (unique index)
Admins: email (unique index)
Categories: slug (unique index)
Products: categoryId (foreign key index)
Orders: userId, orderNumber (indexes)
```

---

## 7. Backend Architecture

### Folder Structure Explained

```
backend/src/
├── config/            # Configuration files
│   ├── database.js    # PostgreSQL connection settings
│   ├── jwt.js         # JWT secret and expiration
│   └── stripe.js      # Stripe API keys
│
├── models/            # Database models (tables)
│   ├── User.js        # Customer accounts
│   ├── Admin.js       # Admin accounts
│   ├── Category.js    # Product categories
│   ├── Product.js     # Products
│   ├── CartItem.js    # Shopping cart
│   ├── Order.js       # Orders
│   ├── OrderItem.js   # Order line items
│   └── index.js       # Model associations
│
├── controllers/       # Business logic
│   ├── authController.js      # Login, register, logout
│   ├── adminController.js     # Admin-specific operations
│   ├── productController.js   # Product CRUD
│   ├── categoryController.js  # Category CRUD
│   ├── cartController.js      # Cart operations
│   └── orderController.js     # Order processing, Stripe
│
├── middleware/        # Request processing
│   ├── auth.js        # Check if user is logged in
│   ├── error.js       # Error handling
│   └── rateLimit.js   # Prevent spam/attacks
│
├── routes/            # URL endpoints
│   ├── authRoutes.js      # /api/auth/*
│   ├── adminRoutes.js     # /api/admin/*
│   ├── productRoutes.js   # /api/products/*
│   ├── categoryRoutes.js  # /api/categories/*
│   ├── cartRoutes.js      # /api/cart/*
│   ├── orderRoutes.js     # /api/orders/*
│   └── viewRoutes.js      # / (customer pages)
│
├── views/             # EJS templates (customer site)
│   ├── layouts/       # Common layout (header/footer)
│   ├── pages/         # Individual pages
│   └── partials/      # Reusable components
│
├── migrations/        # Database schema changes
├── seeders/           # Sample data for testing
├── utils/             # Helper functions
└── server.js          # Main application entry point
```

### Request Flow Example

**Customer adds product to cart:**

```
1. Browser sends: POST /api/cart
   Body: { productId: 5, quantity: 2 }
   Cookie: token=eyJhbGc...

2. Express receives request
   ↓
3. Rate limiter (middleware) checks if too many requests
   ↓
4. Auth middleware (auth.js) verifies JWT token
   ↓
5. Router (cartRoutes.js) directs to controller
   ↓
6. Controller (cartController.js):
   - Checks if product exists
   - Checks stock availability
   - Checks if item already in cart
   - If yes, updates quantity
   - If no, creates new cart item
   ↓
7. Sequelize saves to database
   ↓
8. Response sent back: { success: true, cartItem: {...} }
```

### Middleware Explained

**Think of middleware like airport security checkpoints:**

```
Request enters → Checkpoint 1 → Checkpoint 2 → Checkpoint 3 → Controller
                 (Rate Limit)    (Auth Check)    (Validation)
```

**1. Rate Limiter (`rateLimit.js`):**
- Prevents spam (max 100 requests per 15 minutes)
- Like: "Sir, you've asked too many questions, please wait"

**2. Authentication (`auth.js`):**
- Checks if user is logged in
- Like: "Show me your boarding pass"

**3. Error Handler (`error.js`):**
- Catches all errors and formats response
- Like: "If anything goes wrong, here's a proper explanation"

### API Response Format

All API responses follow this structure:

**Success:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "id": 1,
    "quantity": 2,
    "product": {...}
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Product not found",
  "errors": []
}
```

---

## 8. Customer Frontend (EJS)

### What is EJS?

**EJS = Embedded JavaScript**
- Think of it like Word document templates with fill-in-the-blank spaces
- Server fills in the blanks with real data before sending to browser

**Example:**
```html
<!-- EJS Template -->
<h1>Welcome, <%= user.name %>!</h1>

<!-- Server processes it -->
<h1>Welcome, John Doe!</h1>
```

### Customer Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page, featured products |
| Shop | `/shop` | Browse all products with filters |
| Product Detail | `/products/:id` | View single product |
| Cart | `/cart` | Review cart items |
| Checkout | `/checkout` | Enter shipping info, pay |
| Orders | `/orders` | View order history |
| Login | `/login` | User authentication |
| Register | `/register` | New account creation |
| Profile | `/profile` | Update user info |

### How EJS Templates Work

**Layout Structure:**
```
main.ejs (header)
   ↓
home.ejs (content)
   ↓
main_end.ejs (footer)
```

**Partials (Reusable Components):**
- `navbar.ejs` - Navigation menu (appears on every page)
- `footer.ejs` - Footer content (appears on every page)

**Data Flow:**
```
Controller → Renders Template → Sends HTML to Browser

Example:
res.render('pages/shop', {
  products: [...],
  categories: [...],
  user: req.user
});
```

### Bootstrap 5 Styling

**Why Bootstrap?**
- Pre-made components (buttons, cards, forms)
- Responsive grid system (works on mobile/tablet/desktop)
- No need to write much CSS

**Common Components Used:**
- **Navbar:** Navigation menu at top
- **Cards:** Product display boxes
- **Buttons:** Add to cart, checkout
- **Forms:** Login, register, checkout forms
- **Modal:** Pop-up messages

---

## 9. Admin Panel (React)

### Why React Instead of EJS?

| Feature | EJS | React |
|---------|-----|-------|
| Page reload | Yes (full page) | No (single page app) |
| Speed | Slower | Faster (after initial load) |
| Interactivity | Limited | Highly interactive |
| Best for | Content websites | Dashboards, apps |

**Think of it like:**
- **EJS** = Traditional restaurant menu (get new menu each time)
- **React** = iPad menu (updates instantly without fetching new pages)

### Admin Pages

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/login` | Admin authentication |
| Dashboard | `/` | Statistics, charts, overview |
| Products | `/products` | Manage products (CRUD) |
| Categories | `/categories` | Manage categories (CRUD) |
| Orders | `/orders` | View and update order status |

### React Concepts Used

**1. Components (Building Blocks):**
```jsx
// Reusable table component
<Table data={products} columns={columns} />

// Can use it for products, orders, categories
```

**2. State Management (Data Storage):**
```jsx
const [products, setProducts] = useState([]);
// products = current data
// setProducts = function to update data
```

**3. Context API (Global State):**
```jsx
// AuthContext stores logged-in admin info
// Available to all components without passing props
```

**4. Hooks:**
- `useState` - Store data
- `useEffect` - Run code when component loads
- `useNavigate` - Change pages
- Custom hook: `useApi` - Fetch data from backend

### Dashboard Features

**Statistics:**
- Total sales ($)
- Number of orders
- Product count
- Customer count

**Charts (Recharts):**
- Sales by month (line chart)
- Orders by status (pie chart)
- Top products (bar chart)

**Real-time Updates:**
- When admin updates order, dashboard refreshes
- No page reload needed

### CRUD Operations Example

**Creating a Product:**

```jsx
1. Admin clicks "Add Product" button
   ↓
2. Modal opens with form
   ↓
3. Admin fills in:
   - Name, description
   - Price, stock
   - Category
   - Images
   ↓
4. Submit button clicked
   ↓
5. React sends POST request to backend:
   POST /api/admin/products
   Body: { name: "...", price: 99, ... }
   ↓
6. Backend creates product in database
   ↓
7. Response received
   ↓
8. React updates product list (no page reload)
   ↓
9. Success message shown
```

---

## 10. Shopping Cart & Checkout Flow

### Shopping Cart Explained

**Database Storage (Not Session):**
- Cart items stored in `CartItems` table
- Persists even if user closes browser
- Survives server restarts

**Why database instead of localStorage?**
- Works across devices (phone and computer)
- Secure (can't be manipulated by user)
- Admin can see abandoned carts

### Cart Operations

**Add to Cart:**
```
User clicks "Add to Cart"
   ↓
Check if logged in (redirect to login if not)
   ↓
Check if product in stock
   ↓
Check if already in cart
   ├─ Yes: Increase quantity
   └─ No: Create new cart item
   ↓
Update cart total
   ↓
Show success message
```

**Update Quantity:**
```
User changes quantity
   ↓
Validate: quantity > 0 and ≤ stock
   ↓
Update cart item
   ↓
Recalculate total
```

**Remove from Cart:**
```
User clicks remove
   ↓
Delete cart item from database
   ↓
Recalculate total
```

### Checkout Flow

```
Step 1: Cart Review
  - User sees all items
  - Can update quantities
  - Sees subtotal, tax, shipping
  ↓
Step 2: Shipping Information
  - Fill in address
  - Phone number
  - Notes (optional)
  ↓
Step 3: Payment
  - Click "Proceed to Payment"
  - Backend creates Stripe Checkout session
  - User redirected to Stripe's secure page
  ↓
Step 4: Payment (On Stripe)
  - User enters card details
  - Stripe processes payment
  - If successful: redirected back
  - If failed: shown error
  ↓
Step 5: Order Creation
  - Stripe sends webhook to backend
  - Backend creates Order record
  - Moves CartItems to OrderItems
  - Clears user's cart
  - Decreases product stock
  ↓
Step 6: Confirmation
  - User sees "Order Successful" page
  - Email sent (if configured)
  - Order number displayed
```

### Cart Total Calculation

```javascript
Subtotal = Sum of (price × quantity) for all items
Tax = Subtotal × 0.1 (10%)
Shipping = $10 (flat rate, or free if subtotal > $100)
Total = Subtotal + Tax + Shipping
```

---

## 11. Payment Integration (Stripe)

### What is Stripe?

**Stripe = Payment processor**
- Like: PayPal, Square, but for developers
- Handles: Credit cards, debit cards, digital wallets
- Used by: Amazon, Shopify, Uber, many others

**Why Stripe?**
- **Secure:** PCI compliant (we never touch card details)
- **Easy:** Simple API integration
- **Global:** Accepts cards from 135+ countries
- **Test mode:** Can test without real money

### How Stripe Payment Works

```
1. User clicks "Pay Now" on our site
   ↓
2. Our backend creates Stripe Checkout Session:
   - Products with prices
   - Customer email
   - Success/cancel URLs
   ↓
3. Stripe returns session URL
   ↓
4. User redirected to Stripe's hosted page
   (This is Stripe's secure page, not ours)
   ↓
5. User enters card details on Stripe page
   ↓
6. Stripe processes payment
   ├─ Success: User redirected to success URL
   └─ Failure: User sees error on Stripe page
   ↓
7. Stripe sends webhook to our backend
   (POST /api/orders/webhook)
   ↓
8. Backend receives webhook:
   - Verifies it's really from Stripe (signature check)
   - Creates order in database
   - Clears cart
   - Updates stock
   ↓
9. User sees order confirmation
```

### Why Webhooks?

**Without webhook:**
- User pays on Stripe
- Closes browser before redirected back
- We never know payment succeeded
- Order never created ❌

**With webhook:**
- Stripe directly tells our server "Payment successful"
- Happens even if user closes browser
- Reliable order creation ✅

### Stripe Security

**1. We Never See Card Numbers:**
- User enters card on Stripe's page
- We only receive: payment status, transaction ID

**2. Webhook Signature Verification:**
```javascript
// Stripe signs webhook with secret key
// We verify signature to ensure it's not fake
const signature = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body, signature, WEBHOOK_SECRET
);
```

**3. Test Mode:**
- Development uses test keys (sk_test_...)
- Production uses live keys (sk_live_...)
- Test payments don't charge real cards

### Test Cards

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card declined |
| 4000 0027 6000 3184 | Requires authentication (3D Secure) |

---

## 12. Security Measures

### 1. Password Security

**Hashing (One-Way Encryption):**
```
User enters: "MyPassword123"
   ↓
bcrypt.hash() with 12 salt rounds
   ↓
Stored in DB: "$2b$12$KIXGmZJT7..."

Login attempt:
   ↓
bcrypt.compare("MyPassword123", storedHash)
   ↓
Returns true if match
```

**Why not reversible encryption?**
- If database is stolen, hacker can't get real passwords
- Even admins can't see user passwords
- Each password has unique salt (random data added)

### 2. JWT Token Security

**httpOnly Cookies:**
```javascript
// Token stored in cookie that JavaScript can't access
res.cookie('token', jwtToken, {
  httpOnly: true,        // JS can't read it
  secure: true,          // HTTPS only (in production)
  sameSite: 'strict',    // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});
```

**Why httpOnly?**
- Prevents XSS attacks (malicious JavaScript can't steal token)
- Browser automatically includes it in requests
- Can only be cleared by server

### 3. Input Validation

**Every user input is validated:**

```javascript
// Example: Create product
[
  body('name')
    .trim()                          // Remove whitespace
    .isLength({ min: 3, max: 200 })  // Length check
    .notEmpty(),                     // Not empty
  
  body('price')
    .isFloat({ min: 0.01 })          // Valid number
    .toFloat(),                       // Convert to number
  
  body('email')
    .isEmail()                        // Valid email format
    .normalizeEmail()                 // Lowercase, trim
]
```

**Why validate?**
- Prevents SQL injection
- Prevents XSS (cross-site scripting)
- Ensures data integrity
- Better error messages

### 4. Rate Limiting

**Prevents abuse:**
```javascript
// Max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});
```

**Protects against:**
- Brute force attacks (password guessing)
- DDoS attacks (server overload)
- API abuse

### 5. CORS (Cross-Origin Resource Sharing)

**Allows only specific origins:**
```javascript
cors({
  origin: [
    'http://localhost:5174',  // Admin panel
    'http://localhost:3000'   // Customer site
  ],
  credentials: true  // Allow cookies
})
```

**Why?**
- Prevents random websites from accessing our API
- Only our frontend can make requests

### 6. Environment Variables

**Sensitive data in .env (never committed to Git):**
```env
JWT_SECRET=super_long_random_string_min_32_chars
DB_PASSWORD=secure_database_password
STRIPE_SECRET_KEY=sk_live_your_key
```

**Why?**
- Keeps secrets out of code
- Different values for dev/test/prod
- Easy to change without code changes

### 7. SQL Injection Prevention

**Sequelize uses parameterized queries:**
```javascript
// Unsafe (vulnerable):
db.query(`SELECT * FROM users WHERE email = '${userInput}'`);

// Safe (Sequelize does this):
User.findOne({ where: { email: userInput } });
// Automatically escapes special characters
```

---

## 13. Deployment

### Deployment Architecture

```
Frontend (Admin Panel)
  - Deployed on: Vercel / Netlify
  - Built with: npm run build
  - Serves: Static HTML/CSS/JS
  ↓ (API Calls)
Backend
  - Deployed on: Render / Heroku / Railway
  - Runs: Node.js server
  - Serves: API + Customer site (EJS)
  ↓ (SQL Queries)
Database
  - Hosted on: Render / Supabase / AWS RDS
  - Type: PostgreSQL
  - Runs: Managed database service
```

### Deployment Steps (High-Level)

**1. Database:**
```bash
# Create PostgreSQL database on hosting service
# Get connection URL
# Run migrations: npx sequelize-cli db:migrate
```

**2. Backend:**
```bash
# Push code to GitHub
# Connect hosting service to GitHub repo
# Set environment variables
# Deploy
```

**3. Admin Panel:**
```bash
# Update API URL to production backend
# Build: npm run build
# Deploy to Vercel
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=postgres://user:pass@host:5432/db
JWT_SECRET=very_long_secure_random_string
STRIPE_SECRET_KEY=sk_live_your_production_key
ADMIN_URL=https://admin.yourdomain.com
CUSTOMER_URL=https://yourdomain.com
```

### Health Checks

```javascript
// GET /health
// Returns server status for monitoring
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-15T10:30:00Z"
}
```

---

## 14. Common Viva Questions & Answers

### General Project Questions

**Q: What is this project?**
**A:** This is a full-stack e-commerce platform with three main components: a customer-facing website where users can browse and purchase products, an admin panel for managing the store, and a backend API that connects everything. Payments are processed through Stripe, a real payment gateway.

**Q: What problem does it solve?**
**A:** It provides a complete online shopping solution. Businesses can use it to sell products online, manage inventory, track orders, and accept payments securely. Customers get a smooth shopping experience similar to Amazon or any major e-commerce site.

**Q: Why did you choose these technologies?**
**A:**
- **Node.js + Express:** Fast, JavaScript on both frontend and backend, large ecosystem
- **PostgreSQL:** Relational database, handles complex relationships well (users, products, orders)
- **React:** Modern, component-based, perfect for interactive admin dashboards
- **EJS:** Server-side rendering, good for SEO, simpler than React for content pages
- **Stripe:** Industry standard, secure, handles all payment complexity

---

### Architecture Questions

**Q: Explain the system architecture.**
**A:** The system has three layers:
1. **Frontend Layer:** Customer site (EJS) and Admin panel (React)
2. **Backend Layer:** Express.js server with REST API
3. **Database Layer:** PostgreSQL

The admin panel and customer site are separate applications. Both communicate with the backend through HTTP requests. The backend handles all business logic and database operations. Stripe is integrated for payment processing through webhooks.

**Q: Why separate admin panel from customer site?**
**A:** 
- **Security:** Admins can't accidentally expose admin features to customers
- **Technology:** Admin needs rich interactivity (React), customers need SEO (EJS)
- **Performance:** Admin panel doesn't slow down customer site
- **Deployment:** Can deploy separately, scale independently

**Q: What is REST API?**
**A:** REST (Representational State Transfer) is a way to design APIs using HTTP methods:
- **GET:** Retrieve data (get products)
- **POST:** Create data (add product)
- **PUT:** Update data (edit product)
- **DELETE:** Remove data (delete product)

Each URL represents a resource (e.g., `/api/products/5`). It's stateless, meaning each request is independent.

---

### Database Questions

**Q: Explain your database schema.**
**A:** We have 7 main tables:
1. **Users:** Customer accounts
2. **Admins:** Store manager accounts
3. **Categories:** Product categories (electronics, clothing, etc.)
4. **Products:** Product catalog with prices, stock, images
5. **CartItems:** Temporary shopping cart
6. **Orders:** Purchase records
7. **OrderItems:** Individual products in each order

**Relationships:**
- User has many Orders (one customer, multiple purchases)
- Category has many Products (one category, multiple products)
- Order has many OrderItems (one order, multiple products)
- Many-to-many between Users and Products through CartItems

**Q: Why use ORM (Sequelize)?**
**A:** 
- **Easier syntax:** Write JavaScript instead of SQL
- **Protection:** Prevents SQL injection automatically
- **Relationships:** Easy to define and query related data
- **Migrations:** Track database changes over time
- **Database agnostic:** Can switch from PostgreSQL to MySQL easily

**Q: What are migrations?**
**A:** Migrations are version control for database. Each migration file is a step to change the database schema (create table, add column, etc.). They can be:
- **Applied:** `npx sequelize-cli db:migrate` (move forward)
- **Reverted:** `npx sequelize-cli db:migrate:undo` (move backward)

This ensures everyone on the team has the same database structure.

---

### Authentication Questions

**Q: How does authentication work?**
**A:**
1. User submits email + password
2. Backend checks credentials in database
3. If valid, creates JWT token containing user ID, email, expiration
4. Token stored in httpOnly cookie (secure)
5. For subsequent requests, browser automatically sends cookie
6. Middleware verifies token before allowing access
7. If token invalid/expired, user must login again

**Q: What is JWT?**
**A:** JSON Web Token is a string with three parts:
- **Header:** Algorithm (HS256)
- **Payload:** User data (id, email, role)
- **Signature:** Encrypted hash to verify authenticity

Example: `eyJhbGciOi...` (Base64 encoded)

It's **signed** with a secret key. Anyone can decode it, but only we can create valid ones.

**Q: JWT vs Sessions - why JWT?**
**A:**

| Feature | Sessions | JWT |
|---------|----------|-----|
| Storage | Server (RAM/Redis) | Client (cookie) |
| Scalability | Hard (need shared storage) | Easy (stateless) |
| Lookup | Required (database/cache) | Not needed |
| Size | Small session ID | Larger (contains data) |

JWT is better for modern APIs because it doesn't require server to remember sessions.

**Q: What is httpOnly cookie?**
**A:** A cookie that JavaScript cannot access. Only the browser and server can read it. This prevents XSS attacks where malicious JavaScript tries to steal authentication tokens.

---

### Security Questions

**Q: How do you store passwords?**
**A:** We use bcrypt hashing with 12 salt rounds. When user registers:
1. Password "MyPass123" is hashed → `$2b$12$random...`
2. Hash stored in database
3. Original password discarded

On login:
1. User enters password
2. We hash it again
3. Compare with stored hash
4. If match, login successful

**Cannot be reversed.** Even if database is stolen, hackers can't get real passwords.

**Q: What is bcrypt salt?**
**A:** Random data added to password before hashing. Same password gets different hash each time. Prevents rainbow table attacks (precomputed hash lists).

**Q: How do you prevent SQL injection?**
**A:** We use Sequelize ORM which automatically escapes user input. All queries use parameterized statements, not string concatenation.

**Unsafe:**
```javascript
query(`SELECT * FROM users WHERE id = ${userId}`);
```

**Safe (Sequelize):**
```javascript
User.findByPk(userId);  // Automatically escaped
```

**Q: What is CORS and why is it needed?**
**A:** CORS = Cross-Origin Resource Sharing. By default, browsers block requests from different domains (security feature).

Our backend is on `localhost:3000`, admin panel on `localhost:5174`. Without CORS, admin panel can't call API.

We configure CORS to allow only our frontend origins, not random websites.

**Q: Explain rate limiting.**
**A:** Limits number of requests from one IP address (100 per 15 minutes). Prevents:
- Brute force (password guessing)
- DDoS (overload server)
- Scraping (stealing data)

If exceeded, user gets 429 error "Too many requests".

---

### Payment Questions

**Q: How does payment processing work?**
**A:**
1. User proceeds to checkout
2. Backend creates Stripe Checkout Session
3. User redirected to Stripe's secure page (not our site)
4. User enters card on Stripe
5. Stripe processes payment
6. Stripe sends webhook to our backend
7. We verify webhook signature
8. Create order in database
9. Clear cart, reduce stock
10. User sees confirmation

**Q: Why use Stripe instead of handling cards yourself?**
**A:** 
- **Security:** PCI compliance is extremely complex
- **Legal:** Storing card data has strict regulations
- **Trust:** Users trust Stripe's secure page
- **Features:** Fraud detection, multiple currencies, various payment methods

We **never** see or store card numbers.

**Q: What is a webhook?**
**A:** A webhook is when Stripe calls our API to notify us of events. Like a callback.

Flow:
```
Payment succeeds on Stripe
   ↓
Stripe POSTs to: https://oursite.com/api/orders/webhook
   ↓
Our backend receives notification
   ↓
We process the order
```

**Q: Why is webhook necessary?**
**A:** User might close browser after payment, before being redirected back. Webhook ensures we always get notified, even if user leaves. It's server-to-server, not dependent on user's browser.

---

### Frontend Questions

**Q: Difference between EJS and React?**
**A:**

| Aspect | EJS | React |
|--------|-----|-------|
| Rendering | Server-side | Client-side |
| Page load | Full reload | Single page |
| SEO | Excellent | Requires SSR |
| Complexity | Simple | More complex |
| Use case | Content sites | Web apps |

**Q: Why use both?**
**A:**
- **Customer site (EJS):** Content-heavy, needs SEO, simpler
- **Admin panel (React):** Complex interactions, forms, real-time updates

**Q: What is virtual DOM in React?**
**A:** React keeps a copy of the page structure in memory. When data changes:
1. React updates virtual DOM (fast)
2. Compares with real DOM (diff)
3. Updates only changed parts (efficient)

Much faster than rebuilding entire page.

**Q: What is component in React?**
**A:** Reusable piece of UI. Like LEGO blocks. Example:

```jsx
<Table data={products} />
<Table data={orders} />
<Table data={categories} />
```

Same table component, different data.

---

### Backend Questions

**Q: Explain middleware.**
**A:** Functions that run before your main logic. Like airport security checkpoints.

```
Request → Rate Limiter → Auth Check → Validation → Controller
```

Each middleware can:
- Modify request
- Send response early (error)
- Pass to next middleware

**Q: What is Express.js?**
**A:** Minimal web framework for Node.js. Handles:
- Routing (which URL → which function)
- Middleware (request processing)
- Request/response handling
- View rendering (EJS)

It's the "E" in MERN/MEAN stack.

**Q: How do you handle errors?**
**A:** We have error handling middleware at the end:

```javascript
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  });
});
```

All errors bubble up and get caught here. Sends consistent error responses.

**Q: What is async/await?**
**A:** Way to write asynchronous code that looks synchronous.

**Without:**
```javascript
getUser(id, (user) => {
  getOrders(user.id, (orders) => {
    console.log(orders);
  });
});
```

**With:**
```javascript
const user = await getUser(id);
const orders = await getOrders(user.id);
console.log(orders);
```

Much cleaner, easier to read.

---

### Testing Questions

**Q: How do you test the application?**
**A:**
- **Manual testing:** Use the website, try all features
- **Postman:** Test API endpoints directly
- **Test cards:** Stripe provides test card numbers
- **Different browsers:** Chrome, Firefox, Safari
- **Mobile testing:** Responsive design check

**Q: What is Postman?**
**A:** Tool to test APIs without needing a frontend. Can:
- Send GET/POST/PUT/DELETE requests
- Set headers, cookies, body
- Save request collections
- Automate tests

We have `postman_collection.json` with all API endpoints.

---

### Performance Questions

**Q: How do you optimize performance?**
**A:**
- **Database indexes:** Fast lookups on email, IDs
- **Pagination:** Don't load all products at once
- **Caching:** Browser caches static files
- **Minification:** Compress JavaScript/CSS
- **CDN:** Serve images from fast servers
- **Lazy loading:** Load images when needed

**Q: What if database becomes slow?**
**A:**
- Add more indexes
- Use caching (Redis)
- Database connection pooling
- Read replicas for heavy reads
- Optimize queries (avoid N+1 problem)

---

### Deployment Questions

**Q: How do you deploy this?**
**A:**
1. **Database:** Create PostgreSQL on Render/Supabase
2. **Backend:** Deploy to Render/Heroku (Node.js)
3. **Admin:** Build and deploy to Vercel/Netlify

Set environment variables on each platform.

**Q: What is production vs development?**
**A:**

| Aspect | Development | Production |
|--------|-------------|------------|
| Environment | Local computer | Cloud servers |
| Database | Local PostgreSQL | Managed database |
| Debugging | Enabled | Disabled |
| HTTPS | Not required | Required |
| Error messages | Detailed | Generic |

**Q: What is CI/CD?**
**A:** Continuous Integration / Continuous Deployment. Automate:
- Run tests
- Build application
- Deploy to servers

Every push to GitHub automatically deploys. We use GitHub Actions or Render's auto-deploy.

---

### Advanced Questions

**Q: How would you scale this application?**
**A:**
1. **Horizontal scaling:** Add more servers (load balancer)
2. **Database replication:** Multiple database copies
3. **Caching layer:** Redis for frequent queries
4. **CDN:** Serve images from edge locations
5. **Microservices:** Split into smaller services
6. **Queue system:** Background jobs for emails, notifications

**Q: What is N+1 query problem?**
**A:** Inefficient database queries.

**Bad (N+1):**
```javascript
// 1 query to get orders
const orders = await Order.findAll();
// Then N queries (one per order) to get user
for (let order of orders) {
  const user = await User.findByPk(order.userId);
}
// Total: 1 + N queries
```

**Good (1 query):**
```javascript
const orders = await Order.findAll({
  include: [User]  // JOIN in SQL
});
// Total: 1 query
```

**Q: What is the difference between PUT and PATCH?**
**A:**
- **PUT:** Replace entire resource
- **PATCH:** Update specific fields

Example:
```javascript
// PUT - send all fields
{ name: "New Name", price: 99, stock: 50, ... }

// PATCH - send only changed fields
{ price: 99 }
```

**Q: How do you handle file uploads (images)?**
**A:**
1. Use `multer` middleware
2. Validate file type/size
3. Rename file (unique name)
4. Store in `/uploads` or cloud (AWS S3)
5. Save file path in database
6. Serve through static route or CDN

**Q: What is the difference between authentication and authorization?**
**A:**
- **Authentication:** Who are you? (Login verification)
- **Authorization:** What can you do? (Permission check)

Example:
- **Authentication:** User logs in with email/password
- **Authorization:** Only admins can delete products

---

### Troubleshooting Questions

**Q: User can't login - how do you debug?**
**A:**
1. Check if email exists in database
2. Check if password hash matches
3. Check if JWT secret is correct
4. Check if cookie is being set
5. Check browser console for errors
6. Check network tab for API response
7. Check server logs

**Q: Payment succeeded but order not created - why?**
**A:**
- Webhook not received (firewall blocking)
- Webhook signature verification failed
- Database error during order creation
- Stripe webhook URL not configured

**Solution:** Check Stripe dashboard for webhook events, check server logs.

**Q: Admin panel shows "Network Error" - fix?**
**A:**
1. Check if backend is running
2. Check CORS configuration
3. Check API URL in admin panel
4. Check browser console for exact error
5. Test API with Postman

---

## 📌 Key Points to Remember

### For Viva Success:

1. **Know the flow:** User visits site → Browses → Adds to cart → Checkout → Payment → Order confirmation

2. **Explain simply:** Use real-world analogies (restaurant menu, movie tickets, supermarket)

3. **Be honest:** If you don't know, say "I'm not sure, but I know where to find out"

4. **Show understanding:** Don't just memorize, explain WHY we use each technology

5. **Demo ready:** Know how to start the application, have test accounts ready

6. **Backup plan:** If live demo fails, have screenshots/video ready

### Most Important Concepts:

- REST API
- JWT authentication
- Database relationships
- Payment flow
- Security measures
- MVC architecture (Model-View-Controller)

---

## 🎬 Final Checklist

**Before Viva:**
- [ ] Application runs without errors
- [ ] Database seeded with sample data
- [ ] Test accounts working (customer + admin)
- [ ] Stripe test mode configured
- [ ] All features tested (cart, checkout, admin CRUD)
- [ ] Know your project folder structure
- [ ] Understand every file's purpose
- [ ] Can explain any code section
- [ ] Practiced demo flow
- [ ] Have backup (screenshots/video)

**During Viva:**
- [ ] Speak confidently
- [ ] Explain, don't just show
- [ ] Use technical terms correctly
- [ ] Relate to real-world use
- [ ] Handle questions calmly
- [ ] If demo fails, explain what it should do

---

## 📞 Quick Reference

**Start Commands:**
```bash
# Backend
cd backend && npm run dev

# Admin
cd admin && npm run dev
```

**URLs:**
- Customer: http://localhost:3000
- Admin: http://localhost:5174
- API: http://localhost:3000/api

**Credentials:**
- Customer: demo@test.com / Demo@123
- Admin: admin@ecommerce.com / Admin@123
- Stripe Card: 4242 4242 4242 4242

---

## 🎓 Good Luck!

Remember: You built a complete e-commerce platform with payment processing, admin panel, and security features. That's impressive! Understand the concepts, speak confidently, and you'll do great.

**The examiners want to see:**
1. You understand what you built
2. You can explain how it works
3. You know why you made certain choices
4. You can troubleshoot issues

**You've got this!** 🚀

---

**Document Version:** 1.0  
**Last Updated:** December 15, 2025  
**Created For:** Final Year Project Viva Preparation
