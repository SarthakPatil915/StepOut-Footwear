import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    {
      name: 'Men',
      primaryImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1552062407-c551eeda4bae?w=500&h=500&fit=crop',
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Women',
      primaryImage: 'https://images.unsplash.com/photo-1543163521-9145f2742f1f?w=500&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop',
      color: 'from-pink-400 to-pink-600'
    },
    {
      name: 'Sports',
      primaryImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1556821552-5c3ee1ab6e37?w=500&h=500&fit=crop',
      color: 'from-red-400 to-red-600'
    },
    {
      name: 'Casual',
      primaryImage: 'https://images.unsplash.com/photo-1525966222134-fceb466e6e85?w=500&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1595341707802-6b2b62af1c91?w=500&h=500&fit=crop',
      color: 'from-green-400 to-green-600'
    },
    {
      name: 'Formal',
      primaryImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1547261741-f0999655eab0?w=500&h=500&fit=crop',
      color: 'from-purple-400 to-purple-600'
    },
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
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Shop By Category</h2>
          <p className="text-lg text-gray-600">Discover our exclusive collection across different styles</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name}`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-72 cursor-pointer transform hover:scale-105"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Image Container */}
              <div className="relative w-full h-full overflow-hidden bg-gray-200">
                {/* Primary Image */}
                <img
                  src={category.primaryImage}
                  alt={`${category.name} shoes`}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    hoveredCategory === category.name ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                
                {/* Hover Image */}
                <img
                  src={category.hoverImage}
                  alt={`${category.name} shoes hover`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    hoveredCategory === category.name ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>

              {/* Overlay with Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t ${category.color} transition-opacity duration-300 ${
                hoveredCategory === category.name ? 'bg-opacity-60' : 'bg-opacity-40'
              }`}></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-white text-3xl font-bold text-center drop-shadow-lg mb-2">
                  {category.name}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-semibold mt-2 drop-shadow-lg">Explore Now</p>
                  <div className="text-white text-xl mt-2">→</div>
                </div>
              </div>

              {/* Shine Effect on Hover */}
              <div className={`absolute inset-0 bg-white opacity-0 transition-opacity duration-300 ${
                hoveredCategory === category.name ? 'opacity-10' : ''
              }`}></div>
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
