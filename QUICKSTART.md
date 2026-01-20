# StepOut - Quick Start Guide

## 🎯 Quick Setup (5 minutes)

### Windows Users
```bash
setup.bat
```

### Mac/Linux Users
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

#### Step 1: Start Backend
```bash
cd backend
npm install
npm run dev
```

#### Step 2: In another terminal, Start Frontend
```bash
cd frontend
npm install
npm start
```

## 🔓 Login Credentials

### Admin Account (Demo)
- **Email:** admin@stepout.com
- **Password:** StepOut@123

### Test Customer Account
- You can register a new customer account during setup

## 📱 What to Test

### As a Customer:
1. ✅ Register/Login
2. ✅ Browse products with filters
3. ✅ View product details
4. ✅ Add to cart
5. ✅ Checkout process
6. ✅ Place order (COD)
7. ✅ View order history

### As an Admin:
1. ✅ Admin Login
2. ✅ View Dashboard
3. ✅ Add/Edit/Delete Products
4. ✅ Manage Orders
5. ✅ View Users

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally
- Or update `.env` with MongoDB Atlas connection string

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Use `PORT=3001 npm start`

### CORS Error
- Check `FRONTEND_URL` in backend `.env`
- Should match frontend URL

## 📧 Email/Password Reset

Currently, the app uses hardcoded admin credentials. For production:
1. Implement email verification
2. Add password reset functionality
3. Use environment variables for sensitive data

## 🎨 Customization

### Change Brand Colors
Edit `frontend/tailwind.config.js` - orange color values

### Modify Categories
Edit `backend/models/Product.js` - category enum

### Update Payment Methods
Edit `backend/models/Order.js` - paymentMethod enum

## 🚀 Next Steps for Production

1. **Database**
   - Use MongoDB Atlas
   - Set up backup/restore

2. **Authentication**
   - Implement email verification
   - Add 2FA support
   - Password reset via email

3. **Payment**
   - Integrate Razorpay/Stripe
   - Implement webhooks

4. **Security**
   - Add rate limiting per IP
   - Implement request validation
   - Use HTTPS

5. **Deployment**
   - Deploy backend to Heroku/Railway
   - Deploy frontend to Vercel/Netlify
   - Set up CI/CD pipeline

## 📚 API Documentation

See `API_ENDPOINTS.md` for detailed API documentation.

## ❓ FAQ

**Q: How to change admin password?**
A: Currently hardcoded. Implement proper auth system in production.

**Q: Can I add multiple admins?**
A: Yes, modify `authController.js` to support multiple admins.

**Q: How to add payment integration?**
A: Check `orderController.js` for payment method field.

**Q: How to modify product filters?**
A: Edit `productController.js` getAllProducts method.

---

Happy Coding! 🚀
