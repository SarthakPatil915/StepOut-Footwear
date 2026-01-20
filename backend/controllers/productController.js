const Product = require('../models/Product');

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, brand, sort } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.discountedPrice = {};
      if (minPrice) query.discountedPrice.$gte = parseInt(minPrice);
      if (maxPrice) query.discountedPrice.$lte = parseInt(maxPrice);
    }

    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    let products = Product.find(query);

    if (sort === 'price-low') {
      products = products.sort({ discountedPrice: 1 });
    } else if (sort === 'price-high') {
      products = products.sort({ discountedPrice: -1 });
    } else if (sort === 'newest') {
      products = products.sort({ createdAt: -1 });
    } else if (sort === 'rating') {
      products = products.sort({ rating: -1 });
    }

    const allProducts = await products;

    res.status(200).json({
      success: true,
      count: allProducts.length,
      products: allProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Product Details
exports.getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('reviews.userId', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Product (Admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price, discount, stock, brand, images, sizes } = req.body;

    if (!name || !description || !category || !price || !brand) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const product = new Product({
      name,
      description,
      category,
      price,
      discount: discount || 0,
      stock,
      brand,
      images: images || [],
      sizes: sizes || [],
      createdBy: req.user._id,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, discount, stock, brand, images, sizes, isActive } = req.body;

    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        price,
        discount: discount || 0,
        stock,
        brand,
        images,
        sizes,
        isActive: isActive !== undefined ? isActive : product.isActive,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Product (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      product: { _id: id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Products (Admin)
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Review
exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = {
      userId: req.user._id,
      userName: req.user.name,
      rating,
      comment,
    };

    product.reviews.push(review);

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    product.rating = (totalRating / product.reviews.length).toFixed(1);

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
