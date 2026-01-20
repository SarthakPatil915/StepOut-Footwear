import React, { useState, useEffect } from 'react';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axiosInstance';
import { cartEndpoints } from '../../utils/apiEndpoints';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get(cartEndpoints.GET_CART);
      setCart(response.data.cart);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load cart');
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    try {
      const response = await api.put(cartEndpoints.UPDATE_CART_ITEM, {
        productId,
        size,
        quantity,
      });
      setCart(response.data.cart);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId, size) => {
    try {
      const response = await api.delete(cartEndpoints.REMOVE_FROM_CART, {
        data: { productId, size },
      });
      setCart(response.data.cart);
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add some awesome shoes to your cart!</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md flex gap-4">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.productName}</h3>
                  <p className="text-gray-600">Size: {item.size}</p>
                  <p className="text-orange-500 font-bold mt-2">₹{item.price}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={20} />
                  </button>

                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.quantity - 1)
                      }
                      className="p-1 hover:bg-gray-100"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.quantity + 1)
                      }
                      className="p-1 hover:bg-gray-100"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>

                  <p className="font-bold text-lg">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">₹{cart.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-semibold">₹0</span>
              </div>
            </div>

            <div className="flex justify-between mb-6 text-xl font-bold">
              <span>Total</span>
              <span className="text-orange-500">₹{cart.totalPrice}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 mb-3"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/products')}
              className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
