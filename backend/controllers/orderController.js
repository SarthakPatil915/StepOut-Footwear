const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0 || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let totalAmount = 0;
    let discount = 0;

    // Validate products and calculate total
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      }

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      totalAmount += product.discountedPrice * item.quantity;
      discount += ((product.price - product.discountedPrice) * item.quantity);
    }

    const order = new Order({
      userId: req.user._id,
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
      })),
      totalAmount,
      discount,
      finalAmount: totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      orderStatus: 'Pending',
    });

    await order.save();

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalItems: 0, totalPrice: 0 }
    );

    // Update product stock
    for (let item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Order Details
exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('items.productId').populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if user is owner or admin
    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: orderStatus || order.orderStatus,
        paymentStatus: paymentStatus || order.paymentStatus,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.orderStatus}`,
      });
    }

    // Restore product stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
