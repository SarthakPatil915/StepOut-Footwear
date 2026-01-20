import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axiosInstance';
import { addressEndpoints, cartEndpoints } from '../../utils/apiEndpoints';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

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
      const response = await api.post(addressEndpoints.ADD_ADDRESS, addressForm);
      setAddresses(response.data.user.addresses);
      setNewAddress(false);
      setAddressForm({
        fullName: user?.name || '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      });
      toast.success('Address added successfully');
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/orders', {
        items: cart.items,
        shippingAddress: selectedAddress,
        paymentMethod,
      });

      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
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
                  {addresses.map((addr, index) => (
                    <label key={index} className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer" style={{ borderColor: selectedAddress === addr ? '#f97316' : '#e5e7eb' }}>
                      <input
                        type="radio"
                        checked={selectedAddress === addr}
                        onChange={() => setSelectedAddress(addr)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{addr.fullName}</p>
                        <p className="text-gray-600">{addr.addressLine1}, {addr.addressLine2}</p>
                        <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-gray-600">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setNewAddress(true)}
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
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600"
                >
                  Save Address
                </button>
              </form>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>

            <div className="space-y-3">
              {['UPI', 'Card', 'NetBanking', 'COD'].map((method) => (
                <label key={method} className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">{method}</span>
                </label>
              ))}
            </div>
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
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
