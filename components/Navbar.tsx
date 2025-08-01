'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingCart, User, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';
import { useFavorites } from '../src/contexts/FavoritesContext';
import { getCategories, Category } from '../src/services/categoryService';
import colors from '@/constants/colors';
import { useCart } from '../src/contexts/CartContext';

interface NavItem {
  title: string;
  items: string[];
}

interface NavItems {
  [key: string]: NavItem;
}

interface CategoryData {
  gender: Category[];
  style: Category[];
  shape: Category[];
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [navItems, setNavItems] = useState<NavItems>({});
  const [categoryData, setCategoryData] = useState<CategoryData>({
    gender: [],
    style: [],
    shape: []
  });
  
  const { user, userProfile, signOut } = useAuth();
  const { favoritesCount, isLoggedIn } = useFavorites();
  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  // Fetch categories and generate navigation items
  useEffect(() => {
    const fetchCategoriesAndGenerateNav = async () => {
      try {
        const categories = await getCategories();
        
        // Organize categories by type
        const organizedCategories: CategoryData = {
          gender: categories.filter(c => c.category_type === 'gender'),
          style: categories.filter(c => c.category_type === 'style'),
          shape: categories.filter(c => c.category_type === 'shape')
        };
        
        setCategoryData(organizedCategories);
        
        // Get type categories from the database
        const typeCategories = categories.filter(c => c.category_type === 'type');

        // Generate navigation items - only show type categories
        const dynamicNavItems: NavItems = {};

        // Add type categories from database
        typeCategories.forEach((type) => {
          const key = type.name.toLowerCase().replace(/\s+/g, '');
          dynamicNavItems[key] = {
            title: type.name,
            items: [] // We'll populate this from categories data
          };
        });

        console.log('Generated navigation items:', dynamicNavItems);
        setNavItems(dynamicNavItems);
      } catch (error) {
        console.error('Error fetching categories for navigation:', error);
        // Fallback to default navigation
        setNavItems({
          eyeglasses: {
            title: 'Eyeglasses',
            items: []
          },
          sunglasses: {
            title: 'Sunglasses',
            items: []
          },
          computerGlasses: {
            title: 'Computer Glasses',
            items: []
          }
        });
      }
    };

    fetchCategoriesAndGenerateNav();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (userDropdownOpen && !target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleMobileClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-backdrop')) {
        setIsMobileMenuOpen(false);
        setMobileActiveDropdown(null);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setMobileActiveDropdown(null);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleMobileClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleMobileClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isMobileMenuOpen]);

  const handleDropdownEnter = (key: string): void => {
    setActiveDropdown(key);
  };

  const handleDropdownLeave = (): void => {
    setActiveDropdown(null);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  const handleNavItemClick = (key: string, item: string) => {
    // Handle navigation based on the category type
    const productType = key; // This is the type like 'eyeglasses', 'sunglasses', etc.
    
    // Check if the item is a gender category
    const genderCategory = categoryData.gender.find(g => g.name === item);
    if (genderCategory) {
      window.location.href = `/products?type=${encodeURIComponent(productType)}&gender=${encodeURIComponent(item.toLowerCase())}`;
      return;
    }
    
    // Check if the item is a style category
    const styleCategory = categoryData.style.find(s => s.name === item);
    if (styleCategory) {
      window.location.href = `/products?type=${encodeURIComponent(productType)}&style=${encodeURIComponent(item.toLowerCase())}`;
      return;
    }
    
    // Check if the item is a shape category
    const shapeCategory = categoryData.shape.find(s => s.name === item);
    if (shapeCategory) {
      window.location.href = `/shape-products?shape=${encodeURIComponent(item.toLowerCase())}`;
      return;
    }
    
    // For other items (collections, brands, top picks)
    window.location.href = `/products?type=${encodeURIComponent(productType)}&category=${encodeURIComponent(item.toLowerCase())}`;
  };

  const handleMobileDropdownToggle = (key: string) => {
    setMobileActiveDropdown(mobileActiveDropdown === key ? null : key);
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .glass-effect {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .gradient-text {
          background: #008080;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .search-glow {
          box-shadow: 0 0 20px rgba(0, 128, 128, 0.3);
        }
        
        .hover-lift {
          transition: transform 0.2s ease-out;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        
        /* Optimize mobile menu animations */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          transform: translateX(-100%);
          transition: transform 0.3s ease-out;
          will-change: transform;
          z-index: 1000;
        }
        
        .mobile-menu.open {
          transform: translateX(0);
        }
        
        .mobile-menu-content {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          scroll-behavior: smooth;
          height: 100vh;
          padding-top: 0rem; /* Account for mobile header */
        }
        
        .dropdown-enter {
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease-out;
          z-index: 999;
        }
        
        .mobile-backdrop.open {
          opacity: 1;
          visibility: visible;
        }
        
        .mobile-dropdown {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        
        .mobile-dropdown.open {
          max-height: 500px;
        }
        
        .mobile-nav-item {
          transition: all 0.2s ease-out;
        }
        
        .mobile-nav-item:hover {
          background: rgba(0, 128, 128, 0.05);
        }
        
        .mobile-category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
        }
        
        .mobile-category-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          transition: all 0.2s ease-out;
        }
        
        .mobile-category-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #008080;
        }
        
        .mobile-category-icon {
          width: 40px;
          height: 40px;
          margin: 0 auto 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }
        
        .mobile-section-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .mobile-menu-content {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          scroll-behavior: smooth;
          height: 100vh;
          padding-top: 0rem; /* Account for mobile header */
        }
        
        /* Custom scrollbar for mobile menu */
        .mobile-menu-content::-webkit-scrollbar {
          width: 4px;
        }
        
        .mobile-menu-content::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .mobile-menu-content::-webkit-scrollbar-thumb {
          background: rgba(0, 128, 128, 0.3);
          border-radius: 2px;
        }
        
        .mobile-menu-content::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 128, 128, 0.5);
        }
      `}</style>

      <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-effect shadow-lg' 
          : 'bg-white/90 backdrop-blur-sm shadow-md'
      }`}>
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/90 border-b border-gray-100/50">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">EYERIC</div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/favorites" className="relative">
              <Heart size={20} className="text-gray-700" />
              {isLoggedIn && favoritesCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">{favoritesCount}</span>
              )}
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingCart size={20} className="text-gray-700" />
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">{cartCount}</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* Top Bar - Desktop Only */}
        <div className="hidden md:flex w-full bg-white/90 border-b border-gray-100/50 py-2 px-4 items-center justify-between">
          {/* Left: Logo and Phone */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 hover-lift">
              <div className="relative">
                <div className={`text-3xl tracking-tight font-bold text-primary`}>EYERIC</div>
              </div>
              <div className={`hidden lg:block text-xs font-medium`} style={{color:colors.text}}>
                Premium Eyewear
              </div>
            </Link>
          </div>
          {/* Center: Search Bar */}
          <div className="flex-1 flex justify-center px-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl group">
              <div className={`relative transition-all duration-300 ${searchFocused ? 'search-glow' : ''}`}>  
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-6 pr-14 py-2.5 border-2 border-gray-200 rounded-2xl bg-white focus:outline-none focus:border-blue-400 transition-all duration-300 text-base placeholder-gray-400"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 group"
                  style={{ color: colors.muted }}
                >
                  <Search size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </form>
          </div>
          {/* Right: Top Links */}
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-primary">Track Order</Link>
            {user ? (
              <div className="relative user-dropdown">
                <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="text-sm font-medium text-gray-700 hover:text-primary flex items-center space-x-1">
                  <User size={18} />
                  {isLoggedIn ? userProfile?.first_name + ' ' + userProfile?.last_name : 'My Account'}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-68 glass-effect rounded-2xl shadow-2xl border border-white/20 z-50">
                    <div className="p-4">
                      <div className="text-sm font-semibold text-gray-800 mb-2">
                        {user.email}
                      </div>
                      <div className="space-y-2">
                        <Link
                          href="/profile"
                          className={`block px-3 py-2 text-sm font-medium rounded-xl hover:bg-primary hover:text-white transition-all duration-300`}
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          className={`block px-3 py-2 text-sm font-medium rounded-xl hover:bg-primary hover:text-white transition-all duration-300`}
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={async () => { await signOut(); setUserDropdownOpen(false); }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl hover:bg-primary hover:text-white transition-all duration-300`}
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-primary">Sign In & Sign Up</Link>
            )}
            <Link href="/favorites" className="relative group">
              <Heart size={22} className="text-gray-700 group-hover:text-red-500 transition-all duration-300" />
              {isLoggedIn && favoritesCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">{favoritesCount}</span>
              )}
            </Link>
            <Link href="/cart" className="relative group">
              <ShoppingCart size={22} className="text-gray-700 group-hover:text-blue-500 transition-all duration-300" />
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">{cartCount}</span>
            </Link>
          </div>
        </div>

        {/* Main Navbar Row - Desktop Only */}
        <div className="hidden md:flex w-full bg-white/90">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-4">
            {/* Left: Main Nav Links */}
            <div className="flex items-center space-x-2">
              {Object.entries(navItems).map(([key, item]) => (
                <button
                  key={key}
                  onMouseEnter={() => handleDropdownEnter(key)}
                  onMouseLeave={handleDropdownLeave}
                  className={`relative flex items-center px-3 py-4 text-sm font-semibold uppercase tracking-wide hover:text-primary hover:bg-gray-50 rounded transition-all duration-200 ${activeDropdown === key ? 'text-primary' : ''}`}
                  style={{ color: colors.text }}
                >
                  {item.title}
                  <ChevronDown size={14} className={`ml-1 transition-transform duration-300 ${activeDropdown === key ? 'rotate-180' : ''}`} />
                  {/* Full Width Dropdown Menu */}
                  {activeDropdown === key && (
                    <div className="absolute top-full w-[1000px] left-0 right-0 mt-2 glass-effect shadow-2xl border border-white/20 z-50 dropdown-enter">
                      <div className="max-w-6xl p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                          {/* SELECT CATEGORY Column */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-bold text-left text-gray-400 uppercase tracking-wider mb-6">SELECT CATEGORY</h3>
                            <div className="space-y-4">
                              {categoryData.gender.map((gender) => (
                                <button
                                  key={gender.id}
                                  onClick={() => handleNavItemClick(key, gender.name)}
                                  className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-gray-50/80 transition-all duration-300 group"
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className="w-8 h-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                      <span className="text-xl">👤</span>
                                    </div>
                                    <div className="text-left">
                                      <div className="font-semibold text-gray-800 text-base">{(gender.name).toUpperCase()}</div>
                                      {/* <div className="text-xs text-gray-500 mt-1">
                                        {gender.name === 'Men' ? 'CLASSIC EYEGLASSES Starting From ₹2000' :
                                         gender.name === 'Women' ? 'PREMIUM EYEGLASSES Starting From ₹4000' :
                                         'SCREEN EYEGLASSES Starting From ₹600'}
                                      </div> */}
                                    </div>
                                  </div>
                                  <div className="text-gray-400 group-hover:text-primary transition-colors text-lg">
                                    →
                                  </div>
                                </button>
                              ))}
                              
                              {/* Top Picks mixed in */}
                              {/* {['New Arrivals', 'Best Seller', 'Lenskart BLU Lenses', 'Progressive'].map((item, idx) => (
                                <button
                                  key={`top-${idx}`}
                                  onClick={() => handleNavItemClick(key, item)}
                                  className="flex items-center space-x-4 w-full p-3 rounded-lg hover:bg-gray-50/80 transition-all duration-300 group"
                                >
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-sm">🔥</span>
                                  </div>
                                  <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">{item}</span>
                                </button>
                              ))} */}
                            </div>
                          </div>

                          {/* TYPE Column */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-bold text-left text-gray-400 uppercase tracking-wider mb-6">TYPE</h3>
                            <div className="space-y-3">
                              {categoryData.style.map((style) => (
                                <button
                                  key={style.id}
                                  onClick={() => handleNavItemClick(key, style.name)}
                                  className="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                  {style.name.toUpperCase()}
                                </button>
                              ))}
                              
                            </div>
                          </div>

                          {/* BRANDS Column */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-bold text-left text-gray-400 uppercase tracking-wider mb-6">Shapes</h3>
                            <div className="space-y-3">
                              {/* {['Vincent Chase', 'Lenskart Air', 'Lenskart STUDIO'].map((item, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleNavItemClick(key, item)}
                                  className="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                  {item}
                                </button>
                              ))} */}
                              {categoryData.shape.map((shape) => (
                                <button
                                  key={shape.id}
                                  onClick={() => handleNavItemClick(key, shape.name)}
                                  className="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                  {shape.name.toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Backdrop */}
        <div 
          className={`mobile-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu */}
        <div className={`md:hidden glass-effect mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            {/* Close Button */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200/50">
              <div className="text-xl font-bold text-primary">Eyeric</div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>
            
            <div className="px-4 py-4 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search amazing frames..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-colors duration-200 bg-gray-50"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200"
                  style={{ color: colors.muted }}
                >
                  <Search size={20} />
                </button>
              </form>

              {/* Mobile Navigation Items with Dropdowns */}
              <div className="space-y-2">
                {Object.entries(navItems).map(([key, item]) => (
                  <div key={key} className="mobile-nav-item">
                    <button
                      onClick={() => handleMobileDropdownToggle(key)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left rounded-xl hover:bg-gray-50/80 transition-all duration-300"
                    >
                      <span className="font-semibold text-gray-800 text-base">{item.title}</span>
                      <ChevronDown 
                        size={20} 
                        className={`text-gray-500 transition-transform duration-300 ${
                          mobileActiveDropdown === key ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {/* Dropdown Content */}
                    <div className={`mobile-dropdown ${mobileActiveDropdown === key ? 'open' : ''}`}>
                      <div className="px-4 pb-4 space-y-6">
                        {/* Gender Categories */}
                        {categoryData.gender.length > 0 && (
                          <div>
                            <div className="mobile-section-title">Select Gender</div>
                            <div className="mobile-category-grid">
                              {categoryData.gender.map((gender) => (
                                <button
                                  key={gender.id}
                                  onClick={() => {
                                    handleNavItemClick(key, gender.name);
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className="mobile-category-card"
                                >
                                  {/* <div className="mobile-category-icon bg-gradient-to-br from-blue-100 to-purple-100">
                                    👤
                                  </div> */}
                                  <div className="font-semibold text-gray-800 text-sm">{gender.name}</div>
                                  {/* <div className="text-xs text-gray-500 mt-1">
                                    {gender.name === 'Men' ? 'Starting From ₹2000' :
                                     gender.name === 'Women' ? 'Starting From ₹4000' :
                                     'Starting From ₹600'}
                                  </div> */}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Style Categories */}
                        {categoryData.style.length > 0 && (
                          <div>
                            <div className="mobile-section-title">Select Style</div>
                            <div className="grid grid-cols-2 gap-2">
                              {categoryData.style.map((style) => (
                                <button
                                  key={style.id}
                                  onClick={() => {
                                    handleNavItemClick(key, style.name);
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition-all duration-300 text-left"
                                >
                                  {style.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Shape Categories */}
                        {categoryData.shape.length > 0 && (
                          <div>
                            <div className="mobile-section-title">Select Shape</div>
                            <div className="grid grid-cols-2 gap-2">
                              {categoryData.shape.map((shape) => (
                                <button
                                  key={shape.id}
                                  onClick={() => {
                                    handleNavItemClick(key, shape.name);
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition-all duration-300 text-left"
                                >
                                  {shape.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="mobile-section-title">Quick Actions</div>
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href="/favorites"
                    className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100"
                    style={{ color: colors.muted }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart size={20} className="text-red-500" />
                    <span>Favorites</span>
                  </Link>
                  <Link 
                    href="/cart"
                    className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
                    style={{ color: colors.muted }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart size={20} className="text-blue-500" />
                    <span>Cart</span>
                  </Link>
                </div>
              </div>

              {/* User Account Section */}
              {user && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="mobile-section-title">My Account</div>
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={20} className="text-gray-500" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingCart size={20} className="text-gray-500" />
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={async () => { 
                        await signOut(); 
                        setIsMobileMenuOpen(false); 
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300 w-full text-left"
                    >
                      <LogOut size={20} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar; 