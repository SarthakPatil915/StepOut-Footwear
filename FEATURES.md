# StepOut - Complete Feature Documentation

## Table of Contents
1. [User Management](#user-management)
2. [Product Management](#product-management)
3. [Shopping Cart](#shopping-cart)
4. [Order Management](#order-management)
5. [Admin Features](#admin-features)

---

## User Management

### Registration
- **Purpose**: Create new customer account
- **Fields**: Name, Email, Password, Confirm Password
- **Validation**:
  - Email must be unique
  - Password min 6 characters
  - Password confirmation must match
- **Response**: JWT token + user data
- **Storage**: Token in localStorage

### Login
- **Purpose**: Authenticate existing users
- **Fields**: Email, Password
- **Validation**:
  - Email must exist
  - Password must match hashed password
- **Response**: JWT token + user data
- **Security**: Password compared with bcrypt hash

### Admin Login
- **Purpose**: Authenticate admin users
- **Demo Credentials**: admin@stepout.com / StepOut@123
- **Role**: Sets user.role = 'admin'
- **Protection**: Only hardcoded credentials accepted
- **Note**: For production, implement proper admin user creation

### Profile Management
- **View Profile**: GET /auth/profile
- **Update Profile**: PUT /auth/profile (name, phone)
- **Fields**:
  - Full Name
  - Email (read-only)
  - Phone Number
  - Profile Image (optional)

### Address Management
- **Add Address**: Store multiple delivery addresses
- **Fields**:
  - Full Name
  - Phone
  - Address Line 1
  - Address Line 2 (optional)
  - City
  - State
  - Pincode
  - Set as Default (boolean)

- **Operations**:
  - Add new address
  - Delete address
  - Set default address
  - View all addresses

---

## Product Management

### Product Listing
- **Display**: Grid view with product cards
- **Information**: Image, Name, Brand, Price, Discount, Rating
- **Pagination**: Load products in chunks

### Product Filters
Available filters:
- **Category**: Men, Women, Sports, Casual, Formal
- **Price Range**: Min and Max price
- **Brand**: Search by brand name
- **Search**: Full-text search in name and description
- **Sort**: Newest, Price (Low-High), Price (High-Low), Top Rated

### Product Details
- **Gallery**: Multiple product images
- **Specifications**:
  - Product name and description
  - Brand
  - Price and discounted price
  - Discount percentage
  - Available sizes
  - Stock quantity

- **Reviews**:
  - Display customer reviews
  - Show ratings (1-5 stars)
  - Comments from other users

### Add Products (Admin)
- **Fields**:
  - Product Name
  - Description
  - Category (dropdown)
  - Price
  - Discount %
  - Stock Quantity
  - Brand
  - Multiple Images
  - Available Sizes with stock

### Edit Products (Admin)
- Modify all product fields
- Update images
- Change pricing and discounts
- Update stock levels

### Delete Products (Admin)
- Soft delete (set isActive = false)
- Products hidden from listings
- Data preserved in database

### Product Reviews
- **Add Review**: Authenticated users only
- **Fields**: Rating (1-5), Comment
- **Calculation**: Average rating calculated from all reviews
- **Display**: Reviews shown on product details page

---

## Shopping Cart

### View Cart
- Display all items in cart
- Show:
  - Product image
  - Product name
  - Selected size
  - Price per item
  - Quantity
  - Total for each item
- **Cart Summary**:
  - Subtotal
  - Shipping (Free)
  - Tax (0)
  - Total amount

### Add to Cart
- **Requirements**: User must be logged in
- **Fields**: Product ID, Quantity, Size
- **Logic**:
  - If item exists, increase quantity
  - If new item, add to cart
- **Stock Check**: Validate stock availability

### Update Cart
- **Increase Quantity**: Click + button
- **Decrease Quantity**: Click - button
- **Set Quantity**: Direct input
- **Auto-remove**: If quantity becomes 0

### Remove from Cart
- Remove specific item by product ID and size
- Update totals
- Show confirmation message

### Clear Cart
- Remove all items
- Reset totals to 0
- Clear cart after order placed

### Cart Persistence
- Cart data stored in backend (database)
- Synced with user account
- Available across sessions

---

## Order Management

### Create Order
- **Process**:
  1. User proceeds from cart to checkout
  2. Select or add delivery address
  3. Choose payment method
  4. Review order summary
  5. Place order

- **Order Details**:
  - Generated Order Number (ORD-timestamp-count)
  - Order Date
  - Items (product, size, quantity, price)
  - Totals (subtotal, discount, final amount)
  - Delivery address
  - Payment method
  - Order status

### Payment Methods
1. **Cash on Delivery (COD)**
   - No payment processing
   - Payment status: Pending
   - Pay at delivery

2. **UPI**
   - Placeholder for integration
   - Can connect with Razorpay/Stripe

3. **Credit/Debit Card**
   - Placeholder for integration
   - Can connect with Razorpay/Stripe

4. **Net Banking**
   - Placeholder for integration
   - Can connect with Razorpay/Stripe

### Order Status Tracking
- **Pending**: Order placed, awaiting confirmation
- **Confirmed**: Order confirmed by admin
- **Shipped**: Order dispatched to customer
- **Delivered**: Order received by customer
- **Cancelled**: Order cancelled by customer or admin

### View Orders
- **Customer View**: /orders
  - List all orders by user
  - Sort by date (newest first)
  - Show status, amount, date
  - Click to view details

- **Admin View**: /admin/orders
  - List all orders in system
  - Filter by status
  - Update status with dropdown
  - View customer details

### Cancel Order
- **Eligibility**: Only pending orders
- **Restrictions**: Cannot cancel shipped/delivered orders
- **Stock Restoration**: Inventory restored when cancelled
- **Notification**: Confirmation message shown

---

## Admin Features

### Admin Dashboard
- **Displays**:
  - Total Products (count)
  - Total Orders (count)
  - Total Revenue (sum of finalAmount)
  - Pending Orders (count)

### Product Management Dashboard
- **List View**:
  - All products in table format
  - Search, filter, sort
  - Edit/Delete buttons

- **Add Product Form**:
  - All product fields
  - Image upload (multiple)
  - Category selection
  - Automatic discounted price calculation

- **Edit Product Form**:
  - Pre-filled with current data
  - Update any field
  - Save changes

- **Delete Product**:
  - Soft delete
  - Confirmation dialog
  - Product hidden from listings

### Order Management Dashboard
- **List View**:
  - All orders in table format
  - Order number, customer, amount
  - Payment method
  - Status dropdown (editable)
  - Order date

- **Update Status**:
  - Dropdown with all status options
  - Automatic status update
  - Notification sent to user

### User Management
- **View Users**:
  - List all registered customers
  - Show: Name, Email, Phone, Registration Date

### Admin Protection
- **Route Protection**:
  - Middleware checks user role
  - Only 'admin' role can access
  - Redirects non-admins to home page

- **Feature Hiding**:
  - Admin menu hidden from customers
  - Customer menu hidden from admins
  - Separate dashboards

---

## Features by Role

### Customer-Only Features
- Browse products
- Add to cart
- Checkout
- Place orders
- Track orders
- Manage addresses
- View profile
- Add reviews

### Admin-Only Features
- Add products
- Edit products
- Delete products
- View all orders
- Update order status
- View registered users
- Dashboard statistics

### Public Features
- Home page
- Product listing (browse)
- Product details (view)
- Login/Register

---

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Hamburger menu
- Full-width buttons
- Touch-friendly sizes

### Tablet (768px - 1024px)
- 2-3 column layouts
- Sidebar visible
- Optimized spacing

### Desktop (> 1024px)
- Full-width layouts
- Sidebars and main content
- Multi-column displays

---

## Performance Features

### Optimization
- Lazy loading images
- Debounced search
- Pagination for products
- Efficient filtering

### Caching
- Token stored in localStorage
- User data cached
- Minimize API calls

---

## Error Handling

### User-Friendly Messages
- "Email already exists"
- "Invalid password"
- "Product out of stock"
- "Order placed successfully"

### Error Recovery
- Toast notifications
- Retry buttons
- Form validation
- Helpful error messages

---

## Security Features

### Authentication
- Password hashing with bcrypt
- JWT token validation
- Token expiration (7 days)
- Secure storage in localStorage

### Authorization
- Role-based access control
- Admin-only routes
- Protected endpoints
- Middleware validation

### Data Protection
- Input validation
- Email verification format
- Password strength requirements
- No sensitive data in logs

---

End of Feature Documentation
