import React from 'react';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axiosInstance';
import { cartEndpoints } from '../../utils/apiEndpoints';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    try {
      await api.post(cartEndpoints.ADD_TO_CART, {
        productId: product._id,
        quantity: 1,
        size: product.selectedSize || product.sizes?.[0]?.size || 'M',
      });
      toast.success('Added to cart');
      removeFromWishlist(product._id, product.selectedSize);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
        <p className="text-gray-500 text-lg mb-6">Your wishlist is empty</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlistItems.length})</h1>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Discount</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map((product, index) => (
              <tr key={`${product._id}-${product.selectedSize}-${index}`} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 cursor-pointer hover:text-orange-500" onClick={() => navigate(`/product/${product._id}`)}>
                  <div className="font-semibold">{product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name}</div>
                  <div className="text-sm text-gray-500">{product.category}</div>
                </td>
                <td className="px-4 py-3">{product.brand}</td>
                <td className="px-4 py-3 font-semibold text-orange-500">{product.selectedSize}</td>
                <td className="px-4 py-3 font-semibold">₹{product.price}</td>
                <td className="px-4 py-3">
                  {product.discount > 0 ? (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-semibold">In Stock ({product.stock})</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  )}
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      product.stock > 0
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      removeFromWishlist(product._id, product.selectedSize);
                      toast.success('Removed from wishlist');
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wishlist;
