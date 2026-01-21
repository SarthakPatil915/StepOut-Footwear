# StepOut - E-Commerce Platform for Footwear

A complete, production-ready e-commerce platform for a footwear brand "StepOut" similar to Flipkart but specialized in shoes. Built with modern technologies for both frontend and backend.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Admin Credentials](#admin-credentials)
- [Database Schema](#database-schema)
- [Features Documentation](#features-documentation)

## 🎯 Features

### Customer Features
- ✅ User Registration & Authentication (JWT)
- ✅ Browse Footwear Products by Category
- ✅ Advanced Product Search & Filtering
- ✅ Product Details with Reviews
- ✅ Shopping Cart Management
- ✅ Address Management
- ✅ Checkout with Multiple Payment Options
- ✅ Order Tracking
- ✅ Order History

### Admin Features
- ✅ Complete Product Management (CRUD)
- ✅ Inventory Management
- ✅ Order Management & Status Updates
- ✅ User Management
- ✅ Discount/Offer Management
- ✅ Dashboard with Statistics
- ✅ Admin-only protected routes

## 🛠 Tech Stack

### Frontend
- **React.js** - UI Library
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client
- **React Icons** - Icon Library
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **Helmet** - Security
- **CORS** - Cross-origin Support

## 📂 Project Structure

```
stepout-ecommerce/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── errorHandler.js
│   ├── seeders/
│   │   └── seedData.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── ProductCard.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── ProductListing.js
│   │   │   ├── ProductDetails.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── customer/
│   │   │   │   ├── Cart.js
│   │   │   │   ├── Checkout.js
│   │   │   │   └── Orders.js
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.js
│   │   │       ├── ProductManagement.js
│   │   │       └── OrderManagement.js
│   │   ├── utils/
│   │   │   ├── apiEndpoints.js
│   │   │   └── axiosInstance.js
│   │   ├── styles/
│   │   │   └── (tailwind styles)
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file with:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stepout
JWT_SECRET=stepout_jwt_secret_key_production_2024
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Seed sample data:**
```bash
npm run seed
```

5. **Start backend server:**
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **.env file is already configured**

4. **Start frontend development server:**
```bash
npm start
```

Frontend will run on: `http://localhost:3000`

## 📝 Usage

### Accessing the Application

**Customer:**
- Go to `http://localhost:3000`
- Register a new account or login
- Browse products and add to cart
- Checkout and place orders

**Admin:**
- Go to `http://localhost:3000/login`
- Click "Try Admin Demo" button
- Or use credentials:
  - Email: `admin@stepout.com`
  - Password: `StepOut@123`

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new customer
POST   /api/auth/login             - Customer login
POST   /api/auth/admin-login       - Admin login
GET    /api/auth/profile           - Get user profile
PUT    /api/auth/profile           - Update profile
```

### Products
```
GET    /api/products               - Get all products with filters
GET    /api/products/:id           - Get product details
POST   /api/products               - Create product (Admin)
PUT    /api/products/:id           - Update product (Admin)
DELETE /api/products/:id           - Delete product (Admin)
POST   /api/products/:id/review    - Add product review
```

### Cart
```
GET    /api/cart                   - Get user cart
POST   /api/cart/add               - Add item to cart
PUT    /api/cart/update            - Update cart item
DELETE /api/cart/remove            - Remove item from cart
DELETE /api/cart/clear             - Clear entire cart
```

### Orders
```
POST   /api/orders                 - Create order
GET    /api/orders/my-orders       - Get customer orders
GET    /api/orders/:id             - Get order details
PUT    /api/orders/:id/cancel      - Cancel order
GET    /api/orders                 - Get all orders (Admin)
PUT    /api/orders/:id/status      - Update order status (Admin)
```

### Addresses
```
GET    /api/auth/addresses         - Get all addresses
POST   /api/auth/addresses         - Add new address
DELETE /api/auth/addresses/:id     - Delete address
```

## 👨‍💼 Admin Credentials

**Demo Admin Account (Hardcoded):**
- Email: `admin@stepout.com`
- Password: `StepOut@123`

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: 'customer' | 'admin',
  addresses: [{
    fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault
  }],
  profileImage: String,
  isActive: Boolean,
  timestamps
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  category: 'Men' | 'Women' | 'Sports' | 'Casual' | 'Formal',
  price: Number,
  discount: Number (0-100),
  discountedPrice: Number,
  stock: Number,
  images: [String],
  brand: String,
  sizes: [{ size, stock }],
  rating: Number (0-5),
  reviews: [{ userId, userName, rating, comment }],
  isActive: Boolean,
  timestamps
}
```

### Order Model
```javascript
{
  orderNumber: String (unique),
  userId: ObjectId (ref: User),
  items: [{
    productId, productName, price, quantity, size, image
  }],
  totalAmount: Number,
  discount: Number,
  finalAmount: Number,
  shippingAddress: { /* address object */ },
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD',
  paymentStatus: 'Pending' | 'Completed' | 'Failed',
  orderStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled',
  timestamps
}
```

### Cart Model
```javascript
{
  userId: ObjectId (ref: User, unique),
  items: [{
    productId, quantity, size, price, image
  }],
  totalItems: Number,
  totalPrice: Number,
  timestamps
}
```

## 🎯 Features Documentation

### Product Categories
- **Men** - Men's footwear
- **Women** - Women's footwear
- **Sports** - Sports & athletic shoes
- **Casual** - Casual everyday footwear
- **Formal** - Formal business shoes

### Available Sizes
- 5, 6, 7, 8, 9, 10, 11, 12, 13, 14

### Payment Methods
- **UPI** - Unified Payments Interface
- **Card** - Credit/Debit Cards
- **NetBanking** - Net Banking
- **COD** - Cash on Delivery

### Order Status Flow
1. **Pending** - Order placed, awaiting confirmation
2. **Confirmed** - Order confirmed by admin
3. **Shipped** - Order shipped to customer
4. **Delivered** - Order delivered
5. **Cancelled** - Order cancelled

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Protected admin routes
- ✅ Input validation
- ✅ CORS enabled
- ✅ Helmet for HTTP headers
- ✅ Rate limiting on API endpoints

## 📈 Sample Data

The seeder creates:
- 1 Admin user
- 8 Sample products across different categories
- Pre-configured sizes and stock levels
- Sample images using placeholder service

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
```bash
# Build and deploy
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel
```

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize for your needs.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ by a Full-Stack Developer**
#   s t e p  
 