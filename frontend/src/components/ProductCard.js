import React, { useState } from 'react';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import QuickAddToWishlist from './QuickAddToWishlist';

const ProductCard = ({ product, onClick, onQuickAdd }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      setShowWishlistModal(true);
    }
  };

  const handleAddToWishlist = (prod, size) => {
    addToWishlist(prod, size);
    removeFromWishlist(product._id); // Remove if it was already there with different size
  };

  const handleQuickAddClick = (e) => {
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer relative group">
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 hover:bg-orange-50 transition"
      >
        <FiHeart
          size={20}
          className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
        />
      </button>

      <div 
        onClick={onClick}
        className="relative mb-4"
      >
        <img
          src={product.images[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{product.discount}%
          </div>
        )}
      </div>

      <div onClick={onClick}>
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-500">★</span>
          <span className="text-sm text-gray-600">{product.rating || 0} ({product.reviews?.length || 0} reviews)</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-orange-500">₹{product.discountedPrice}</span>
          {product.discount > 0 && (
            <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={handleQuickAddClick}
        disabled={product.stock === 0}
        className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2 transition"
      >
        <FiShoppingCart /> Add to Cart
      </button>

      {/* Wishlist Modal */}
      <QuickAddToWishlist
        product={product}
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        onAddToWishlist={handleAddToWishlist}
      />
    </div>
  );
};

export default ProductCard;
