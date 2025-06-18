'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';

// Import your colors
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
  
  const { user, userProfile, signOut } = useAuth();

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

  const navItems: NavItems = {
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
    },
    bestseller: {
      title: 'Bestseller',
      items: ['Top Rated', 'Most Popular', 'Customer Choice', 'Editor Pick', 'Trending', 'New Arrivals']
    },
    offers: {
      title: 'Offers',
      items: ['Flash Sale', 'Buy 1 Get 1', 'Student Discount', 'First Order', 'Clearance', 'Bundle Deals']
    },
    upcoming: {
      title: 'Upcoming',
      items: ['Pre-Order', 'Limited Edition', 'New Collection', 'Fashion Week', 'Celebrity Line', 'Tech Innovation']
    }
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
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .search-glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
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
                  <div className="text-3xl font-black gradient-text tracking-tight">
                    EYERIC
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles 
                      size={16} 
                      className="text-yellow-400 animate-pulse-custom" 
                    />
                  </div>
                </div>
                <div className="hidden sm:block text-xs text-gray-500 font-medium">
                  Premium Eyewear
                </div>
              </Link>
            </div>

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
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">3</span>
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
                    className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 hover-lift"
                    style={{ color: colors.text }}
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
                            className="block px-3 py-2 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="block px-3 py-2 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            My Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white transition-all duration-300"
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
                    className="flex items-center space-x-2 px-4 py-3 text-sm font-semibold rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover-lift group"
                    style={{ color: colors.text }}
                  >
                    <span className="group-hover:text-blue-600 transition-colors">{item.title}</span>
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
                            <Link
                              key={index}
                              href={`/${key.toLowerCase()}/${subItem.toLowerCase()}`}
                              className="block px-4 py-3 text-sm font-medium rounded-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 hover-lift"
                              style={{ 
                                color: colors.text,
                                animationDelay: `${index * 50}ms`
                              }}
                            >
                              {subItem}
                            </Link>
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

                {/* Mobile Icons - Simplified */}
                <div className="flex justify-around py-2">
                  {[
                    { href: '/favorites', icon: Heart, label: 'Favorites', count: 3, color: 'text-red-500' },
                    { href: '/cart', icon: ShoppingCart, label: 'Cart', count: 2, color: 'text-blue-500' },
                    { href: user ? '/profile' : '/login', icon: User, label: user ? 'Profile' : 'Account', count: 0, color: 'text-purple-500' }
                  ].map((item) => (
                    <Link 
                      key={item.label}
                      href={item.href}
                      className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="relative">
                        <item.icon size={24} className={item.color} />
                        {item.count > 0 && (
                          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                            {item.count}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                {user ? (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-sm font-semibold text-gray-800 mb-2">
                      Welcome, {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'User'}!
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white transition-all duration-300"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-3 pt-2">
                    <Link 
                      href="/login"
                      className="flex-1 px-4 py-2.5 text-sm font-semibold text-center border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
                      style={{ color: colors.text }}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup"
                      className="flex-1 px-4 py-2.5 text-sm font-semibold text-white text-center rounded-xl hover:shadow-md transition-all duration-200"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

              {/* Mobile Navigation Items */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                {Object.entries(navItems).map(([key, item], index) => (
                  <div key={key} className="animate-slideInLeft" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="font-bold text-base mb-3 text-gray-800 flex items-center space-x-2">
                      <span>{item.title}</span>
                      <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-4">
                      {item.items.map((subItem: string, subIndex: number) => (
                        <Link
                          key={subIndex}
                          href={`/${key.toLowerCase()}/${subItem.toLowerCase()}`}
                          className="py-3 px-4 text-sm font-medium rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 text-gray-600 hover-lift"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
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