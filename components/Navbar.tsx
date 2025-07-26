'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingCart, User, ChevronDown, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';
import { useFavorites } from '../src/contexts/FavoritesContext';
import { getProducts } from '../src/services/homeService';
import colors from '@/constants/colors';
import { useCart } from '../src/contexts/CartContext';

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
  const { cartItems } = useCart();
  const cartCount = cartItems.length;
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
                  {/* Dropdown Menu */}
                  {activeDropdown === key && (
                    <div className="absolute top-full left-0 mt-2 w-64 glass-effect rounded-3xl shadow-2xl border border-white/20 z-50 dropdown-enter">
                      <div className="p-6">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{item.title}</div>
                        <div className="space-y-1">
                          {item.items.map((subItem: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => handleNavItemClick(key, subItem)}
                              className="block w-full text-left px-4 py-3 text-sm font-medium rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 hover-lift"
                            >
                              {subItem}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {/* Right: Special Buttons */}
            {/* <div className="flex items-center space-x-2">
              <button className="bg-teal-400 hover:bg-teal-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">3D TRY ON</button>
              <button className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold px-4 py-2 rounded-xl text-sm transition-all">BLU</button>
              <button className="bg-black hover:bg-gray-900 text-yellow-400 font-bold px-4 py-2 rounded-xl text-sm transition-all">GOLD <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded ml-1 align-middle">MAX</span></button>
            </div> */}
          </div>
        </div>

        {/* Main Navbar (old) and Sub Navbar (old) - Mobile Only */}
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