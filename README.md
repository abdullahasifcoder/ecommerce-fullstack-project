# E-Commerce Platform - Production Ready

A complete, full-stack e-commerce platform with customer-facing website, admin panel, and Stripe payment integration.

## 🚀 Features

### Customer Features
- User registration and authentication with JWT
- Product browsing with categories, search, and filters
- Shopping cart management
- Secure checkout with Stripe
- Order history and tracking
- User profile management

### Admin Features
- Admin authentication and role-based access
- Dashboard with sales analytics and charts
- Complete product management (CRUD)
- Category management
- Order management and status updates
- Real-time statistics

### Technical Features
- RESTful API with Express.js
- PostgreSQL database with Sequelize ORM
- JWT authentication with httpOnly cookies
- Stripe payment processing
- Rate limiting and security middleware
- EJS templating for customer site
- React admin panel with Vite and Tailwind CSS
- Responsive design with Bootstrap 5

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Stripe account (for payment processing)

## 🔧 Installation

### 1. Clone the Repository

```bash
cd ecommerce-fullstack-project
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Admin Panel Dependencies

```bash
cd ../admin
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_SUCCESS_URL=http://localhost:5000/orders
STRIPE_CANCEL_URL=http://localhost:5000/checkout

# Admin
ADMIN_URL=http://localhost:5173
```

## 🗄️ Database Setup

### 1. Create Database

```bash
psql -U postgres
CREATE DATABASE ecommerce_db;
\q
```

### 2. Run Migrations

```bash
cd backend
npx sequelize-cli db:migrate
```

### 3. Seed Sample Data

```bash
npx sequelize-cli db:seed:all
```

This will create:
- 10 product categories
- 50+ sample products
- Test admin account (email: admin@ecommerce.com, password: admin123)

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
Server runs at: http://localhost:5000

**Terminal 2 - Admin Panel:**
```bash
cd admin
npm run dev
```
Admin panel runs at: http://localhost:5173

### Production Mode

```bash
cd backend
npm start
```

Build admin panel:
```bash
cd admin
npm run build
```

## 📱 Accessing the Application

### Customer Site
- Homepage: http://localhost:5000
- Shop: http://localhost:5000/shop
- Login: http://localhost:5000/login
- Register: http://localhost:5000/register

### Admin Panel
- Login: http://localhost:5173/login
- Default credentials:
  - Email: admin@ecommerce.com
  - Password: admin123

## 🔐 API Endpoints

See [API_DOCS.md](./API_DOCS.md) for complete API documentation.

### Quick Reference

**Authentication:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user

**Products:**
- GET `/api/products` - List all products
- GET `/api/products/:id` - Get product details
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

**Cart:**
- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:id` - Update cart item
- DELETE `/api/cart/:id` - Remove cart item

**Orders:**
- POST `/api/orders/checkout` - Create Stripe checkout session
- GET `/api/orders` - Get user's orders
- GET `/api/orders/admin/all` - Get all orders (Admin)

## 🧪 Testing

### Test Admin Account
- Email: admin@ecommerce.com
- Password: admin123

### Test Stripe Cards
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002

## 📦 Project Structure

```
ecommerce-fullstack-project/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and app config
│   │   ├── models/         # Sequelize models
│   │   ├── migrations/     # Database migrations
│   │   ├── seeders/        # Data seeders
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   ├── views/          # EJS templates
│   │   │   ├── layouts/    # Layout templates
│   │   │   ├── partials/   # Reusable components
│   │   │   └── pages/      # Page templates
│   │   ├── public/         # Static assets
│   │   └── server.js       # Express app
│   ├── .env.example
│   └── package.json
├── admin/
│   ├── src/
│   │   ├── api/            # Axios configuration
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── API_DOCS.md
├── DEPLOYMENT.md
└── README.md
```

## 🛠️ Built With

### Backend
- **Express.js** - Web framework
- **Sequelize** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing
- **EJS** - Templating engine

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client

## 🔒 Security Features

- JWT token authentication
- httpOnly cookies
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- CORS configuration
- Input validation with express-validator
- SQL injection prevention with Sequelize
- XSS protection

## 📈 Performance Optimizations

- Database indexes on frequently queried fields
- Eager loading for related data
- Pagination for large datasets
- Image lazy loading
- Caching strategies
- Optimized queries with Sequelize

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Heroku
- Render
- AWS
- DigitalOcean

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development/production |
| PORT | Server port | 5000 |
| DB_HOST | Database host | localhost |
| DB_NAME | Database name | ecommerce_db |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | yourpassword |
| JWT_SECRET | JWT signing secret | random_string_here |
| STRIPE_SECRET_KEY | Stripe secret key | sk_test_... |
| STRIPE_WEBHOOK_SECRET | Stripe webhook secret | whsec_... |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@example.com or create an issue in the repository.

## 🙏 Acknowledgments

- Bootstrap for CSS framework
- Tailwind CSS for admin panel styling
- Stripe for payment processing
- Font Awesome for icons
- Recharts for data visualization

## 📊 Database Schema

See the ER diagram in the project root for complete database schema visualization.

## 🔄 API Rate Limits

- Authentication endpoints: 5 requests per 15 minutes
- Standard API endpoints: 100 requests per 15 minutes
- Webhook endpoints: 3 requests per hour

## 🐛 Known Issues

None at this time. Please report any issues you find!

## 🗺️ Roadmap

- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add email notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Product recommendations AI
- [ ] Mobile app version

---

**Made with ❤️ for E-Commerce Excellence**
