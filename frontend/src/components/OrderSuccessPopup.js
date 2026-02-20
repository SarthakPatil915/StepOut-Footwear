import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccessPopup = ({ order, savedAmount, onClose }) => {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    // Create confetti effect
    createConfetti();
    
    const timer = setTimeout(() => {
      setShowPopup(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const createConfetti = () => {
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa502', '#ff6348'][Math.floor(Math.random() * 5)];
      confetti.style.borderRadius = '50%';
      confetti.style.zIndex = '60';
      confetti.style.animation = `fall ${2 + Math.random() * 1}s linear forwards`;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  if (!showPopup) return null;

  return (
    <>
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
            opacity: 0;
          }
        }
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
        }
        .success-tick {
          animation: scaleTickAnimation 0.6s ease-out;
        }
      `}</style>
      
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="success-popup bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="success-tick relative">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-50"></div>
              <FaCheckCircle className="text-green-500 text-7xl relative" />
            </div>
          </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Your Order Done!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Your order has been placed successfully
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-center mb-4">
            <p className="text-gray-600 text-sm">Order Number</p>
            <p className="text-2xl font-bold text-orange-500">{order.orderNumber}</p>
          </div>

          {savedAmount > 0 && (
            <div className="border-t pt-4">
              <p className="text-center text-gray-600 text-sm mb-1">Amount Saved</p>
              <p className="text-center text-2xl font-bold text-green-600">
                ₹{savedAmount.toFixed(2)}
              </p>
            </div>
          )}

          <div className="border-t pt-4 mt-4">
            <p className="text-center text-gray-600 text-sm mb-1">Total Amount</p>
            <p className="text-center text-xl font-bold text-gray-800">
              ₹{order.finalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="text-center mb-6 bg-blue-50 rounded-lg p-3">
          <p className="text-gray-600 text-sm">Payment Method</p>
          <p className="font-semibold text-blue-600">{order.paymentMethod}</p>
        </div>

        {/* Delivery Info */}
        <div className="text-center text-sm text-gray-600 mb-6">
          <p className="font-semibold text-gray-800 mb-2">Deliver to</p>
          <p>{order.shippingAddress.fullName}</p>
          <p className="text-xs">
            {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
          </p>
        </div>

          {/* Closing Button */}
          <button
            onClick={() => {
              setShowPopup(false);
              onClose();
            }}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPopup;
