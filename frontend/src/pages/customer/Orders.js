import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axiosInstance';
import { orderEndpoints } from '../../utils/apiEndpoints';
import toast from 'react-hot-toast';
import { FaPrint, FaChevronDown, FaChevronUp, FaTimesCircle } from 'react-icons/fa';
import InvoicePDF from '../../utils/InvoicePDF';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancelDialogOrder, setCancelDialogOrder] = useState(null);

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
      'Out for Delivery': 'text-orange-600 bg-orange-100',
      Delivered: 'text-green-600 bg-green-100',
      Cancelled: 'text-red-600 bg-red-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getOrderStatusSteps = (status) => {
    const steps = ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      step,
      completed: index < currentIndex || (index === currentIndex && status !== 'Cancelled'),
      current: index === currentIndex,
    }));
  };

  const handlePrintInvoice = async (order) => {
    try {
      InvoicePDF.downloadInvoice(order);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate invoice');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`${orderEndpoints.CANCEL_ORDER(orderId)}`);
      toast.success('Order cancelled successfully');
      fetchOrders();
      setCancelDialogOrder(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
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
          <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order Header */}
            <div
              className="p-6 border-b cursor-pointer hover:bg-gray-50 transition"
              onClick={() =>
                setExpandedOrderId(
                  expandedOrderId === order._id ? null : order._id
                )
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <p className="text-gray-600 text-sm">Order Number</p>
                  <p className="font-bold text-lg">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Order Date</p>
                  <p className="font-bold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="font-bold text-orange-500 text-lg">
                    ₹{order.finalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedOrderId === order._id ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Order Details */}
            {expandedOrderId === order._id && (
              <div className="p-6 space-y-6 bg-gray-50">
                {/* Order Status Timeline */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Order Status</h3>
                  <div className="flex items-center justify-between">
                    {getOrderStatusSteps(order.orderStatus).map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                            item.completed
                              ? 'bg-green-500'
                              : item.current
                              ? 'bg-orange-500 animate-pulse'
                              : 'bg-gray-300'
                          }`}
                        >
                          {item.completed ? '✓' : index + 1}
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          {item.step}
                        </p>
                        {index < getOrderStatusSteps(order.orderStatus).length - 1 && (
                          <div
                            className={`h-1 w-full mt-3 ${
                              getOrderStatusSteps(order.orderStatus)[index + 1]
                                .completed
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Items</h3>
                  <div className="bg-white p-4 rounded-lg space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start pb-3 border-b last:border-b-0">
                        <div className="flex-1">
                          <p className="font-semibold">{item.productName}</p>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} | Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Delivery Address</h3>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-semibold text-lg">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-gray-700 mt-2">
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 &&
                        `, ${order.shippingAddress.addressLine2}`}
                    </p>
                    <p className="text-gray-700">
                      {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                      {order.shippingAddress.pincode}
                    </p>
                    <p className="text-gray-700 font-semibold mt-3">
                      📱 {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Order Summary</h3>
                  <div className="bg-white p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-semibold">-₹{order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total Amount</span>
                      <span className="text-orange-500">
                        ₹{order.finalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-gray-600">
                        Payment Method: <span className="font-semibold">{order.paymentMethod}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => handlePrintInvoice(order)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    <FaPrint /> Print Invoice
                  </button>
                  {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Shipped' && (
                    <button
                      onClick={() => setCancelDialogOrder(order)}
                      className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                    >
                      <FaTimesCircle /> Cancel Order
                    </button>
                  )}
                  {order.orderStatus === 'Cancelled' && (
                    <span className="px-6 py-3 rounded-lg font-semibold text-red-600 bg-red-100">
                      Order Cancelled
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cancel Order Confirmation Dialog */}
      {cancelDialogOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <FaTimesCircle className="text-red-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Cancel Order?
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to cancel order <strong>{cancelDialogOrder.orderNumber}</strong>?
              <br />
              <span className="text-sm mt-2">Amount will be refunded within 5-7 business days.</span>
            </p>
            <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm"><strong>Order Total:</strong> ₹{cancelDialogOrder.finalAmount.toFixed(2)}</p>
              <p className="text-sm"><strong>Payment Method:</strong> {cancelDialogOrder.paymentMethod}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelDialogOrder(null)}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Keep Order
              </button>
              <button
                onClick={() => handleCancelOrder(cancelDialogOrder._id)}
                className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
