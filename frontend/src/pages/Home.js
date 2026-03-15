import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    {
      name: 'Men',
      primaryImage: 'https://png.pngtree.com/png-clipart/20241231/original/pngtree-running-shoes-or-sneakers-on-a-transparent-background-png-image_18457027.png',
      hoverImage: 'https://png.pngtree.com/png-clipart/20241110/original/pngtree-sports-shoes-png-image_16808529.png',
      gradient: 'from-blue-500 to-blue-700',
      icon: '👟',
    },
    {
      name: 'Women',
      primaryImage: 'https://png.pngtree.com/png-clipart/20230430/ourmid/pngtree-womens-sneakers-png-image_6746669.png',
      hoverImage: 'https://png.pngtree.com/png-vector/20230501/ourmid/pngtree-sneakers-running-shoes-color-png-image_7078201.png',
      gradient: 'from-pink-500 to-rose-700',
      icon: '👠',
    },
    {
      name: 'Sports',
      primaryImage: 'https://static.vecteezy.com/system/resources/previews/035/654/571/non_2x/ai-generated-sports-shoes-isolated-on-transparent-background-free-png.png',
      hoverImage: 'https://png.pngtree.com/png-clipart/20230506/original/pngtree-fast-running-sneakers-png-image_9145096.png',
      gradient: 'from-red-500 to-red-700',
      icon: '⚡',
    },
    {
      name: 'Casual',
      primaryImage: 'https://png.pngtree.com/png-vector/20241224/ourmid/pngtree-blue-sneakers-symbolizing-casual-footwear-png-image_14846340.png',
      hoverImage: 'https://static.vecteezy.com/system/resources/thumbnails/052/086/320/small_2x/men-s-casual-shoes-with-black-sole-free-png.png',
      gradient: 'from-green-500 to-emerald-700',
      icon: '😎',
    },
    {
      name: 'Formal',
      primaryImage: 'https://png.pngtree.com/png-vector/20240907/ourmid/pngtree-elegant-blue-leather-oxford-shoes-clipart-illustration-png-image_13783519.png',
      hoverImage: 'https://png.pngtree.com/png-vector/20231104/ourmid/pngtree-classic-oxford-shoes-png-image_10477594.png',
      gradient: 'from-purple-500 to-indigo-700',
      icon: '🎩',
    },
  ];

  return (
    <div>
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                EXPLORE NOW
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4 pb-4">
              Shop By Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our exclusive collection across different styles. Find the perfect pair that matches your lifestyle and personality.
            </p>
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="group relative overflow-hidden rounded-2xl cursor-pointer h-80"
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"></div>

                {/* Image Container */}
                <div className="relative w-full h-full overflow-hidden bg-gray-100 rounded-2xl">
                  {/* Primary Image */}
                  <img
                    src={category.primaryImage}
                    alt={`${category.name} shoes`}
                    className={`w-full h-full object-contain p-4 transition-all duration-500 transform ${
                      hoveredCategory === category.name ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
                    }`}
                  />
                  
                  {/* Hover Image */}
                  <img
                    src={category.hoverImage}
                    alt={`${category.name} shoes hover`}
                    className={`absolute inset-0 w-full h-full object-contain p-4 transition-all duration-500 transform ${
                      hoveredCategory === category.name ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                    }`}
                  />
                </div>

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b ${category.gradient} opacity-0 group-hover:opacity-30 transition-all duration-300 rounded-2xl`}></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6 rounded-2xl bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-2xl font-bold text-center mb-2">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-white text-sm font-semibold">
                      <span>Explore Now</span>
                      <FiArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-300 z-10">
                  {category.icon}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="mb-4 flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center bg-blue-50 group-hover:bg-blue-100 group-hover:border-blue-600 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                <img 
                  src="https://uxwing.com/wp-content/themes/uxwing/download/logistics-shipping-delivery/fast-delivery-icon.png" 
                  alt="Fast Delivery" 
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick and reliable shipping to your doorstep</p>
          </div>
          <div className="text-center group">
            <div className="mb-4 flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center bg-green-50 group-hover:bg-green-100 group-hover:border-green-600 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/9375/9375314.png" 
                  alt="Quality Assured" 
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
            <p className="text-gray-600">Authentic products from trusted brands</p>
          </div>
          <div className="text-center group">
            <div className="mb-4 flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-purple-400 flex items-center justify-center bg-purple-50 group-hover:bg-purple-100 group-hover:border-purple-600 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                <img 
                  src="https://cdn-icons-png.flaticon.com/256/6993/6993594.png" 
                  alt="Secure Payment" 
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
            <p className="text-gray-600">Multiple payment options for your convenience</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
