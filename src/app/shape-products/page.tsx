"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Filter, Grid, List, ArrowLeft } from "lucide-react";
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

// Client component that uses useSearchParams
const ShapeProductsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shape = searchParams.get("shape");

  const [products, setProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    if (shape) {
      const filteredProducts = productData.filter(
        product => product.shape.toLowerCase() === shape.toLowerCase()
      );
      setProducts(filteredProducts);
    }
  }, [shape]);

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

  const filteredProducts = sortProducts(products);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {shape ? `${shape.charAt(0).toUpperCase() + shape.slice(1)} Shape Collection` : 'All Shapes'}
          </h1>
          <p className="text-gray-600">
            Discover our premium collection of {shape ? shape.toLowerCase() : ''} shaped eyewear
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
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
                  {product.type}
                </div>
              </div>
              
              {/* Content Section */}
              <div className={`p-5 flex flex-col ${
                viewMode === "list" ? "flex-1" : "flex-1 min-h-0"
              }`}>
                <div className="flex-1 mb-4">
                  <h3 className={`font-semibold text-gray-800 mb-2 leading-tight ${
                    viewMode === "list" ? "text-base sm:text-lg" : "text-lg"
                  }`}>
                    {product.title}
                  </h3>
                  <p className={`text-gray-600 leading-relaxed ${
                    viewMode === "list" ? "text-xs sm:text-sm" : "text-sm"
                  }`}>
                    {product.description}
                  </p>
                </div>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for new arrivals
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

// Main page component
const ShapeProductsPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ShapeProductsContent />
    </Suspense>
  );
};

export default ShapeProductsPage; 