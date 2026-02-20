const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Auth Endpoints
export const authEndpoints = {
  REGISTER: `${API_URL}/auth/register`,
  LOGIN: `${API_URL}/auth/login`,
  ADMIN_LOGIN: `${API_URL}/auth/admin-login`,
  GET_PROFILE: `${API_URL}/auth/profile`,
  UPDATE_PROFILE: `${API_URL}/auth/profile`,
};

// Product Endpoints
export const productEndpoints = {
  GET_ALL_PRODUCTS: `${API_URL}/products`,
  GET_PRODUCT_DETAILS: (id) => `${API_URL}/products/${id}`,
  CREATE_PRODUCT: `${API_URL}/products`,
  UPDATE_PRODUCT: (id) => `${API_URL}/products/${id}`,
  DELETE_PRODUCT: (id) => `${API_URL}/products/${id}`,
  GET_ADMIN_PRODUCTS: `${API_URL}/products/admin/all-products`,
  ADD_REVIEW: (id) => `${API_URL}/products/${id}/review`,
};

// Cart Endpoints
export const cartEndpoints = {
  GET_CART: `${API_URL}/cart`,
  ADD_TO_CART: `${API_URL}/cart/add`,
  UPDATE_CART_ITEM: `${API_URL}/cart/update`,
  REMOVE_FROM_CART: `${API_URL}/cart/remove`,
  CLEAR_CART: `${API_URL}/cart/clear`,
};

// Order Endpoints
export const orderEndpoints = {
  CREATE_ORDER: `${API_URL}/orders`,
  GET_MY_ORDERS: `${API_URL}/orders/my-orders`,
  GET_ORDER_DETAILS: (id) => `${API_URL}/orders/${id}`,
  CANCEL_ORDER: (id) => `${API_URL}/orders/${id}/cancel`,
  GET_ALL_ORDERS: `${API_URL}/orders`,
  UPDATE_ORDER_STATUS: (id) => `${API_URL}/orders/${id}/status`,
};

// Address Endpoints
export const addressEndpoints = {
  GET_ADDRESSES: `${API_URL}/auth/addresses`,
  ADD_ADDRESS: `${API_URL}/auth/addresses`,
  UPDATE_ADDRESS: (id) => `${API_URL}/auth/addresses/${id}`,
  DELETE_ADDRESS: (id) => `${API_URL}/auth/addresses/${id}`,
};

export { getAuthToken };
