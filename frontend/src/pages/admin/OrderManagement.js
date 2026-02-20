import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { orderEndpoints } from '../../utils/apiEndpoints';
import toast from 'react-hot-toast';
import { FaEye, FaPrint } from 'react-icons/fa';
import InvoicePDF from '../../utils/InvoicePDF';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get(orderEndpoints.GET_ALL_ORDERS);
      setOrders(response.data.orders);
      
      // Initialize selected status for each order
      const statusMap = {};
      response.data.orders.forEach(order => {
        statusMap[order._id] = order.orderStatus;
      });
      setSelectedStatus(statusMap);
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
      
      // Update local state
      setSelectedStatus(prev => ({
        ...prev,
        [orderId]: newStatus
      }));
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order');
      // Revert selection on error
      setSelectedStatus(prev => ({
        ...prev,
        [orderId]: orders.find(o => o._id === orderId)?.orderStatus
      }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Confirmed: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-purple-100 text-purple-800',
      'Out for Delivery': 'bg-orange-100 text-orange-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    return status === 'Completed' ? 'text-green-600' : 'text-yellow-600';
  };

  const handlePrintInvoice = async (order) => {
    try {
      InvoicePDF.downloadInvoice(order);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate invoice');
    }
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
        <h1 className="text-3xl font-bold mb-4">No Orders Found</h1>
        <p className="text-gray-600">There are currently no orders to manage.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <tr>
              <th className="px-4 py-4 text-left font-semibold">Order #</th>
              <th className="px-4 py-4 text-left font-semibold">Customer</th>
              <th className="px-4 py-4 text-left font-semibold">Amount</th>
              <th className="px-4 py-4 text-left font-semibold">Payment</th>
              <th className="px-4 py-4 text-left font-semibold">Order Status</th>
              <th className="px-4 py-4 text-left font-semibold">Date</th>
              <th className="px-4 py-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-bold text-orange-600">{order.orderNumber}</td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold">{order.userId?.name || 'N/A'}</p>
                      <p className="text-gray-500 text-xs">{order.userId?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-bold text-lg">₹{order.finalAmount.toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentMethod} - {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={selectedStatus[order._id] || order.orderStatus}
                      onChange={(e) => {
                        setSelectedStatus(prev => ({
                          ...prev,
                          [order._id]: e.target.value
                        }));
                        updateOrderStatus(order._id, e.target.value);
                      }}
                      className={`px-3 py-2 border-2 rounded-lg font-semibold cursor-pointer transition ${getStatusColor(selectedStatus[order._id] || order.orderStatus)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                      className="text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-2"
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>

                {/* Expanded Order Details */}
                {expandedOrderId === order._id && (
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="px-4 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Items */}
                        <div>
                          <h3 className="font-bold mb-3 text-lg">Order Items</h3>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="bg-white p-3 rounded border">
                                <p className="font-semibold">{item.productName}</p>
                                <p className="text-sm text-gray-600">
                                  Size: {item.size || 'N/A'} | Qty: {item.quantity}
                                </p>
                                <p className="font-semibold text-orange-500">₹{(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                          <h3 className="font-bold mb-3 text-lg">Delivery Address</h3>
                          <div className="bg-white p-4 rounded border">
                            <p className="font-bold text-lg mb-2">{order.shippingAddress.fullName}</p>
                            <p className="text-gray-700">{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && (
                              <p className="text-gray-700">{order.shippingAddress.addressLine2}</p>
                            )}
                            <p className="text-gray-700">
                              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                            <p className="font-semibold text-lg mt-3">📱 {order.shippingAddress.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 bg-white p-4 rounded border">
                        <h3 className="font-bold mb-3">Order Summary</h3>
                        <div className="flex justify-between mb-2">
                          <span>Subtotal:</span>
                          <span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between mb-2 text-green-600">
                            <span>Discount:</span>
                            <span className="font-semibold">-₹{order.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total:</span>
                          <span className="text-orange-500">₹{order.finalAmount.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => handlePrintInvoice(order)}
                          className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                        >
                          <FaPrint /> Print Invoice / Bill
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
