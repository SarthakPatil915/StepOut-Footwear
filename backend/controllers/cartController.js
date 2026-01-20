const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get Cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;

    if (!productId || !quantity || !size) {
      return res.status(400).json({ message: 'Please provide product, quantity, and size' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        size,
        price: product.discountedPrice,
        image: product.images[0],
      });
    }

    // Update totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Cart Item
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    if (!productId || !size || quantity === undefined) {
      return res.status(400).json({ message: 'Please provide product, size, and quantity' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => !(item.productId.toString() === productId && item.size === size)
      );
    } else {
      item.quantity = quantity;
    }

    // Update totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ message: 'Please provide product and size' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );

    // Update totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalItems: 0, totalPrice: 0 },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
