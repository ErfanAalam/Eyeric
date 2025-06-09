'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import productData from '../../../../productData';

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
  const [products, setProducts] = useState<Product[]>([]);
  const category = params.category as string;
  const shape = params.shape as string;

  useEffect(() => {
    // Filter products based on category and shape
    const filteredProducts = productData.filter(product => {
      const categoryMatch = product.type.toLowerCase() === category.toLowerCase();
      const shapeMatch = product.shape.toLowerCase() === shape.toLowerCase();
      return categoryMatch && shapeMatch;
    });
    setProducts(filteredProducts);
  }, [category, shape]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl md:text-4xl font-bold mb-2 capitalize">
            {category} - {shape}
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Discover our premium collection of {shape} {category}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-gray-600">
            {products.length} products found
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  width={500}
                  height={500}
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No products found
            </h2>
            <p className="text-gray-600">
              Try adjusting your filters or browse our other categories
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryShapePage; 