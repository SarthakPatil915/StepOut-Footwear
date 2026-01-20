import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../utils/axiosInstance';
import { cartEndpoints } from '../utils/apiEndpoints';
import toast from 'react-hot-toast';

const QuickAddToCart = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    setLoading(true);
    try {
      await api.post(cartEndpoints.ADD_TO_CART, {
        productId: product._id,
        quantity,
        size: selectedSize,
      });
      toast.success('Added to cart');
      setSelectedSize('');
      setQuantity(1);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FiX size={24} />
        </button>

        <div className="flex gap-4 mb-6">
          <img
            src={product.images[0] || 'https://via.placeholder.com/100'}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.brand}</p>
            <p className="text-orange-500 font-bold mt-2">₹{product.discountedPrice}</p>
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <label className="block font-semibold mb-3">Select Size *</label>
          <div className="grid grid-cols-5 gap-2">
            {product.sizes && product.sizes.length > 0 ? (
              product.sizes.map((size) => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSize(size.size)}
                  className={`py-2 rounded-lg border-2 font-semibold transition ${
                    selectedSize === size.size
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-orange-500'
                  }`}
                >
                  {size.size}
                </button>
              ))
            ) : (
              <p className="text-gray-600 col-span-5">No sizes available</p>
            )}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Quantity</label>
          <div className="flex items-center border-2 border-gray-300 rounded-lg w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100"
            >
              −
            </button>
            <span className="px-4 py-2">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={loading || !selectedSize}
            className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickAddToCart;
