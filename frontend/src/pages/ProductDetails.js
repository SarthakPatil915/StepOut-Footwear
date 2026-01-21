import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import QuickAddToWishlist from '../components/QuickAddToWishlist';
import api from '../utils/axiosInstance';
import { productEndpoints, cartEndpoints } from '../utils/apiEndpoints';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await api.get(productEndpoints.GET_PRODUCT_DETAILS(id));
      setProduct(response.data.product);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load product');
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    try {
      await api.post(cartEndpoints.ADD_TO_CART, {
        productId: id,
        quantity,
        size: selectedSize,
      });
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full rounded-lg mb-4"
          />
          <div className="flex gap-2">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index}`}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-orange-500"
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          {product.discount > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
              -{product.discount}% OFF
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="text-gray-600">{product.rating} ({product.reviews?.length} reviews)</span>
          </div>

          <p className="text-gray-600 mb-4">{product.brand}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-orange-500">₹{product.discountedPrice}</span>
            {product.discount > 0 && (
              <span className="text-2xl text-gray-400 line-through">₹{product.price}</span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Select Size</label>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSize(size.size)}
                  className={`px-4 py-2 rounded-lg border-2 font-semibold transition ${
                    selectedSize === size.size
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-orange-500'
                  }`}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-6 flex items-center gap-4">
            <label className="text-lg font-semibold">Quantity</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100"
              >
                <FiMinus />
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <p className={`text-lg font-semibold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              onClick={() => {
                if (isInWishlist(product._id)) {
                  removeFromWishlist(product._id);
                  toast.success('Removed from wishlist');
                } else {
                  setShowWishlistModal(true);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                isInWishlist(product._id)
                  ? 'bg-red-100 text-red-500 border-2 border-red-500'
                  : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
              }`}
            >
              <FiHeart className={isInWishlist(product._id) ? 'fill-red-500' : ''} /> 
              {isInWishlist(product._id) ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Wishlist Modal */}
      <QuickAddToWishlist
        product={product}
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        onAddToWishlist={(prod, size) => {
          addToWishlist(prod, size);
          toast.success('Added to wishlist');
        }}
      />
      <div className="mt-12 pt-12 border-t">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{review.userName}</h4>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
