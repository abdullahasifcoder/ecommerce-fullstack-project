@echo off
REM E-Commerce Project Startup Script for Windows
REM This script helps start all services for development

echo.
echo ========================================
echo   E-Commerce Project Startup Script
echo ========================================
echo.

REM Check if PostgreSQL is running
echo Checking PostgreSQL...
pg_isready -q
if errorlevel 1 (
    echo [ERROR] PostgreSQL is not running!
    echo Please start PostgreSQL and try again.
    pause
    exit /b 1
)
echo [OK] PostgreSQL is running
echo.

REM Check if database exists
echo Checking database...
psql -U postgres -lqt | findstr /C:"ecommerce_db" >nul
if errorlevel 1 (
    echo [INFO] Database 'ecommerce_db' not found. Creating...
    createdb -U postgres ecommerce_db
    echo [OK] Database created
) else (
    echo [OK] Database exists
)
echo.

REM Navigate to backend
cd /d "%~dp0backend"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] Installing backend dependencies...
    call npm install
    echo [OK] Backend dependencies installed
)

REM Run migrations
echo Running database migrations...
call npm run migrate
echo.

REM Run seeders
echo Seeding database with demo data...
call npm run seed
echo.

echo [OK] Backend setup complete!
echo.

REM Navigate to admin
cd ..\admin

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] Installing admin panel dependencies...
    call npm install
    echo [OK] Admin panel dependencies installed
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Start Backend (Terminal 1):
echo    cd backend ^&^& npm run dev
echo.
echo 2. Start Admin Panel (Terminal 2):
echo    cd admin ^&^& npm run dev
echo.
echo 3. Access the application:
echo    Customer Site: http://localhost:3000
echo    Admin Panel:   http://localhost:5174
echo.
echo Default Credentials:
echo    Customer: demo@test.com / Demo@123
echo    Admin:    admin@ecommerce.com / Admin@123
echo.
echo Stripe Test Card: 4242 4242 4242 4242
echo.
pause
