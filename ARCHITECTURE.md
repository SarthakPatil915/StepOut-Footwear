# Project Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│  (React.js + React Router + Tailwind CSS)                   │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Pages: Home, Products, Cart, Checkout, Orders   │       │
│  │ Components: Header, Footer, ProductCard, etc    │       │
│  │ Context: AuthContext, CartContext               │       │
│  └──────────────────────────────────────────────────┘       │
└──────────────────────┬──────────────────────────────────────┘
                       │ (Axios HTTP Requests)
                       │ (JWT Token in Headers)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│  (Express.js REST API)                                       │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Routes: auth, products, cart, orders            │       │
│  │ Controllers: Handle business logic              │       │
│  │ Middleware: Auth, Error handling, CORS          │       │
│  └──────────────────────────────────────────────────┘       │
└──────────────────────┬──────────────────────────────────────┘
                       │ (Mongoose ODM)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                             │
│  (MongoDB)                                                   │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Collections: Users, Products, Orders, Carts     │       │
│  │ Indexes: For fast queries                        │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Registration/Login
```
User Input → React Form → Axios Request → Express Controller
→ Password Hashing → MongoDB Save → JWT Generation → Response
→ LocalStorage (Token) → Context Update → Redirect
```

### Product Purchase Flow
```
Browse Products → Add to Cart → View Cart → Checkout
→ Enter Address → Select Payment → Create Order → Clear Cart
→ Order Confirmation → View Order History
```

### Admin Actions
```
Admin Login → Admin Dashboard → Product Management
→ Add/Edit/Delete Products → Order Management → Update Status
```

## Authentication Flow

```
1. User registers/logs in
2. Backend validates credentials
3. Password is hashed with bcrypt
4. JWT token is generated
5. Token stored in localStorage
6. Token included in all authenticated requests
7. Backend validates token in middleware
8. Access granted/denied based on role
```

## Component Hierarchy

```
App (Root)
├── AuthProvider (Context)
├── CartProvider (Context)
├── Header
│   ├── Navigation Links
│   └── Auth Menu
├── Main Routes
│   ├── Public Routes
│   │   ├── Home
│   │   ├── ProductListing
│   │   │   └── ProductCard (multiple)
│   │   ├── ProductDetails
│   │   ├── Login
│   │   └── Register
│   ├── Protected Routes (Customer)
│   │   ├── Cart
│   │   ├── Checkout
│   │   └── Orders
│   └── Protected Routes (Admin)
│       ├── AdminDashboard
│       ├── ProductManagement
│       └── OrderManagement
└── Footer
```

## State Management

### AuthContext
- Stores: user, token, loading
- Methods: login(), logout()
- Used by: All components requiring auth status

### CartContext
- Stores: cartItems, totalPrice
- Methods: addToCart(), removeFromCart(), updateCartItem(), clearCart()
- Used by: Cart and Checkout pages

### Local Component State
- Used for forms, modals, filters
- Props drilling for child components

## Error Handling

```
Try-Catch Blocks
    ↓
Error Handler Middleware
    ↓
Standardized Error Response
    ↓
Toast Notification (Frontend)
```

## Security Measures

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Passwords never stored in plaintext

2. **Authentication**
   - JWT tokens with expiration
   - Tokens stored only in localStorage
   - HTTPS only in production

3. **Authorization**
   - Role-based access control
   - Admin routes protected
   - Middleware checks user role

4. **Data Validation**
   - Input validation on backend
   - Email format validation
   - Required field checks

5. **API Security**
   - CORS enabled
   - Helmet for HTTP headers
   - Rate limiting on routes

## Database Indexes

For optimal performance, the following indexes are recommended:

```javascript
// User collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Product collection
db.products.createIndex({ category: 1 })
db.products.createIndex({ brand: 1 })
db.products.createIndex({ isActive: 1 })

// Order collection
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ orderStatus: 1 })

// Cart collection
db.carts.createIndex({ userId: 1 }, { unique: true })
```

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Performance Considerations

1. **Frontend**
   - Code splitting with React Router
   - Lazy loading components
   - Image optimization
   - Caching with localStorage

2. **Backend**
   - Database indexing
   - Query optimization
   - Pagination for large datasets
   - Caching headers

3. **Database**
   - Connection pooling
   - Batch operations
   - Query optimization

## Scalability Features

1. **Stateless Backend**
   - Each server is independent
   - Can be horizontally scaled

2. **Modular Structure**
   - Separate controllers, routes, models
   - Easy to add new features

3. **Microservices Ready**
   - Clear separation of concerns
   - Can be split into separate services

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Production Environment                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │  Vercel     │  │   Railway    │  │  MongoDB Atlas │ │
│  │ (Frontend)  │  │  (Backend)   │  │   (Database)   │ │
│  └────────┬────┘  └──────┬───────┘  └────────┬───────┘ │
│           │               │                  │          │
│           └───────────────┼──────────────────┘          │
│                   (HTTPS/API)                           │
│                                                         │
│  CDN for Static Assets (CloudFlare)                    │
└─────────────────────────────────────────────────────────┘
```

## CI/CD Pipeline

```
Git Push
  ↓
GitHub Actions / GitLab CI
  ↓
Run Tests
  ↓
Build Docker Image (Backend)
  ↓
Deploy to Railway (Backend)
Deploy to Vercel (Frontend)
  ↓
Run E2E Tests
  ↓
Production Live ✓
```

## Monitoring & Logging

For production, implement:

1. **Error Tracking**
   - Sentry or similar service
   - Error alerts to developers

2. **Performance Monitoring**
   - Application Performance Monitoring (APM)
   - Response time tracking

3. **Logging**
   - Centralized logging service
   - Log rotation and archival

4. **Analytics**
   - User behavior tracking
   - Conversion metrics

---

**Architecture designed for scalability, maintainability, and production-readiness**
