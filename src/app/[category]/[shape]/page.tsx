'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, Heart, ShoppingBag, SlidersHorizontal, Filter } from 'lucide-react';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import productData from '../../../../productData';
import FilterSidebar from '../../../../components/FilterSidebar';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  displayOrder: number;
  gender: string;
  type: string;
  shape: string;
  image: string;
}

const CategoryShapePage = () => {
  const params = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const category = params.category as string;
  const shape = params.shape as string;
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const styleOptions = ["Full Rim", "Half Rim", "Rimless"];
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);

  useEffect(() => {
    // Filter products based on category and shape
    const filteredProducts = productData.filter(product => {
      const categoryMatch = product.type.toLowerCase() === category.toLowerCase();
      const shapeMatch = product.shape.toLowerCase() === shape.toLowerCase();
      return categoryMatch && shapeMatch;
    });
    setProducts(filteredProducts);
  }, [category, shape]);

  const handleGenderChange = (gender: string) => {
    if (category !== gender.toLowerCase()) {
      router.push(`/products?category=${gender.toLowerCase()}&type=${shape || ''}`);
    }
  };
  const handlePriceChange = (price: { min: number; max: number }) => {
    setPriceRange(price);
  };

  const onApplyFilters = (styles: string[], shapes: string[]) => {
    setSelectedStyles(styles);
    setSelectedShapes(shapes);
  };
  const onClearFilters = () => {
    setSelectedStyles([]);
    setSelectedShapes([]);
    setPriceRange({ min: 0, max: 1000 });
  };

  const filteredProducts = products.filter(product => {
    const shapeMatch = selectedShapes.length === 0 || selectedShapes.includes(product.shape.toLowerCase());
    const styleMatch = selectedStyles.length === 0 || selectedStyles.includes(product.type);
    const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max;
    return shapeMatch && styleMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb and Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
          <div className="text-gray-400 text-sm mb-2 md:mb-0">
            Home / <span className="text-black font-semibold">{category} - {shape}</span>
          </div>
          <div className="flex items-center gap-4 w-full justify-between sm:justify-end">
            <span className="text-gray-600 text-sm">{products.length} products</span>
            <button className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow hover:bg-gray-50 transition" onClick={() => setShowFilters(true)}>
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="featured">Best selling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <FilterSidebar
            currentGender={category || ''}
            onGenderChange={handleGenderChange}
            selectedStyles={selectedStyles}
            selectedShapes={selectedShapes}
            currentPrice={priceRange}
            onPriceChange={handlePriceChange}
            styleOptions={styleOptions}
            show={false}
            onClose={() => setShowFilters(false)}
            isMobile={false}
            onClearFilters={onClearFilters}
            onApplyFilters={onApplyFilters}
          />
          {/* Mobile Modal */}
          <FilterSidebar
            currentGender={category || ''}
            onGenderChange={handleGenderChange}
            selectedStyles={selectedStyles}
            selectedShapes={selectedShapes}
            currentPrice={priceRange}
            onPriceChange={handlePriceChange}
            styleOptions={styleOptions}
            show={showFilters}
            onClose={() => setShowFilters(false)}
            isMobile={true}
            onClearFilters={onClearFilters}
            onApplyFilters={onApplyFilters}
          />
          {/* Product Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <SlidersHorizontal className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    No products found
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Try adjusting your filters to discover amazing products that match your style
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="relative bg-white rounded-2xl shadow-lg group overflow-hidden flex flex-col">
                    {/* Wishlist Icon */}
                    <button className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition">
                      <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                    </button>
                    {/* Sale Badge */}
                    <span className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Sale</span>
                    {/* Product Image */}
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <Image src={product.image} alt={product.title} width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">{product.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400 line-through text-sm">₹2,099</span>
                        <span className="text-blue-600 font-bold text-lg">₹{product.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                        <span className="cursor-pointer hover:underline">Compare</span>
                      </div>
                      <button className="mt-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2 px-4 font-semibold shadow transition-all text-sm">
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryShapePage; 