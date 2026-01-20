import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { orderEndpoints } from '../../utils/apiEndpoints';
import toast from 'react-hot-toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get(orderEndpoints.GET_ALL_ORDERS);
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(orderEndpoints.UPDATE_ORDER_STATUS(orderId), {
        orderStatus: newStatus,
      });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Order Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{order.orderNumber}</td>
                <td className="px-4 py-3">{order.userId?.name}</td>
                <td className="px-4 py-3">₹{order.finalAmount}</td>
                <td className="px-4 py-3">{order.paymentMethod}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="px-2 py-1 border rounded-lg"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-500 hover:text-blue-700">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
