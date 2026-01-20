import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existingItem = cartItems.find(
      (item) => item.productId === product.productId && item.size === product.size
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.productId === product.productId && item.size === product.size
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, product]);
    }
  };

  const removeFromCart = (productId, size) => {
    setCartItems(
      cartItems.filter((item) => !(item.productId === productId && item.size === size))
    );
  };

  const updateCartItem = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
