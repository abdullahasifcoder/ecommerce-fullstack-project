# Deployment Guide

Complete guide for deploying the E-Commerce Platform to production environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Heroku Deployment](#heroku-deployment)
4. [Render Deployment](#render-deployment)
5. [AWS Deployment](#aws-deployment)
6. [DigitalOcean Deployment](#digitalocean-deployment)
7. [Post-Deployment Steps](#post-deployment-steps)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] PostgreSQL database provisioned
- [ ] Stripe account with API keys
- [ ] Domain name (optional)
- [ ] SSL certificate (most platforms provide this)
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Admin panel built (`npm run build`)
- [ ] All dependencies installed
- [ ] Security settings configured

---

## Environment Setup

### Production Environment Variables

Create a production `.env` file with:

```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=ecommerce_prod
DB_USER=your-db-user
DB_PASSWORD=your-secure-db-password
DB_SSL=true

# JWT (Generate secure keys)
JWT_SECRET=your-super-long-random-production-secret-key-min-64-chars
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Stripe (Use live keys)
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_SUCCESS_URL=https://yourdomain.com/orders
STRIPE_CANCEL_URL=https://yourdomain.com/checkout

# Admin
ADMIN_URL=https://admin.yourdomain.com

# CORS
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
```

### Generate Secure Keys

```bash
# Generate JWT secret (use output in .env)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Heroku Deployment

### 1. Install Heroku CLI

```bash
# Install Heroku CLI
# Windows (with Chocolatey):
choco install heroku-cli

# macOS:
brew tap heroku/brew && brew install heroku

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Login to Heroku

```bash
heroku login
```

### 3. Create Heroku App

```bash
cd backend
heroku create your-app-name
heroku addons:create heroku-postgresql:essential-0
```

### 4. Configure Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set STRIPE_SECRET_KEY=sk_live_xxx
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_xxx
heroku config:set STRIPE_SUCCESS_URL=https://your-app-name.herokuapp.com/orders
heroku config:set STRIPE_CANCEL_URL=https://your-app-name.herokuapp.com/checkout
```

### 5. Create Procfile

Create `backend/Procfile`:

```
web: node src/server.js
```

### 6. Deploy

```bash
git init
git add .
git commit -m "Initial deployment"
git push heroku main
```

### 7. Run Migrations

```bash
heroku run npx sequelize-cli db:migrate
heroku run npx sequelize-cli db:seed:all
```

### 8. Open App

```bash
heroku open
```

### 9. Deploy Admin Panel

For admin panel, create a separate Heroku app:

```bash
cd ../admin
heroku create your-app-name-admin

# Update vite.config.js to point to production API
# Then build and deploy
npm run build
```

Or use Netlify/Vercel for the React admin panel (recommended).

---

## Render Deployment

### 1. Create Account

Sign up at [render.com](https://render.com)

### 2. Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Choose name: `ecommerce-db`
3. Select region
4. Choose plan (Free or Starter)
5. Click "Create Database"
6. Copy the **Internal Database URL**

### 3. Create Web Service (Backend)

1. Click "New +" → "Web Service"
2. Connect your Git repository
3. Configure:
   - **Name:** `ecommerce-backend`
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install && npx sequelize-cli db:migrate`
   - **Start Command:** `cd backend && npm start`
   - **Instance Type:** Free or Starter

### 4. Add Environment Variables

In the web service settings, add:

```
NODE_ENV=production
DATABASE_URL=[paste internal database URL]
JWT_SECRET=[your-secret]
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_SUCCESS_URL=https://ecommerce-backend.onrender.com/orders
STRIPE_CANCEL_URL=https://ecommerce-backend.onrender.com/checkout
```

### 5. Deploy

Click "Create Web Service" - Render will automatically deploy.

### 6. Seed Database

Use Render Shell:

```bash
cd backend
npx sequelize-cli db:seed:all
```

### 7. Deploy Admin Panel

1. Create another Web Service or use Static Site
2. For Static Site:
   - **Build Command:** `cd admin && npm install && npm run build`
   - **Publish Directory:** `admin/dist`

---

## AWS Deployment

### Architecture

- **EC2:** Application server
- **RDS:** PostgreSQL database
- **S3:** Static assets (images)
- **CloudFront:** CDN
- **Route 53:** DNS

### 1. Create RDS Database

```bash
# Via AWS Console:
1. Go to RDS → Create Database
2. Choose PostgreSQL
3. Template: Production
4. DB instance: db.t3.micro (or larger)
5. Set master password
6. Enable public access (or use VPC)
7. Create database
```

### 2. Launch EC2 Instance

```bash
# Via AWS Console:
1. Launch EC2 instance (Ubuntu 22.04)
2. Instance type: t2.micro (Free tier) or larger
3. Configure security group:
   - SSH (22) from your IP
   - HTTP (80) from anywhere
   - HTTPS (443) from anywhere
   - Custom TCP (5000) from anywhere
4. Launch and download key pair
```

### 3. Connect to EC2

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### 4. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install PM2
sudo npm install -g pm2
```

### 5. Clone and Setup Application

```bash
cd /var/www
sudo git clone your-repo-url ecommerce
cd ecommerce/backend
sudo npm install
```

### 6. Configure Environment

```bash
sudo nano .env
# Paste your production environment variables
# Use RDS endpoint as DB_HOST
```

### 7. Run Migrations

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 8. Start with PM2

```bash
pm2 start src/server.js --name ecommerce-backend
pm2 save
pm2 startup
```

### 9. Setup Nginx as Reverse Proxy

```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/ecommerce
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 10. Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 11. Deploy Admin Panel to S3

```bash
cd ../admin
npm run build

# Install AWS CLI
pip3 install awscli

# Configure
aws configure

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Setup CloudFront distribution pointing to S3
```

---

## DigitalOcean Deployment

### 1. Create Droplet

```bash
# Via DigitalOcean Console:
1. Create → Droplets
2. Choose Ubuntu 22.04
3. Plan: Basic ($6/month)
4. Add SSH key
5. Create Droplet
```

### 2. Create Managed Database

```bash
# Via DigitalOcean Console:
1. Create → Databases
2. Choose PostgreSQL 14
3. Plan: Basic ($15/month)
4. Same datacenter as Droplet
5. Create Database Cluster
6. Add Droplet to trusted sources
```

### 3. Setup Application

Follow similar steps as AWS EC2 (steps 3-8 above).

### 4. Setup Domain

```bash
# Via DigitalOcean Console:
1. Networking → Add Domain
2. Add A record pointing to Droplet IP
3. Setup SSL with Let's Encrypt (same as AWS step 10)
```

### 5. Deploy Admin with App Platform

```bash
# Via DigitalOcean Console:
1. Create → Apps
2. Connect GitHub repository (admin folder)
3. Configure:
   - Build Command: npm run build
   - Output Directory: dist
4. Deploy
```

---

## Post-Deployment Steps

### 1. Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/orders/webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook secret to environment variables
5. Restart application

### 2. Create Admin Account

```bash
# Connect to production database
psql -h your-db-host -U your-db-user -d ecommerce_prod

# Insert admin
INSERT INTO "Admins" (name, email, password, role, "isActive", "createdAt", "updatedAt")
VALUES (
  'Admin User',
  'admin@yourdomain.com',
  '[bcrypt hash of password]',
  'superadmin',
  true,
  NOW(),
  NOW()
);
```

Or use seeder in production.

### 3. Test Application

- [ ] Register new user
- [ ] Browse products
- [ ] Add to cart
- [ ] Complete checkout with test card
- [ ] Verify order created
- [ ] Login to admin panel
- [ ] Check dashboard stats
- [ ] Test CRUD operations

### 4. Setup Monitoring

**Application Monitoring:**
```bash
# Install monitoring tools
npm install --save @sentry/node
```

**Server Monitoring:**
- Use PM2 monitoring
- Setup CloudWatch (AWS)
- Use DigitalOcean Monitoring
- Implement logging with Winston

**Database Monitoring:**
- Enable query logging
- Setup backup schedules
- Monitor connection pool

### 5. Setup Backups

**Database Backups:**

```bash
# Automated daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

Add to crontab:
```bash
0 2 * * * /path/to/backup-script.sh
```

### 6. Performance Optimization

- Enable gzip compression in Nginx
- Setup CDN for static assets
- Implement Redis caching
- Optimize database queries
- Enable database connection pooling
- Minify frontend assets

### 7. Security Hardening

- [ ] Update all dependencies
- [ ] Enable firewall (ufw)
- [ ] Configure fail2ban
- [ ] Implement rate limiting
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Add security headers
- [ ] Regular security audits

**Security Headers (Nginx):**

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 8. Setup CI/CD

**GitHub Actions Example:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/ecommerce
            git pull origin main
            cd backend
            npm install
            npx sequelize-cli db:migrate
            pm2 restart ecommerce-backend
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Check database connection
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Check environment variables
echo $DATABASE_URL

# Check database logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

### Application Crashes

```bash
# Check PM2 logs
pm2 logs ecommerce-backend

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check application logs
tail -f backend/logs/error.log
```

### Stripe Webhook Issues

- Verify webhook URL is accessible
- Check webhook secret matches
- Use Stripe CLI to test: `stripe listen --forward-to localhost:5000/api/orders/webhook`
- Check webhook event logs in Stripe Dashboard

---

## Scaling

### Horizontal Scaling

- Use load balancer (AWS ELB, Nginx)
- Deploy multiple app instances
- Implement session store (Redis)
- Use managed database with read replicas

### Vertical Scaling

- Increase instance size
- Add more RAM
- Upgrade database plan
- Use faster storage (SSD)

### Database Optimization

- Add database indexes
- Implement query caching
- Use connection pooling
- Consider read replicas for heavy read operations

---

## Cost Estimation

### Heroku (Hobby)
- Web Dyno: $7/month
- Postgres: $9/month
- **Total: ~$16/month**

### Render (Starter)
- Web Service: $7/month
- PostgreSQL: $7/month
- **Total: ~$14/month**

### DigitalOcean
- Droplet: $6/month
- Managed Database: $15/month
- **Total: ~$21/month**

### AWS (Basic)
- EC2 t2.micro: $8/month
- RDS db.t3.micro: $15/month
- S3 + CloudFront: $5/month
- **Total: ~$28/month**

---

## Support

For deployment issues:
- Check platform documentation
- Review application logs
- Contact platform support
- Create GitHub issue

---

**Last Updated:** 2024
**Version:** 1.0.0
