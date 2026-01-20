import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-orange-500 mb-4">StepOut</h3>
          <p className="text-gray-400">
            Your one-stop shop for premium footwear. Discover comfort and style.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/" className="hover:text-orange-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-orange-500">
                Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-orange-500">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Returns & Exchanges</li>
            <li>Shipping Info</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4 text-xl">
            <FiFacebook className="hover:text-orange-500 cursor-pointer" />
            <FiInstagram className="hover:text-orange-500 cursor-pointer" />
            <FiTwitter className="hover:text-orange-500 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 StepOut. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
