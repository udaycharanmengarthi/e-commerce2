import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, User, Home } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../cart/CartDrawer';
import { getCategories } from '../../data/products';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const categories = getCategories();

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen || isCartOpen
          ? 'bg-white shadow-md py-3'
          : 'bg-white py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight flex items-center"
          >
            <span className="text-blue-600">ShopElite</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase()}`}
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                  location.pathname === `/category/${category.toLowerCase()}` 
                    ? 'text-blue-600' 
                    : 'text-gray-700'
                }`}
              >
                {category}
              </Link>
            ))}
          </nav>

          {/* Right Section (Search, Wishlist, Cart) */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100 relative"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account */}
            <Link
              to="/account"
              className="hidden md:flex p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 md:hidden rounded-full hover:bg-gray-100"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar (conditional) */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="mt-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <Search size={20} />
            </button>
          </form>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <nav className="flex flex-col py-2">
              <Link
                to="/"
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  className="px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  {category}
                </Link>
              ))}
              <Link
                to="/account"
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <User size={18} />
                <span>Account</span>
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </header>
  );
};

export default Header;