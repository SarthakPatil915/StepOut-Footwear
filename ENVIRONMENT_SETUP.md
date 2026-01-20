# Environment Setup Guide

Complete guide for setting up environment variables and configuration files.

## 📋 Backend Environment Setup

### File: `backend/.env`

Create this file with the following content:

```env
# Server Port
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/stepout
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stepout?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=stepout_jwt_secret_key_production_2024
JWT_EXPIRE=7d

# Password Hashing
BCRYPT_ROUNDS=10

# Environment
NODE_ENV=development
# Use 'production' for production builds

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
# Use https://yourdomain.com for production

# Optional: Payment Gateway Keys (for future integration)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Environment Variable Explanations

| Variable | Purpose | Default | Notes |
|----------|---------|---------|-------|
| PORT | Server port | 5000 | Change if port is in use |
| MONGODB_URI | Database connection | localhost | Use MongoDB Atlas for production |
| JWT_SECRET | Token encryption key | custom string | Change for production |
| JWT_EXPIRE | Token expiration | 7d | Format: 30d, 7d, etc |
| BCRYPT_ROUNDS | Password hashing complexity | 10 | Higher = slower but more secure |
| NODE_ENV | Environment type | development | Change to 'production' for deployment |
| FRONTEND_URL | Frontend location | localhost:3000 | Update for CORS |

---

## 📋 Frontend Environment Setup

### File: `frontend/.env`

Create this file with the following content:

```env
# API Base URL
REACT_APP_API_URL=http://localhost:5000/api
# Use https://api.yourdomain.com/api for production

# Optional: Analytics (future integration)
REACT_APP_GOOGLE_ANALYTICS_ID=

# Optional: Payment Gateway (future integration)
REACT_APP_RAZORPAY_KEY=
```

### Environment Variable Explanations

| Variable | Purpose | Notes |
|----------|---------|-------|
| REACT_APP_API_URL | Backend API endpoint | Must start with REACT_APP_ |
| REACT_APP_GOOGLE_ANALYTICS_ID | Analytics tracking | Optional |
| REACT_APP_RAZORPAY_KEY | Payment gateway key | Optional |

**Note**: All frontend environment variables must start with `REACT_APP_` to be accessible in React.

---

## 🗄️ MongoDB Setup

### Local MongoDB

#### Windows
1. Download from mongodb.com/try/download/community
2. Install with MongoDB Compass option
3. Run MongoDB:
```bash
mongod
```

#### Mac
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)

1. Go to mongodb.com/cloud/atlas
2. Create account and free tier cluster
3. Get connection string
4. Replace in `MONGODB_URI`:
```
mongodb+srv://username:password@cluster-name.mongodb.net/stepout?retryWrites=true&w=majority
```

---

## 🔐 Security Best Practices

### Development Environment

**backend/.env (Development)**
```env
JWT_SECRET=dev_secret_key_12345
BCRYPT_ROUNDS=10
NODE_ENV=development
```

### Production Environment

**backend/.env (Production)**
```env
JWT_SECRET=generate-long-random-string-here
BCRYPT_ROUNDS=12
NODE_ENV=production
```

**Generate a Secure JWT Secret:**
```bash
# Run in Node.js console
require('crypto').randomBytes(32).toString('hex')
```

---

## 🚀 Deployment Environment Setup

### For Railway.app

**backend/.env**
```env
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/stepout
JWT_SECRET=your_secure_secret_key
BCRYPT_ROUNDS=12
NODE_ENV=production
FRONTEND_URL=https://yourdomain.vercel.app
```

### For Vercel (Frontend)

Create `.env.production` in frontend folder:
```env
REACT_APP_API_URL=https://your-api.railway.app/api
```

### For Heroku

```bash
heroku create your-app-name
heroku config:set PORT=5000
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
```

---

## 📝 Configuration Files

### backend/package.json (Important sections)

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seeders/seedData.js"
  }
}
```

### frontend/package.json (Important sections)

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "proxy": "http://localhost:5000"
}
```

---

## 🐛 Common Configuration Issues

### Issue: MongoDB Connection Error
**Solution**: 
- Ensure MongoDB is running
- Check connection string in .env
- Verify database name is correct

### Issue: API Not Responding
**Solution**:
- Check FRONTEND_URL matches actual frontend URL
- Ensure backend is running on correct PORT
- Check firewall settings

### Issue: CORS Error
**Solution**:
```bash
# In backend .env
FRONTEND_URL=http://localhost:3000
# Make sure it matches your frontend URL exactly
```

### Issue: Token Errors
**Solution**:
- Ensure JWT_SECRET is set in .env
- Check token expiration date
- Verify token format in headers

---

## 🔍 Verifying Configuration

### Test Backend Configuration

```bash
cd backend

# Check if .env is loaded
npm run dev

# Expected output:
# Server running on port 5000
# MongoDB Connected: localhost
```

### Test Frontend Configuration

```bash
cd frontend

# Check if API URL is correct
npm start

# Open browser console
# Should connect to API without errors
```

---

## 📚 Environment Variable Reference

### All Possible Variables

```env
# BACKEND

# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/stepout

# Authentication
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10

# CORS
FRONTEND_URL=http://localhost:3000

# Payment (Optional)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Email (Optional)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

# ---

# FRONTEND

# API
REACT_APP_API_URL=http://localhost:5000/api

# Analytics (Optional)
REACT_APP_GOOGLE_ANALYTICS_ID=

# Payment (Optional)
REACT_APP_RAZORPAY_KEY=

# Environment
REACT_APP_ENV=development
```

---

## 🔄 Changing Configuration

### Restart Required
After changing these .env variables, restart your server:

**Backend:**
```bash
# Stop current process (Ctrl+C)
# Then restart
npm run dev
```

**Frontend:**
```bash
# Stop current process (Ctrl+C)
# Then restart
npm start
```

### No Restart Required
For these variables, just refresh the page:
- REACT_APP_* variables (in some cases)

---

## 🎯 Configuration Checklist

- [ ] Backend .env created with all required variables
- [ ] Frontend .env created with API_URL
- [ ] MongoDB connection tested
- [ ] JWT_SECRET is strong and secure
- [ ] FRONTEND_URL matches your frontend
- [ ] PORT is available (not in use)
- [ ] Database seeding works
- [ ] API endpoints respond
- [ ] Frontend connects to API

---

## 📞 Configuration Help

### If You Need Help:
1. Check that .env files are in correct directories
2. Verify file names are exactly `.env` (not `.env.txt`)
3. Check for typos in variable names
4. Ensure no quotes around values
5. Use exact URLs (http vs https)

---

**Your configuration is now complete! Proceed to QUICKSTART.md for next steps.**
