import React, { createContext, useState, useContext, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product, selectedSize) => {
    const exists = wishlistItems.find(
      (item) => item._id === product._id && item.selectedSize === selectedSize
    );
    if (!exists) {
      setWishlistItems([
        ...wishlistItems,
        {
          ...product,
          selectedSize: selectedSize || product.sizes?.[0]?.size || 'M',
        },
      ]);
    }
  };

  const removeFromWishlist = (productId, size = null) => {
    if (size) {
      setWishlistItems(
        wishlistItems.filter(
          (item) => !(item._id === productId && item.selectedSize === size)
        )
      );
    } else {
      setWishlistItems(
        wishlistItems.filter((item) => item._id !== productId)
      );
    }
  };

  const isInWishlist = (productId, size = null) => {
    if (size) {
      return wishlistItems.some(
        (item) => item._id === productId && item.selectedSize === size
      );
    }
    return wishlistItems.some((item) => item._id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
