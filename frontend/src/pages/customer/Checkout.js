import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axiosInstance';
import { addressEndpoints, cartEndpoints, orderEndpoints } from '../../utils/apiEndpoints';
import toast from 'react-hot-toast';
import OrderSuccessPopup from '../../components/OrderSuccessPopup';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [savedAmount, setSavedAmount] = useState(0);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cartRes, addressRes] = await Promise.all([
        api.get(cartEndpoints.GET_CART),
        api.get(addressEndpoints.GET_ADDRESSES),
      ]);

      setCart(cartRes.data.cart);
      setAddresses(addressRes.data.addresses);
      if (addressRes.data.addresses.length > 0) {
        setSelectedAddress(addressRes.data.addresses[0]);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load checkout data');
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        // Update existing address
        await api.put(`${addressEndpoints.GET_ADDRESSES}/${editingAddressId}`, addressForm);
        toast.success('Address updated successfully');
      } else {
        // Add new address
        await api.post(addressEndpoints.ADD_ADDRESS, addressForm);
        toast.success('Address added successfully');
      }

      await fetchData();
      setNewAddress(false);
      setEditingAddressId(null);
      setAddressForm({
        fullName: user?.name || '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      });
    } catch (error) {
      toast.error(editingAddressId ? 'Failed to update address' : 'Failed to add address');
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm(address);
    setEditingAddressId(address._id);
    setNewAddress(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await api.delete(`${addressEndpoints.GET_ADDRESSES}/${addressId}`);
      toast.success('Address deleted successfully');
      await fetchData();
      if (selectedAddress?._id === addressId) {
        setSelectedAddress(null);
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      setLoading(true);
      
      // Format items with productName from populated data
      const formattedItems = cart.items.map(item => ({
        productId: item.productId?._id || item.productId,
        productName: item.productId?.name || item.productName || 'Product',
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
      }));

      const response = await api.post(orderEndpoints.CREATE_ORDER, {
        items: formattedItems,
        shippingAddress: selectedAddress,
        paymentMethod,
      });

      // Calculate saved amount
      let saved = 0;
      cart.items.forEach(item => {
        const product = item.productId;
        if (product && product.price && product.discountedPrice) {
          const discount = (product.price - product.discountedPrice) * item.quantity;
          saved += discount;
        }
      });

      setSuccessOrder(response.data.order);
      setSavedAmount(saved);
      
      // Process payment based on method
      if (paymentMethod === 'Razorpay') {
        // Handle Razorpay payment
        setProcessingPayment(true);
        handleRazorpayPayment(response.data.order);
      } else {
        // For COD, show success popup directly
        setShowSuccessPopup(true);
      }
      setLoading(false);
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async (order) => {
    try {
      // Create Razorpay order
      const response = await api.post('/orders/payment/create-razorpay-order', {
        amount: order.finalAmount,
        orderId: order._id,
      });

      const { key: razorpayKeyId, order: razorpayOrder } = response.data;

      // Initialize Razorpay payment
      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: 'StepOut eCommerce',
        description: `Order #${order.orderNumber}`,
        customer_notification: 1,
        handler: async (paymentResponse) => {
          // Verify payment on backend
          try {
            const verifyResponse = await api.post('/orders/payment/verify-razorpay', {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              orderId: order._id,
            });

            if (verifyResponse.data.success) {
              toast.success('Payment successful!');
              setShowSuccessPopup(true);
              setProcessingPayment(false);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: selectedAddress?.fullName || user?.name || '',
          email: user?.email || '',
          contact: selectedAddress?.phone || user?.phone || '',
        },
        theme: {
          color: '#f97316',
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setProcessingPayment(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to initialize payment. Please try again.');
      setProcessingPayment(false);
    }
  };

  const handleSuccessPopupClose = () => {
    navigate(`/orders`);
  };

  if (loading && !cart) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
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
      {showSuccessPopup && (
        <OrderSuccessPopup
          order={successOrder}
          savedAmount={savedAmount}
          onClose={handleSuccessPopupClose}
        />
      )}

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>

            {!newAddress && addresses.length > 0 ? (
              <>
                <div className="space-y-3 mb-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition"
                      style={{
                        borderColor: selectedAddress?._id === addr._id ? '#f97316' : '#e5e7eb',
                        backgroundColor: selectedAddress?._id === addr._id ? '#fff7ed' : '#fff',
                      }}
                    >
                      <input
                        type="radio"
                        checked={selectedAddress?._id === addr._id}
                        onChange={() => setSelectedAddress(addr)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{addr.fullName}</p>
                        <p className="text-gray-600 text-sm">
                          {addr.addressLine1}, {addr.addressLine2}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-gray-600 text-sm font-semibold">📱 {addr.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAddress(addr)}
                          className="text-blue-500 hover:text-blue-700 p-2"
                          title="Edit address"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Delete address"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setNewAddress(true);
                    setEditingAddressId(null);
                    setAddressForm({
                      fullName: user?.name || '',
                      phone: '',
                      addressLine1: '',
                      addressLine2: '',
                      city: '',
                      state: '',
                      pincode: '',
                    });
                  }}
                  className="text-blue-500 font-semibold hover:underline"
                >
                  + Add New Address
                </button>
              </>
            ) : (
              <form onSubmit={handleAddressSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={addressForm.addressLine1}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, addressLine1: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={addressForm.addressLine2}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, addressLine2: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    required
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    required
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, pincode: e.target.value })
                    }
                    required
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600"
                  >
                    {editingAddressId ? 'Update Address' : 'Save Address'}
                  </button>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewAddress(false);
                        setEditingAddressId(null);
                      }}
                      className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>

            <div className="space-y-3">
              {['COD', 'Razorpay'].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition"
                  style={{
                    borderColor: paymentMethod === method ? '#f97316' : '#d1d5db',
                    backgroundColor: paymentMethod === method ? '#fff7ed' : '#fff',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">
                    {method === 'Razorpay' ? 'Razorpay (Credit/Debit Card, UPI)' : method}
                  </span>
                </label>
              ))}
            </div>

            {paymentMethod === 'Razorpay' && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-700">
                  <strong>💳 Razorpay Payment:</strong><br/>
                  Secure payment with Credit/Debit Card, UPI, Wallets and more
                </p>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  ✓ <strong>Cash on Delivery</strong><br/>
                  Pay when you receive your order
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pb-4 border-b">
              {cart.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.productName} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">₹{cart.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-green-500">Free</span>
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
              onClick={handlePlaceOrder}
              disabled={loading || processingPayment || !selectedAddress}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Placing Order...' : processingPayment ? 'Processing Payment...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
