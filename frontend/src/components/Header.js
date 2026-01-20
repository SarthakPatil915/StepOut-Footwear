import React, { useState } from 'react';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiChevronDown, FiHeart } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  // eslint-disable-next-line no-unused-vars
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500">
          StepOut
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-gray-700 hover:text-orange-500 transition">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-orange-500 transition">
            Products
          </Link>

          {user ? (
            <>
              {user.role === 'customer' && (
                <>
                  <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-orange-500">
                    <FiShoppingCart /> Cart
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-2 text-gray-700 hover:text-orange-500">
                    <FiHeart /> Wishlist
                  </Link>
                  <Link to="/orders" className="text-gray-700 hover:text-orange-500 transition">
                    Orders
                  </Link>
                </>
              )}

          {user.role === 'admin' && (
            <div className="relative group">
              <div className="flex items-center gap-1 text-gray-700 hover:text-orange-500 cursor-pointer">
                <span>Admin</span>
                <FiChevronDown size={18} />
              </div>
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-10">
                <Link
                  to="/admin/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-100 rounded-t-lg"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
                >
                  Product Management
                </Link>
                <Link
                  to="/admin/orders"
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-100 rounded-b-lg"
                >
                  Order Management
                </Link>
              </div>
            </div>
          )}

              <div className="flex items-center gap-2">
                <FiUser className="text-gray-700" />
                <span className="text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-orange-500 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <FiX size={24} className="text-gray-700" />
          ) : (
            <FiMenu size={24} className="text-gray-700" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-100 p-4 flex flex-col gap-4">
          <Link to="/" className="text-gray-700 hover:text-orange-500">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-orange-500">
            Products
          </Link>

          {user ? (
            <>
              {user.role === 'customer' && (
                <>
                  <Link to="/cart" className="text-gray-700 hover:text-orange-500">
                    Cart
                  </Link>
                  <Link to="/wishlist" className="text-gray-700 hover:text-orange-500">
                    Wishlist
                  </Link>
                  <Link to="/orders" className="text-gray-700 hover:text-orange-500">
                    Orders
                  </Link>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <button
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    className="flex items-center justify-between w-full text-gray-700 hover:text-orange-500"
                  >
                    <span>Admin Panel</span>
                    <FiChevronDown size={18} className={`transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isAdminMenuOpen && (
                    <div className="ml-4 flex flex-col gap-2 border-l-2 border-orange-300 pl-4">
                      <Link to="/admin/dashboard" className="text-gray-700 hover:text-orange-500">
                        Dashboard
                      </Link>
                      <Link to="/admin/products" className="text-gray-700 hover:text-orange-500">
                        Product Management
                      </Link>
                      <Link to="/admin/orders" className="text-gray-700 hover:text-orange-500">
                        Order Management
                      </Link>
                    </div>
                  )}
                </>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-orange-500">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-center"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
