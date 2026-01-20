import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const categories = [
    { name: 'Men', image: 'https://via.placeholder.com/300x300?text=Men+Shoes' },
    { name: 'Women', image: 'https://via.placeholder.com/300x300?text=Women+Shoes' },
    { name: 'Sports', image: 'https://via.placeholder.com/300x300?text=Sports+Shoes' },
    { name: 'Casual', image: 'https://via.placeholder.com/300x300?text=Casual+Shoes' },
    { name: 'Formal', image: 'https://via.placeholder.com/300x300?text=Formal+Shoes' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to StepOut</h1>
          <p className="text-xl mb-8">Discover Premium Footwear For Every Step of Your Life</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Shop Now <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Shop By Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name}`}
              className="group relative overflow-hidden rounded-lg shadow-lg h-64"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold text-center">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick and reliable shipping to your doorstep</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
            <p className="text-gray-600">Authentic products from trusted brands</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
            <p className="text-gray-600">Multiple payment options for your convenience</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
