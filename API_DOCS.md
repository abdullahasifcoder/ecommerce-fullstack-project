# API Documentation

Complete REST API documentation for the E-Commerce Platform.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in httpOnly cookie (automatically handled by browser) or in Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "message": "Success message",
  "data": { }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Endpoints

### Authentication

#### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

---

#### Login User

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

---

#### Logout User

```http
POST /auth/logout
```

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### Get Current User

```http
GET /auth/me
```

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "shippingAddress": "{...}",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Update Profile

```http
PUT /auth/profile
```

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+1987654321",
  "shippingAddress": "{\"address\":\"123 Main St\",\"city\":\"New York\",\"state\":\"NY\",\"zipCode\":\"10001\",\"country\":\"USA\"}"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { }
}
```

---

### Admin Authentication

#### Admin Login

```http
POST /admin/auth/login
```

**Request Body:**
```json
{
  "email": "admin@ecommerce.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Admin login successful",
  "admin": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@ecommerce.com",
    "role": "superadmin"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

---

#### Get Dashboard Stats

```http
GET /admin/dashboard/stats
```

**Authentication:** Required (Admin)

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalRevenue": 15000.50,
    "totalOrders": 125,
    "totalProducts": 50,
    "totalUsers": 300,
    "pendingOrders": 15,
    "lowStockProducts": 5,
    "recentRevenue": 2500.00,
    "monthlyRevenue": [
      { "month": "Jan", "revenue": 5000 },
      { "month": "Feb", "revenue": 6000 }
    ],
    "topProducts": [
      {
        "id": 1,
        "name": "Product 1",
        "sold": 100,
        "revenue": 5000
      }
    ],
    "recentOrders": []
  }
}
```

---

### Products

#### Get All Products

```http
GET /products
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (number): Filter by category ID
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `search` (string): Search term
- `sort` (string): Sort field (default: createdAt)
- `order` (string): Sort order (ASC/DESC, default: DESC)

**Example:**
```http
GET /products?page=1&limit=12&category=1&minPrice=10&maxPrice=100&search=laptop&sort=price&order=ASC
```

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "slug": "laptop",
      "sku": "LAP-001",
      "price": 999.99,
      "compareAtPrice": 1299.99,
      "stock": 50,
      "images": ["image1.jpg"],
      "shortDescription": "High-performance laptop",
      "description": "Full description...",
      "isFeatured": true,
      "isActive": true,
      "categoryId": 1,
      "Category": {
        "id": 1,
        "name": "Electronics"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

#### Get Product by ID

```http
GET /products/:id
```

**Response (200):**
```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Laptop",
    "price": 999.99,
    "stock": 50,
    "Category": { },
    "relatedProducts": []
  }
}
```

---

#### Create Product (Admin)

```http
POST /products
```

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "name": "New Product",
  "sku": "PROD-001",
  "price": 49.99,
  "compareAtPrice": 59.99,
  "stock": 100,
  "categoryId": 1,
  "shortDescription": "Short desc",
  "description": "Full description",
  "images": ["image1.jpg", "image2.jpg"],
  "isFeatured": true,
  "isActive": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": { }
}
```

---

#### Update Product (Admin)

```http
PUT /products/:id
```

**Authentication:** Required (Admin)

**Request Body:** Same as Create Product

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": { }
}
```

---

#### Delete Product (Admin)

```http
DELETE /products/:id
```

**Authentication:** Required (Admin)

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Categories

#### Get All Categories

```http
GET /categories
```

**Response (200):**
```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic products",
      "image": "electronics.jpg",
      "isActive": true,
      "parentId": null,
      "productCount": 25
    }
  ]
}
```

---

#### Get Category by ID

```http
GET /categories/:id
```

**Response (200):**
```json
{
  "success": true,
  "category": {
    "id": 1,
    "name": "Electronics",
    "Products": []
  }
}
```

---

#### Create Category (Admin)

```http
POST /categories
```

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "name": "New Category",
  "description": "Category description",
  "image": "category.jpg",
  "parentId": null
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": { }
}
```

---

#### Update Category (Admin)

```http
PUT /categories/:id
```

**Authentication:** Required (Admin)

**Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "category": { }
}
```

---

#### Delete Category (Admin)

```http
DELETE /categories/:id
```

**Authentication:** Required (Admin)

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

### Cart

#### Get Cart

```http
GET /cart
```

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "price": 999.99,
        "Product": {
          "id": 1,
          "name": "Laptop",
          "images": ["image.jpg"],
          "stock": 50
        }
      }
    ],
    "itemCount": 2,
    "subtotal": 1999.98
  }
}
```

---

#### Add to Cart

```http
POST /cart
```

**Authentication:** Required

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "cartItem": { }
}
```

---

#### Update Cart Item

```http
PUT /cart/:id
```

**Authentication:** Required

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "cartItem": { }
}
```

---

#### Remove from Cart

```http
DELETE /cart/:id
```

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

#### Clear Cart

```http
DELETE /cart
```

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

### Orders

#### Create Checkout Session

```http
POST /orders/checkout
```

**Authentication:** Required

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "notes": "Please deliver in the morning"
}
```

**Response (200):**
```json
{
  "success": true,
  "url": "https://checkout.stripe.com/session_id"
}
```

---

#### Stripe Webhook

```http
POST /orders/webhook
```

**Note:** This endpoint is called by Stripe. Use `express.raw()` middleware.

---

#### Get User Orders

```http
GET /orders
```

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "id": 1,
      "orderNumber": "ORD-1234567890",
      "total": 1999.98,
      "status": "processing",
      "paymentStatus": "paid",
      "shippingAddress": "{...}",
      "OrderItems": [
        {
          "productName": "Laptop",
          "quantity": 2,
          "price": 999.99
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Get All Orders (Admin)

```http
GET /orders/admin/all
```

**Authentication:** Required (Admin)

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status

**Response (200):**
```json
{
  "success": true,
  "orders": [],
  "pagination": { }
}
```

---

#### Update Order Status (Admin)

```http
PUT /orders/admin/:id/status
```

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Valid statuses:** pending, processing, shipped, delivered, cancelled

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": { }
}
```

---

## Error Codes

| Code | Message |
|------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting

- **Auth Endpoints:** 5 requests per 15 minutes per IP
- **API Endpoints:** 100 requests per 15 minutes per IP
- **Webhook Endpoints:** 3 requests per hour per IP

## Pagination

Paginated endpoints return:

```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Webhooks

### Stripe Webhook Events

The application handles the following Stripe events:

- `checkout.session.completed` - Payment successful, creates order

Configure webhook URL in Stripe Dashboard:
```
https://yourdomain.com/api/orders/webhook
```

---

**Last Updated:** 2024
**API Version:** 1.0.0
