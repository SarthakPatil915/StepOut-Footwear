import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Import all 10 images
  const images = [
    require('../images/img1.png'),
    require('../images/img2.png'),
    require('../images/img3.png'),
    require('../images/img4.png'),
    require('../images/img5.png'),
    require('../images/img6.png'),
    require('../images/img7.png'),
    require('../images/img8.png'),
    require('../images/img9.png'),
    require('../images/img10.png'),
  ];

  const slides = [
    {
      title: 'Premium Footwear Collection',
      description: 'Discover the finest selection of shoes crafted for comfort and style. Every step matters with StepOut.',
      tagline: 'Quality meets Design',
    },
    {
      title: 'Walk in Confidence',
      description: 'Experience unparalleled comfort with our curated collection. Perfect for every occasion and lifestyle.',
      tagline: 'Comfort First Always',
    },
    {
      title: 'Style Your Steps',
      description: 'From casual to formal, find the perfect pair that matches your personality and preferences.',
      tagline: 'Express Yourself',
    },
    {
      title: 'Trending Styles Now',
      description: 'Stay ahead with our latest collection. Featuring the most sought-after designs this season.',
      tagline: 'Latest Fashion',
    },
    {
      title: 'Exclusive Deals Inside',
      description: 'Amazing discounts on premium brands. Limited time offers on your favorite footwear.',
      tagline: 'Save Big Today',
    },
    {
      title: 'Athletic Performance',
      description: 'Engineered for athletes. Our sports collection delivers performance and durability.',
      tagline: 'Go Further',
    },
    {
      title: 'Everyday Essentials',
      description: 'Casual shoes for everyday wear. Comfort and style combined perfectly.',
      tagline: 'Daily Comfort',
    },
    {
      title: 'Luxury Collection',
      description: 'Elevate your fashion game with our premium designer collection.',
      tagline: 'Pure Elegance',
    },
    {
      title: 'Winter Special',
      description: 'Stay warm and stylish with our winter footwear collection.',
      tagline: 'Cozy & Warm',
    },
    {
      title: 'Golden Opportunity',
      description: 'Grab the best offers before they are gone. Premium quality at unbeatable prices.',
      tagline: 'Limited Offer',
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500); // Change image every 2.5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, images.length]);

  const goToPrev = () => {
    setAutoPlay(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setTimeout(() => setAutoPlay(true), 5000);
  };

  const goToNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  const goToSlide = (index) => {
    setAutoPlay(false);
    setCurrentIndex(index);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  return (
    <section className="w-full bg-gradient-to-r from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Side - Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="space-y-6">
              {/* Tagline */}
              <div className="inline-block">
                <span className="bg-orange-200 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {slides[currentIndex].tagline}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {slides[currentIndex].title}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-700 leading-relaxed">
                {slides[currentIndex].description}
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  to="/products"
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Shop Now
                </Link>
              </div>

              {/* Indicator Dots */}
              <div className="flex gap-2 pt-8">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-orange-500'
                        : 'w-3 bg-gray-400 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Image Carousel */}
          <div className="w-full lg:w-1/2">
            <div className="relative group">
              {/* Main Image Container */}
              <div className="relative w-full aspect-square lg:aspect-auto lg:h-96 rounded-2xl overflow-hidden shadow-2xl bg-white">
                {/* Images */}
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
                      index === currentIndex ? 'opacity-100' : 'opacity-0'
                    } p-4`}
                  />
                ))}

                {/* Decorative Background Circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 -z-10 rounded-2xl" />
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 lg:-translate-x-8 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-label="Previous slide"
              >
                <FiChevronLeft size={24} />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 lg:translate-x-8 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-label="Next slide"
              >
                <FiChevronRight size={24} />
              </button>

              {/* Slide Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                {currentIndex + 1}/{images.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
