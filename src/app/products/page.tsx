"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Filter, X, Grid, List, ChevronDown, ArrowLeft } from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import productData from "../../../productData";

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

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const shape = searchParams.get("shape");

  const [products, setProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  // Get unique shapes from products
  const shapes = [...new Set(products.map(product => product.shape))];

  useEffect(() => {
    console.log("Category:", category);
    console.log("Type:", type);
    console.log("Shape:", shape);
    console.log("All Products:", productData);

    // Filter products based on category, type, and shape
    const filteredProducts = productData.filter(product => {
      const categoryMatch = !category || product.gender.toLowerCase() === category.toLowerCase();
      const typeMatch = !type || product.type.toLowerCase() === type.toLowerCase();
      const shapeMatch = !shape || product.shape.toLowerCase() === shape.toLowerCase();
      
      console.log("Product:", product.title);
      console.log("Category Match:", categoryMatch);
      console.log("Type Match:", typeMatch);
      console.log("Shape Match:", shapeMatch);
      
      return categoryMatch && typeMatch && shapeMatch;
    });

    console.log("Filtered Products:", filteredProducts);
    setProducts(filteredProducts);
  }, [category, type, shape]);

  const handleShapeFilter = (shape: string) => {
    setSelectedShapes(prev =>
      prev.includes(shape)
        ? prev.filter(s => s !== shape)
        : [...prev, shape]
    );
  };

  const sortProducts = (products: Product[]) => {
    switch (sortBy) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price);
      case "name":
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return products;
    }
  };

  const filteredProducts = sortProducts(
    products.filter(product => {
      const shapeMatch = selectedShapes.length === 0 || selectedShapes.includes(product.shape);
      const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max;
      return shapeMatch && priceMatch;
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-2xl md:text-4xl font-bold mb-2 capitalize">
            {category}&apos;s {type}
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Discover our premium collection of {type} for {category}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Top Bar with Sort and View Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl shadow-md border border-gray-200 transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </button>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{filteredProducts.length}</span> products found
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "grid" 
                    ? "bg-white shadow-sm text-indigo-600" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "list" 
                    ? "bg-white shadow-sm text-indigo-600" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Shape Filters */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Shapes</h3>
                  <div className="space-y-2">
                    {shapes.map((shape) => (
                      <label
                        key={shape}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={selectedShapes.includes(shape)}
                          onChange={() => handleShapeFilter(shape)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-600 capitalize">{shape}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange.min}</span>
                      <span>${priceRange.max}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Products Grid */}
          <div className="flex-1">
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    viewMode === "list" 
                      ? "flex flex-col sm:flex-row h-auto" 
                      : "flex flex-col h-[480px]"
                  }`}
                >
                  {/* Image Section */}
                  <div className={`relative overflow-hidden ${
                    viewMode === "list" 
                      ? "w-full h-48 sm:w-48 sm:h-48 flex-shrink-0" 
                      : "w-full h-64"
                  }`}>
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {product.shape}
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className={`p-5 flex flex-col ${
                    viewMode === "list" ? "flex-1" : "flex-1 min-h-0"
                  }`}>
                    {/* Title and Description */}
                    <div className="flex-1 mb-4">
                      <h3 className={`font-semibold text-gray-800 mb-2 leading-tight ${
                        viewMode === "list" ? "text-base sm:text-lg" : "text-lg"
                      }`}>
                        {viewMode === "list" && window.innerWidth < 640 
                          ? (product.title.length > 40 ? `${product.title.substring(0, 40)}...` : product.title)
                          : (product.title.length > 50 ? `${product.title.substring(0, 50)}...` : product.title)
                        }
                      </h3>
                      <p className={`text-gray-600 leading-relaxed ${
                        viewMode === "list" ? "text-xs sm:text-sm" : "text-sm"
                      }`}>
                        {viewMode === "list" && window.innerWidth < 640
                          ? (product.description.length > 60 ? `${product.description.substring(0, 60)}...` : product.description)
                          : (product.description.length > 80 ? `${product.description.substring(0, 80)}...` : product.description)
                        }
                      </p>
                    </div>
                    
                    {/* Price and Button - Always at bottom */}
                    <div className={`flex items-center justify-between mt-auto pt-3 border-t border-gray-100 ${
                      viewMode === "list" ? "flex-col sm:flex-row gap-3 sm:gap-0" : ""
                    }`}>
                      <span className={`font-bold text-blue-600 ${
                        viewMode === "list" ? "text-lg sm:text-xl" : "text-xl"
                      }`}>
                        ${product.price}
                      </span>
                      <button className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm ${
                        viewMode === "list" ? "w-full sm:w-auto" : ""
                      }`}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced No Results Message */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Filter className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    No products found
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Try adjusting your filters to discover amazing products that match your style
                  </p>
                  <button
                    onClick={() => {
                      setSelectedShapes([]);
                      setPriceRange({ min: 0, max: 1000 });
                    }}
                    className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;