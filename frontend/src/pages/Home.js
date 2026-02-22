import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    {
      name: 'Men',
      primaryImage: 'https://png.pngtree.com/png-clipart/20241231/original/pngtree-running-shoes-or-sneakers-on-a-transparent-background-png-image_18457027.png',
      hoverImage: 'https://png.pngtree.com/png-clipart/20241110/original/pngtree-sports-shoes-png-image_16808529.png',
      // color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Women',
      primaryImage: 'https://png.pngtree.com/png-clipart/20230430/ourmid/pngtree-womens-sneakers-png-image_6746669.png',
      hoverImage: 'https://png.pngtree.com/png-vector/20230501/ourmid/pngtree-sneakers-running-shoes-color-png-image_7078201.png',
      // color: 'from-pink-400 to-pink-600'
    },
    {
      name: 'Sports',
      primaryImage: 'https://static.vecteezy.com/system/resources/previews/035/654/571/non_2x/ai-generated-sports-shoes-isolated-on-transparent-background-free-png.png',
      hoverImage: 'https://png.pngtree.com/png-clipart/20230506/original/pngtree-fast-running-sneakers-png-image_9145096.png',
      // color: 'from-red-400 to-red-600'
    },
    {
      name: 'Casual',
      primaryImage: 'https://png.pngtree.com/png-vector/20241224/ourmid/pngtree-blue-sneakers-symbolizing-casual-footwear-png-image_14846340.png',
      hoverImage: 'https://static.vecteezy.com/system/resources/thumbnails/052/086/320/small_2x/men-s-casual-shoes-with-black-sole-free-png.png',
      // color: 'from-green-400 to-green-600'
    },
    {
      name: 'Formal',
      primaryImage: 'https://png.pngtree.com/png-vector/20240907/ourmid/pngtree-elegant-blue-leather-oxford-shoes-clipart-illustration-png-image_13783519.png',
      hoverImage: 'https://png.pngtree.com/png-vector/20231104/ourmid/pngtree-classic-oxford-shoes-png-image_10477594.png',
      // color: 'from-purple-400 to-purple-600'
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
                <h3 className="text-white [-webkit-text-stroke:1px_black] text-4xl font-bold text-center drop-shadow-lg mb-2">
                  {category.name}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-black text-0.5xl font-semibold mt-2 drop-shadow-lg">Explore Now</p>
                  <div className="text-black text-xl mt-2">→</div>
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
