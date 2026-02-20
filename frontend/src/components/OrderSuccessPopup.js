import React, { useState } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const OrderSuccessPopup = ({ order, savedAmount, onClose }) => {
  const [showPopup, setShowPopup] = useState(true);

  const closePopup = () => {
    setShowPopup(false);
    onClose();
  };

  if (!showPopup) return null;

  return (
    <>
      <style>{`
        @keyframes zoomIn {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes scaleTickAnimation {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .success-popup {
          animation: zoomIn 0.4s ease-out;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .success-tick {
          animation: scaleTickAnimation 0.6s ease-out;
        }
        .popup-container {
          max-height: 90vh;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .popup-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-4">
        <div className="success-popup bg-white rounded-2xl shadow-2xl w-full max-w-2xl popup-container relative">
          {/* Close Button */}
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition duration-200 shadow-lg"
          >
            <FaTimes size={20} />
          </button>

          <div className="p-6 sm:p-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="success-tick relative">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-50"></div>
                <FaCheckCircle className="text-green-500 text-6xl sm:text-7xl relative" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
              Your Order Confirmed!
            </h1>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              Your order has been placed successfully
            </p>

            {/* Order Details */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 mb-6 border border-orange-200">
              <div className="text-center mb-4">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Order Number</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-500 mt-1">{order.orderNumber}</p>
              </div>

              {savedAmount > 0 && (
                <div className="border-t border-orange-200 pt-4 mb-4">
                  <p className="text-center text-gray-600 text-xs sm:text-sm font-semibold mb-1">Amount Saved</p>
                  <p className="text-center text-lg sm:text-xl font-bold text-green-600">
                    ₹{savedAmount.toFixed(2)}
                  </p>
                </div>
              )}

              <div className={`${savedAmount > 0 ? 'border-t border-orange-200 pt-4' : ''}`}>
                <p className="text-center text-gray-600 text-xs sm:text-sm font-semibold mb-1">Total Amount</p>
                <p className="text-center text-lg sm:text-xl font-bold text-gray-800">
                  ₹{order.finalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="text-center mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold">Payment Method</p>
              <p className="font-semibold text-blue-600 mt-1 text-sm sm:text-base">{order.paymentMethod}</p>
            </div>

            {/* Delivery Info */}
            <div className="text-center mb-6 bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="font-semibold text-gray-800 text-sm sm:text-base mb-2">Deliver to</p>
              <p className="text-gray-700 font-medium text-sm sm:text-base">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={closePopup}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-200 text-sm sm:text-base shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPopup;
