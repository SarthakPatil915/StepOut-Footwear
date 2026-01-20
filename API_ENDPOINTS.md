# API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### Register Customer
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response: 201
{
  "success": true,
  "token": "jwt_token",
  "user": { id, name, email, role }
}
```

### Login Customer
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200
{
  "success": true,
  "token": "jwt_token",
  "user": { id, name, email, role }
}
```

### Admin Login
```
POST /auth/admin-login
Content-Type: application/json

{
  "email": "admin@stepout.com",
  "password": "StepOut@123"
}

Response: 200
{
  "success": true,
  "token": "jwt_token",
  "user": { id, name, email, role: 'admin' }
}
```

## Product Endpoints

### Get All Products (with filters)
```
GET /products?category=Men&search=sneaker&minPrice=1000&maxPrice=5000&sort=price-low

Query Parameters:
- category: Men|Women|Sports|Casual|Formal
- search: product name/brand
- minPrice: minimum price
- maxPrice: maximum price
- brand: brand name
- sort: newest|price-low|price-high|rating

Response: 200
{
  "success": true,
  "count": 10,
  "products": [...]
}
```

### Get Product Details
```
GET /products/:productId

Response: 200
{
  "success": true,
  "product": { ... }
}
```

### Create Product (Admin)
```
POST /products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Running Shoes",
  "description": "High performance running shoes",
  "category": "Sports",
  "price": 5999,
  "discount": 15,
  "stock": 50,
  "brand": "Nike",
  "images": ["url1", "url2"],
  "sizes": [
    { "size": "7", "stock": 10 },
    { "size": "8", "stock": 10 }
  ]
}

Response: 201
{
  "success": true,
  "message": "Product created successfully",
  "product": { ... }
}
```

### Update Product (Admin)
```
PUT /products/:productId
Authorization: Bearer {token}
Content-Type: application/json

{ same fields as create }

Response: 200
{
  "success": true,
  "message": "Product updated successfully",
  "product": { ... }
}
```

### Delete Product (Admin)
```
DELETE /products/:productId
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Add Product Review
```
POST /products/:productId/review
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 4,
  "comment": "Great quality shoes!"
}

Response: 201
{
  "success": true,
  "message": "Review added successfully",
  "product": { ... }
}
```

## Cart Endpoints

### Get Cart
```
GET /cart
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "cart": {
    "_id": "...",
    "items": [
      {
        "productId": "...",
        "quantity": 2,
        "size": "8",
        "price": 5000,
        "image": "url"
      }
    ],
    "totalItems": 2,
    "totalPrice": 10000
  }
}
```

### Add to Cart
```
POST /cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "60d5ec49c1234567890ab123",
  "quantity": 1,
  "size": "8"
}

Response: 201
{
  "success": true,
  "message": "Item added to cart",
  "cart": { ... }
}
```

### Update Cart Item
```
PUT /cart/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "60d5ec49c1234567890ab123",
  "size": "8",
  "quantity": 3
}

Response: 200
{
  "success": true,
  "message": "Cart updated successfully",
  "cart": { ... }
}
```

### Remove from Cart
```
DELETE /cart/remove
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "60d5ec49c1234567890ab123",
  "size": "8"
}

Response: 200
{
  "success": true,
  "message": "Item removed from cart",
  "cart": { ... }
}
```

### Clear Cart
```
DELETE /cart/clear
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "message": "Cart cleared",
  "cart": { items: [], totalItems: 0, totalPrice: 0 }
}
```

## Order Endpoints

### Create Order
```
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productId": "...",
      "productName": "Shoes",
      "price": 5000,
      "quantity": 1,
      "size": "8",
      "image": "url"
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "COD"
}

Response: 201
{
  "success": true,
  "message": "Order created successfully",
  "order": { ... }
}
```

### Get My Orders
```
GET /orders/my-orders
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "count": 5,
  "orders": [...]
}
```

### Get Order Details
```
GET /orders/:orderId
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "order": { ... }
}
```

### Cancel Order
```
PUT /orders/:orderId/cancel
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": { ... }
}
```

### Get All Orders (Admin)
```
GET /orders
Authorization: Bearer {token}
(Requires admin role)

Response: 200
{
  "success": true,
  "count": 50,
  "orders": [...]
}
```

### Update Order Status (Admin)
```
PUT /orders/:orderId/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderStatus": "Shipped",
  "paymentStatus": "Completed"
}

Response: 200
{
  "success": true,
  "message": "Order status updated",
  "order": { ... }
}
```

## Address Endpoints

### Get All Addresses
```
GET /auth/addresses
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "addresses": [...]
}
```

### Add Address
```
POST /auth/addresses
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "9876543210",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "isDefault": true
}

Response: 201
{
  "success": true,
  "message": "Address added successfully",
  "user": { ... }
}
```

### Delete Address
```
DELETE /auth/addresses/:addressId
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "message": "Address deleted successfully",
  "user": { ... }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

---

**Note:** All protected endpoints require the `Authorization` header with format: `Bearer {token}`
