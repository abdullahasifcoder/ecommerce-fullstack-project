#!/bin/bash

# E-Commerce Project Startup Script
# This script helps start all services for development

echo "🚀 E-Commerce Project Startup Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo "📊 Checking PostgreSQL..."
if ! pg_isready -q; then
    echo -e "${RED}❌ PostgreSQL is not running!${NC}"
    echo "Please start PostgreSQL and try again."
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL is running${NC}"
echo ""

# Check if database exists
echo "🗄️  Checking database..."
if ! psql -lqt | cut -d \| -f 1 | grep -qw ecommerce_db; then
    echo -e "${YELLOW}⚠️  Database 'ecommerce_db' not found. Creating...${NC}"
    createdb ecommerce_db
    echo -e "${GREEN}✅ Database created${NC}"
else
    echo -e "${GREEN}✅ Database exists${NC}"
fi
echo ""

# Navigate to backend
cd "$(dirname "$0")/backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
fi

# Run migrations
echo "🔄 Running database migrations..."
npm run migrate
echo ""

# Run seeders
echo "🌱 Seeding database with demo data..."
npm run seed
echo ""

echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo ""

# Navigate to admin
cd ../admin

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing admin panel dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Admin panel dependencies installed${NC}"
fi

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1️⃣  Start Backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo ""
echo "2️⃣  Start Admin Panel (Terminal 2):"
echo "   cd admin && npm run dev"
echo ""
echo "3️⃣  Access the application:"
echo "   👤 Customer Site: http://localhost:3000"
echo "   🔐 Admin Panel:   http://localhost:5174"
echo ""
echo "🔑 Default Credentials:"
echo "   Customer: demo@test.com / Demo@123"
echo "   Admin:    admin@ecommerce.com / Admin@123"
echo ""
echo "💳 Stripe Test Card: 4242 4242 4242 4242"
echo ""
