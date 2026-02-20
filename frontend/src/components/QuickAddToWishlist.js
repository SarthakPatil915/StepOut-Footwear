import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const QuickAddToWishlist = ({ product, isOpen, onClose, onAddToWishlist }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddToWishlist = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    setLoading(true);
    try {
      onAddToWishlist(product, selectedSize);
      setSelectedSize('');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to add to wishlist');
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

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToWishlist}
            disabled={loading || !selectedSize}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add to Wishlist'}
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

export default QuickAddToWishlist;
