const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Men', 'Women', 'Sports', 'Casual', 'Formal'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountedPrice: {
      type: Number,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [String],
    brand: {
      type: String,
      required: true,
    },
    sizes: [
      {
        size: { type: String, enum: ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14'] },
        stock: Number,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Calculate discounted price before saving
productSchema.pre('save', function (next) {
  if (this.discount) {
    this.discountedPrice = this.price - (this.price * this.discount) / 100;
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
