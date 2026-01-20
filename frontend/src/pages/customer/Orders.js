import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axiosInstance';
import { orderEndpoints } from '../../utils/apiEndpoints';
import toast from 'react-hot-toast';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get(orderEndpoints.GET_MY_ORDERS);
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'text-yellow-600 bg-yellow-100',
      Confirmed: 'text-blue-600 bg-blue-100',
      Shipped: 'text-purple-600 bg-purple-100',
      Delivered: 'text-green-600 bg-green-100',
      Cancelled: 'text-red-600 bg-red-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-gray-600 mb-6">Start shopping to place your first order!</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-gray-600 text-sm">Order Number</p>
                <p className="font-bold">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Order Date</p>
                <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="font-bold text-orange-500">₹{order.finalAmount}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="font-semibold mb-2">Items ({order.items.length})</p>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.productName} (Size: {item.size}) x {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate(`/order/${order._id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View Details
              </button>
              {order.orderStatus === 'Pending' && (
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
