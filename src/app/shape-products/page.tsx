"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Filter, ChevronDown, Heart, ShoppingBag, SlidersHorizontal } from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FilterSidebar from '../../../components/FilterSidebar';
import { getProducts } from "../../../src/services/homeService";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useHasMounted } from "../../hooks/useHasMounted";

// Define Product interface locally
interface Product {
  id?: string;
  title: string;
  description: string;
  original_price: number;
  discounted_price?: number;
  display_order?: number;
  bestseller?: boolean;
  latest_trend?: boolean;
  banner_image_1?: string;
  banner_image_2?: string;
  colors: { color: string; images: string[] }[];
  sizes: string[];
  frame_material?: string;
  features: string[];
  shape_category?: string;
  tags: string[];
  gender_category: string[];
  type_category: string[];
  created_at?: string;
  updated_at?: string;
}

// Client component that uses useSearchParams
const ShapeProductsContent = () => {  
  const searchParams = useSearchParams();
  const shape = searchParams.get("shape");

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const router = useRouter();
  const { addToFavorites, removeFromFavorites, isFavorite, isLoggedIn } = useFavorites();

  const styleOptions = ["Full Rim", "Half Rim", "Rimless"];
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);

  // Calculate maximum price from all products
  const maxProductPrice = allProducts.length > 0 
    ? Math.max(...allProducts.map(p => p.discounted_price || p.original_price))
    : 1000;
  const maxPrice = maxProductPrice + 500;

  // Update price range when maxPrice changes
  useEffect(() => {
    setPriceRange({ min: 0, max: maxPrice });
  }, [maxPrice]);

  // Fetch all products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      setAllProducts(data as unknown as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Filter products based on shape
  useEffect(() => {
    if (allProducts.length === 0) return;

    if (shape) {
      const filteredProducts = allProducts.filter(
        product => product.shape_category && 
        product.shape_category.toLowerCase() === shape.toLowerCase()
      );
      setProducts(filteredProducts);
    } else {
      setProducts(allProducts);
    }
  }, [shape, allProducts]);

  const sortProducts = (products: Product[]) => {
    switch (sortBy) {
      case "price-low":
        return [...products].sort((a, b) => (a.discounted_price || a.original_price) - (b.discounted_price || b.original_price));
      case "price-high":
        return [...products].sort((a, b) => (b.discounted_price || b.original_price) - (a.discounted_price || a.original_price));
      case "name":
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return products.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
  };

  const filteredProductsRaw = sortProducts(products);

  const handleGenderChange = (gender: string) => {
    router.push(`/products?category=${gender.toLowerCase()}`);
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
    setPriceRange({ min: 0, max: maxPrice });
  };

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    try {
      if (isFavorite(product.id!)) {
        await removeFromFavorites(product.id!);
      } else {
        await addToFavorites(product as unknown as Product);
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  const filteredProducts = filteredProductsRaw.filter(product => {
    const shapeMatch = selectedShapes.length === 0 || 
      (product.shape_category && selectedShapes.includes(product.shape_category.toLowerCase()));
    const styleMatch = selectedStyles.length === 0 || 
      (Array.isArray(product.type_category) && selectedStyles.some(style => 
        product.type_category.map(t => t.toLowerCase()).includes(style.toLowerCase())
      ));
    const priceMatch = (product.discounted_price || product.original_price) >= priceRange.min && 
                      (product.discounted_price || product.original_price) <= priceRange.max;
    return shapeMatch && styleMatch && priceMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb and Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
          <div className="text-gray-400 text-sm mb-2 md:mb-0">
            Home / <span className="text-black font-semibold">{shape ? `${shape.charAt(0).toUpperCase() + shape.slice(1)} Shape Collection` : 'All Shapes'}</span>
          </div>
          <div className="flex items-center gap-4 w-full justify-between sm:justify-end">
            <span className="text-gray-600 text-sm">{filteredProducts.length} products</span>
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
            currentGender={""}
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
            maxPrice={maxPrice}
          />
          {/* Mobile Modal */}
          <FilterSidebar
            currentGender={""}
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
            maxPrice={maxPrice}
          />
          {/* Product Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                    <SlidersHorizontal className="w-10 h-10 text-text" />
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
                  <div 
                    key={product.id} 
                    className="relative bg-white rounded-2xl shadow-lg group overflow-hidden flex flex-col cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Wishlist Icon */}
                    <button 
                      onClick={(e) => handleFavoriteClick(e, product)}
                      className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-colors ${
                          isFavorite(product.id!) ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-red-500'
                        }`} 
                      />
                    </button>
                    {/* Sale Badge */}
                    {product.discounted_price && (
                      <span className="absolute top-3 left-3 z-10 bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full">Sale</span>
                    )}
                    {/* Product Image */}
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <Image 
                        src={product.banner_image_1 || product.banner_image_2 || ''} 
                        alt={product.title} 
                        width={400} 
                        height={300} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">{product.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        {product.discounted_price && (
                          <span className="text-gray-400 line-through text-sm">₹{product.original_price}</span>
                        )}
                        <span className="text-text font-bold text-lg">₹{product.discounted_price || product.original_price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                        <span className="cursor-pointer hover:underline">Compare</span>
                      </div>
                      <button className="mt-auto flex items-center justify-center gap-2 bg-button hover:bg-button/80 text-white rounded-full py-2 px-4 font-semibold shadow transition-all text-sm" onClick={() => handleProductClick(product)}>
                        <ShoppingBag className="w-4 h-4" /> Buy Now
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

const ShapeProductsPage = () => {
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShapeProductsContent />
    </Suspense>
  );
};

export default ShapeProductsPage; 