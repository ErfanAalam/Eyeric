"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, Heart, ShoppingBag, SlidersHorizontal, Filter } from "lucide-react";
import { Search } from "lucide-react";
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
const ProductsContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const shape = searchParams.get("shape");

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [searchQuery, setSearchQuery] = useState("");
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
      setAllProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Filter products based on URL parameters
  useEffect(() => {
    if (allProducts.length === 0) return;

    // Normalization helper
    const normalize = (str: string) => str.toLowerCase().replace(/[\s-]/g, '');

    // Debug: Log all unique shapes in the database
    const allShapes = Array.from(new Set(allProducts.filter(p => p.shape_category).map(p => p.shape_category)));
    console.log("All shapes in database:", allShapes);

    // Debug: Log all products that match the shape regardless of type
    if (shape) {
      const shapeMatches = allProducts.filter(product => product.shape_category && normalize(product.shape_category) === normalize(shape));
      console.log("Products matching shape only:", shapeMatches.map(p => p.title));
    }

    // Filter products based on category, type, and shape
    const filteredProducts = allProducts.filter(product => {
      // Handle category (gender) filtering
      const categoryMatch = !category || 
        (Array.isArray(product.gender_category) && 
         product.gender_category.map(g => normalize(g)).includes(normalize(category)));
      
      // Handle type filtering (from Navbar navigation) - check if any type matches
      const typeMatch = !type || 
        (Array.isArray(product.type_category) && 
         product.type_category.some(t => normalize(t) === normalize(type)));
      
      // Handle shape filtering - normalize both the URL shape and product shape
      const shapeMatch = !shape || 
        (product.shape_category && normalize(product.shape_category) === normalize(shape));
      
      return categoryMatch && typeMatch && shapeMatch;
    });

    console.log("Filtered Products:", filteredProducts);
    setProducts(filteredProducts);
  }, [category, type, shape, allProducts]);

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

  const handleGenderChange = (gender: string) => {
    if (category !== gender.toLowerCase()) {
      router.push(`/products?category=${gender.toLowerCase()}&type=${type || ''}`);
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
        await addToFavorites(product);
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  const filteredProducts = sortProducts(
    products.filter(product => {
      const shapeMatch = selectedShapes.length === 0 || 
        (product.shape_category && selectedShapes.includes(product.shape_category.toLowerCase()));
      const styleMatch = selectedStyles.length === 0 || 
        (Array.isArray(product.type_category) && selectedStyles.some(style => 
          product.type_category.map(t => t.toLowerCase()).includes(style.toLowerCase())
        ));
      const priceMatch = (product.discounted_price || product.original_price) >= priceRange.min && 
                        (product.discounted_price || product.original_price) <= priceRange.max;
      // Search filter
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.gender_category && product.gender_category.join(" ").toLowerCase().includes(query)) ||
        (product.type_category && product.type_category.join(" ").toLowerCase().includes(query)) ||
        (product.shape_category && product.shape_category.toLowerCase().includes(query)) ||
        (product.original_price && product.original_price.toString().includes(query)) ||
        (product.discounted_price && product.discounted_price.toString().includes(query));
      return shapeMatch && styleMatch && priceMatch && (!searchQuery || matchesQuery);
    })
  );

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
      <div className=" px-4 py-8">
        {/* Breadcrumb and Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
          {/* Search Bar replaces breadcrumb */}
          <div className="w-full md:w-1/2 mb-2 md:mb-0 relative">
            <input
              type="text"
              placeholder="Search by name, price, category, gender, etc."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
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
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
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
            maxPrice={maxPrice}
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
            maxPrice={maxPrice}
          />
          {/* Product Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="relative bg-white rounded-2xl shadow-lg max-h-[500px] group overflow-hidden flex flex-col cursor-pointer"
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
                      <span className="absolute top-3 left-3 z-10 bg-primary text-white text-xs font-semibold px-3 py-1 md:px-4 md:py-2 rounded-full">Sale</span>
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
                    <div className="p-4 flex flex-col flex-1 border-black">
                      <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">{product.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        {product.discounted_price && (
                          <span className="text-gray-400 line-through text-sm">₹{product.original_price}</span>
                        )}
                        <span className="text-text font-bold text-lg">₹{product.discounted_price || product.original_price}</span>
                      </div>
                      <button className="mt-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-full py-2 px-4 md:py-4 md:px-6 font-semibold shadow transition-all text-sm md:text-base" onClick={() => handleProductClick(product)}>
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

const ProductsPage = () => {
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
};

export default ProductsPage;