require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'StepOut Admin',
      email: 'admin@stepout.com',
      password: 'StepOut@123',
      role: 'admin',
    });
    await adminUser.save();

    console.log('Admin user created');

    // Create sample products
    const products = [
      {
        name: 'Casual Canvas Sneakers',
        description: 'Comfortable casual sneakers perfect for everyday wear',
        category: 'Casual',
        price: 3999,
        discount: 20,
        stock: 50,
        brand: 'FeetComfort',
        images: [
          'https://via.placeholder.com/400x400?text=Casual+Sneakers+1',
          'https://via.placeholder.com/400x400?text=Casual+Sneakers+2',
        ],
        sizes: [
          { size: '6', stock: 10 },
          { size: '7', stock: 10 },
          { size: '8', stock: 10 },
          { size: '9', stock: 10 },
          { size: '10', stock: 10 },
        ],
      },
      {
        name: 'Running Marathon Pro',
        description: 'High-performance running shoes with cushioning',
        category: 'Sports',
        price: 5999,
        discount: 15,
        stock: 40,
        brand: 'SpeedStride',
        images: [
          'https://via.placeholder.com/400x400?text=Running+Shoes+1',
          'https://via.placeholder.com/400x400?text=Running+Shoes+2',
        ],
        sizes: [
          { size: '7', stock: 10 },
          { size: '8', stock: 10 },
          { size: '9', stock: 10 },
          { size: '10', stock: 10 },
        ],
      },
      {
        name: 'Formal Office Leather Shoes',
        description: 'Premium leather formal shoes for business meetings',
        category: 'Formal',
        price: 7999,
        discount: 10,
        stock: 30,
        brand: 'ClassicStride',
        images: [
          'https://via.placeholder.com/400x400?text=Formal+Shoes+1',
          'https://via.placeholder.com/400x400?text=Formal+Shoes+2',
        ],
        sizes: [
          { size: '6', stock: 5 },
          { size: '7', stock: 5 },
          { size: '8', stock: 5 },
          { size: '9', stock: 5 },
          { size: '10', stock: 5 },
          { size: '11', stock: 5 },
        ],
      },
      {
        name: 'Women\'s Athletic Trainers',
        description: 'Stylish athletic trainers designed for women',
        category: 'Women',
        price: 4499,
        discount: 25,
        stock: 45,
        brand: 'FitStep',
        images: [
          'https://via.placeholder.com/400x400?text=Women+Trainers+1',
          'https://via.placeholder.com/400x400?text=Women+Trainers+2',
        ],
        sizes: [
          { size: '5', stock: 9 },
          { size: '6', stock: 9 },
          { size: '7', stock: 9 },
          { size: '8', stock: 9 },
          { size: '9', stock: 9 },
        ],
      },
      {
        name: 'Men\'s Desert Boots',
        description: 'Rugged desert boots for outdoor adventures',
        category: 'Men',
        price: 6499,
        discount: 12,
        stock: 35,
        brand: 'OutdoorTread',
        images: [
          'https://via.placeholder.com/400x400?text=Desert+Boots+1',
          'https://via.placeholder.com/400x400?text=Desert+Boots+2',
        ],
        sizes: [
          { size: '7', stock: 7 },
          { size: '8', stock: 7 },
          { size: '9', stock: 7 },
          { size: '10', stock: 7 },
          { size: '11', stock: 7 },
        ],
      },
      {
        name: 'Women\'s Casual Flats',
        description: 'Comfortable and stylish casual flats for daily use',
        category: 'Women',
        price: 2999,
        discount: 30,
        stock: 60,
        brand: 'ComfortStep',
        images: [
          'https://via.placeholder.com/400x400?text=Casual+Flats+1',
          'https://via.placeholder.com/400x400?text=Casual+Flats+2',
        ],
        sizes: [
          { size: '5', stock: 12 },
          { size: '6', stock: 12 },
          { size: '7', stock: 12 },
          { size: '8', stock: 12 },
          { size: '9', stock: 12 },
        ],
      },
      {
        name: 'Sports Basketball Shoes',
        description: 'Professional basketball shoes with ankle support',
        category: 'Sports',
        price: 7499,
        discount: 18,
        stock: 25,
        brand: 'CourtKing',
        images: [
          'https://via.placeholder.com/400x400?text=Basketball+1',
          'https://via.placeholder.com/400x400?text=Basketball+2',
        ],
        sizes: [
          { size: '7', stock: 5 },
          { size: '8', stock: 5 },
          { size: '9', stock: 5 },
          { size: '10', stock: 5 },
          { size: '11', stock: 5 },
        ],
      },
      {
        name: 'Casual Slip-on Loafers',
        description: 'Easy to wear slip-on loafers in classic style',
        category: 'Casual',
        price: 4299,
        discount: 22,
        stock: 55,
        brand: 'EasyStep',
        images: [
          'https://via.placeholder.com/400x400?text=Loafers+1',
          'https://via.placeholder.com/400x400?text=Loafers+2',
        ],
        sizes: [
          { size: '6', stock: 11 },
          { size: '7', stock: 11 },
          { size: '8', stock: 11 },
          { size: '9', stock: 11 },
          { size: '10', stock: 11 },
        ],
      },
    ];

    await Product.insertMany(products);
    console.log('Sample products created');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
