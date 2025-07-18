'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';
import { useFavorites } from '../src/contexts/FavoritesContext';
import { getProducts } from '../src/services/homeService';
import colors from '@/constants/colors';


interface NavItem {
  title: string;
  items: string[];
}

interface NavItems {
  [key: string]: NavItem;
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [navItems, setNavItems] = useState<NavItems>({});
  
  const { user, userProfile, signOut } = useAuth();
  const { favoritesCount, isLoggedIn } = useFavorites();

  // Fetch products and generate navigation items
  useEffect(() => {
    const fetchProductsAndGenerateNav = async () => {
      try {
        const products = await getProducts();
        
        // Get unique type categories
        const typeCategories = Array.from(
          new Set(
            products.flatMap((p) => (Array.isArray(p.type_category) ? p.type_category : []))
          )
        );

        // Get unique shape categories
        const shapeCategories = Array.from(
          new Set(
            products.filter((p) => p.shape_category).map((p) => p.shape_category!)
          )
        );

        // Get bestseller products
        const bestsellerProducts = products.filter((p) => p.bestseller);

        // Get latest trend products
        const latestTrendProducts = products.filter((p) => p.latest_trend);

        // Generate navigation items
        const dynamicNavItems: NavItems = {};

        // Add type categories with their available shapes
        typeCategories.forEach((type) => {
          // Get shapes available for this specific type
          const shapesForType = Array.from(
            new Set(
              products
                .filter((p) => 
                  Array.isArray(p.type_category) && 
                  p.type_category.some(t => t.toLowerCase() === type.toLowerCase()) &&                
                  p.shape_category
                )
                .map((p) => p.shape_category!)
            )
          );

          const key = type.toLowerCase().replace(/\s+/g, '');
          if (shapesForType.length > 0) {
            dynamicNavItems[key] = {
              title: type,
              items: shapesForType.slice(0, 6) // Limit to 6 shapes per type
            };
          }
        });

        // Add bestsellers
        if (bestsellerProducts.length > 0) {
          dynamicNavItems.bestseller = {
            title: 'Bestseller',
            items: bestsellerProducts.slice(0, 6).map((p) => p.title)
          };
        }

        // Add latest trends
        if (latestTrendProducts.length > 0) {
          dynamicNavItems.latesttrends = {
            title: 'Latest Trends',
            items: latestTrendProducts.slice(0, 6).map((p) => p.title)
          };
        }

        // Add shapes
        if (shapeCategories.length > 0) {
          dynamicNavItems.shapes = {
            title: 'Shapes',
            items: shapeCategories.slice(0, 6)
          };
        }

        console.log('Generated navigation items:', dynamicNavItems);
        setNavItems(dynamicNavItems);
      } catch (error) {
        console.error('Error fetching products for navigation:', error);
        // Fallback to default navigation
        setNavItems({
          sunglasses: {
            title: 'Sunglasses',
            items: ['Aviator', 'Wayfarer', 'Round', 'Cat-Eye', 'Sports', 'Square']
          },
          eyeglasses: {
            title: 'Eyeglasses',
            items: ['Round', 'Cat-Eye', 'Wayfarer', 'Aviator', 'Square']
          },
          computerGlasses: {
            title: 'Computer Glasses',
            items: ['Round', 'Wayfarer', 'Sports', 'Square']
          }
        });
      }
    };

    fetchProductsAndGenerateNav();
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

  const handleLogout = async () => {
    await signOut();
    setUserDropdownOpen(false);
  };

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

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = (key: string, item: string) => {
    // Handle navigation based on the type
    if (key === 'bestseller' || key === 'latesttrends') {
      // Navigate to products page with filter
      window.location.href = `/products?${key}=${encodeURIComponent(item)}`;
    } else if (key === 'shapes') {
      // Navigate to shape products page
      window.location.href = `/shape-products?shape=${encodeURIComponent(item.toLowerCase())}`;
    } else {
      // For product types (eyeglasses, sunglasses, computer glasses, etc.)
      // Navigate to products page with type and shape
      const productType = key; // This is the type like 'eyeglasses', 'sunglasses', etc.
      const shape = item.toLowerCase().replace(/\s+/g, '-');
      window.location.href = `/products?type=${encodeURIComponent(productType)}&shape=${encodeURIComponent(shape)}`;
    }
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
          transform: translateY(0);
          transition: transform 0.3s ease-out;
          will-change: transform;
          overscroll-behavior: contain;
        }
        
        .mobile-menu-content {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          scroll-behavior: smooth;
        }
      `}</style>

      <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-effect shadow-lg' 
          : 'bg-white/90 backdrop-blur-sm shadow-md'
      }`}>
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center group">
              <Link href="/" className="flex items-center space-x-2 hover-lift">
                <div className="relative">
                  <div className={`text-3xl tracking-tight font-bold text-primary`}>
                    EYERIC
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles 
                      size={16} 
                      className="text-yellow-400 animate-pulse-custom" 
                    />
                  </div>
                </div>
                <div className={`hidden sm:block text-xs font-medium`} style={{color:colors.text}}>
                  Premium Eyewear
                </div>
              </Link>
            </div>

            {/* Mobile Top Icons Row */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Favorites Icon */}
              <Link 
                href="/favorites"
                className="relative p-2 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 transition-all duration-300 group"
                style={{ color: colors.muted }}
              >
                <Heart size={22} className="group-hover:text-red-500 transition-all duration-300" />
                {isLoggedIn && favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              {/* Cart Icon */}
              <Link 
                href="/cart"
                className="relative p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
                style={{ color: colors.muted }}
              >
                <ShoppingCart size={22} className="group-hover:text-blue-500 transition-all duration-300" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">2</span>
              </Link>
              {/* User/Profile Icon */}
              {user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center p-2 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                    style={{ color: colors.text }}
                  >
                    <User size={20} />
                  </button>
                  {/* User Dropdown (mobile) */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-47 glass-effect rounded-2xl shadow-2xl border border-white/20 z-50">
                      <div className="p-3">
                        <div className="text-xs font-semibold text-gray-800 mb-1">
                          {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'User'}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {user.email}
                        </div>
                        <div className="space-y-1">
                          <Link
                            href="/profile"
                            className={`block px-2 py-1 text-xs font-medium rounded-xl hover:bg-primary hover:text-text transition-all duration-300`}
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            className={`block px-2 py-1 text-xs font-medium rounded-xl hover:bg-primary hover:text-text transition-all duration-300`}
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            My Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className={`w-full flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-xl hover:bg-primary hover:text-text transition-all duration-300`}
                          >
                            <LogOut size={14} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login"
                  className={`p-2 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-primary transition-all duration-300`}
                  style={{ color: colors.text }}
                >
                  <User size={20} />
                </Link>
              )}
            </div>
            {/* End Mobile Top Icons Row */}

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearchSubmit} className="relative w-full group">
                <div className={`relative transition-all duration-300 ${
                  searchFocused ? 'search-glow' : ''
                }`}>
                  <input
                    type="text"
                    placeholder="Discover your perfect frames..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-6 pr-14 py-3 border-2 border-transparent rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 text-sm placeholder-gray-400"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 group"
                    style={{ color: colors.muted }}
                  >
                    <Search size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                
                {/* Search suggestions overlay */}
                {searchFocused && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fadeInUp z-50">
                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-2">Popular searches</div>
                      {['Ray-Ban', 'Oakley', 'Blue Light Glasses', 'Reading Glasses'].map((suggestion, i) => (
                        <div key={i} className="py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Side Icons - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                href="/favorites"
                className="relative p-3 rounded-2xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 transition-all duration-300 hover-lift group"
                style={{ color: colors.muted }}
              >
                <Heart size={24} className="group-hover:text-red-500 group-hover:scale-110 transition-all duration-300" />
                {isLoggedIn && favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              
              <Link 
                href="/cart"
                className="relative p-3 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover-lift group"
                style={{ color: colors.muted }}
              >
                <ShoppingCart size={24} className="group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">2</span>
              </Link>

              {/* User Authentication Section */}
              {user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-primary transition-all hover:text-white duration-300 hover-lift`}
                  >
                    <User size={20} />
                    <span className="hidden sm:block">
                      {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'User'}
                    </span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 glass-effect rounded-2xl shadow-2xl border border-white/20 z-50">
                      <div className="p-4">
                        <div className="text-sm font-semibold text-gray-800 mb-2">
                          {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'User'}
                        </div>
                        <div className="text-xs text-gray-500 mb-4">
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
                            onClick={handleLogout}
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
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/login"
                    className="px-6 py-2.5 text-sm font-semibold border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 hover-lift"
                    style={{ color: colors.text }}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    className="px-6 py-2.5 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover-lift relative overflow-hidden group"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 relative overflow-hidden group"
                style={{ color: colors.text }}
                aria-label="Toggle mobile menu"
              >
                <div className={`transition-all duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`}>
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Sub Navbar - Desktop */}
        <div className="hidden md:block border-t border-gray-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-1 py-4">
              {Object.entries(navItems).map(([key, item], index) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(key)}
                  onMouseLeave={handleDropdownLeave}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button 
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-semibold rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover-lift group`}
                    style={{ color: colors.text }}
                  >
                    <span className={`group-hover:text-primary transition-colors`}>{item.title}</span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === key ? 'rotate-180' : ''} group-hover:text-blue-600`} />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === key && (
                    <div className="absolute top-full left-0 mt-2 w-64 glass-effect rounded-3xl shadow-2xl border border-white/20 z-50 dropdown-enter">
                      <div className="p-6">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                          {item.title}
                        </div>
                        <div className="space-y-1">
                          {item.items.map((subItem: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => handleNavItemClick(key, subItem)}
                              className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 hover-lift`}
                              style={{ 
                                animationDelay: `${index * 50}ms`
                              }}
                            >
                              {subItem}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu - Optimized version */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-effect border-t border-white/20 mobile-menu">
            <div className="mobile-menu-content max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Search - Simplified */}
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

                {/* Mobile Navigation Items */}
                <div className="space-y-2">
                  {Object.entries(navItems).map(([key, item]) => (
                    <div key={key} className="space-y-1">
                      <div className="text-sm font-semibold px-2 py-1" style={{ color: colors.text }}>
                        {item.title}
                      </div>
                      <div className="space-y-1">
                        {item.items.slice(0, 4).map((subItem: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => {
                              handleNavItemClick(key, subItem);
                              setIsMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors"
                            style={{
                              color: colors.text,
                              background: 'none',
                            }}
                            onMouseOver={e => (e.currentTarget.style.background = colors.primary + '22')}
                            onMouseOut={e => (e.currentTarget.style.background = 'none')}
                          >
                            {subItem}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile User Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <Link 
                      href="/favorites"
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                      style={{ color: colors.muted }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      onMouseOver={e => (e.currentTarget.style.background = colors.primary + '22')}
                      onMouseOut={e => (e.currentTarget.style.background = 'none')}
                    >
                      <Heart size={20} />
                      <span>Favorites</span>
                    </Link>
                    <Link 
                      href="/cart"
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                      style={{ color: colors.muted }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      onMouseOver={e => (e.currentTarget.style.background = colors.primary + '22')}
                      onMouseOut={e => (e.currentTarget.style.background = 'none')}
                    >
                      <ShoppingCart size={20} />
                      <span>Cart</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;