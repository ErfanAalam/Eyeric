"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Heart, Filter,  Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import FilterSidebar from "../../../../components/FilterSidebar";
import { useFavorites } from "../../../contexts/FavoritesContext";
import { supabase } from "../../../../lib/supabaseClient";

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
  images: { url: string; display_order: number }[];
  sizes: string[];
  frame_material?: string;
  features: string[];
  shape_category: string;
  tags: string[];
  gender_category: string[];
  type_category: string[];
  created_at?: string;
  updated_at?: string;
  product_serial_number?: string;
  frame_colour?: string;
  temple_colour?: string;
}

interface SpecialProductCategory {
  id: number;
  name: string;
  description?: string;
  display_order?: number;
  banner_image?: string;
}

export default function SpecialCategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryId = params.id as string;
  const categoryName = searchParams.get('name') || 'Special Category';
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<SpecialProductCategory | null>(null);
  const [loading, setLoading] = useState(true);
//   const [filterOpen, setFilterOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('display_order');
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const { addToFavorites, removeFromFavorites, isFavorite, isLoggedIn } = useFavorites();

  // Calculate maximum price from all products
  const maxProductPrice = products.length > 0 
    ? Math.max(...products.map(p => p.discounted_price || p.original_price))
    : 1000;
  const maxPrice = maxProductPrice + 500;

  // Update price range when maxPrice changes
  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('special_product_categories')
          .select('*')
          .eq('id', categoryId)
          .single();
        
        if (categoryError) {
          console.error('Error fetching category:', categoryError);
        } else {
          setCategory(categoryData);
        }
        
        // Fetch products in this special category
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            product_special_categories!inner(special_category_id)
          `)
          .eq('product_special_categories.special_category_id', categoryId)
          .eq('is_active', true);
        
        if (productsError) {
          console.error('Error fetching products:', productsError);
        } else {
          setProducts(productsData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId]);

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
      console.error("Error handling favorite:", error);
    }
  };

  const calculateDiscount = (original: number, discounted: number) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
  };

  const onApplyFilters = () => {
    // Handle filter application
    
  };

  const onClearFilters = () => {
    setSelectedGender('all');
    setSelectedType('all');
    setSelectedShape('all');
    setPriceRange([0, maxPrice]);
  };

  const filteredProducts = products.filter(product => {
    if (selectedGender !== 'all') {
      if (!product.gender_category || !product.gender_category.includes(selectedGender)) {
        return false;
      }
    }
    
    if (selectedType !== 'all') {
      if (!product.type_category || !product.type_category.includes(selectedType)) {
        return false;
      }
    }
    
    if (selectedShape !== 'all') {
      if (product.shape_category !== selectedShape) {
        return false;
      }
    }
    
    const price = product.discounted_price || product.original_price;
    if (price < priceRange[0] || price > priceRange[1]) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.gender_category && product.gender_category.join(" ").toLowerCase().includes(query)) ||
        (product.type_category && product.type_category.join(" ").toLowerCase().includes(query)) ||
        (product.shape_category && product.shape_category.toLowerCase().includes(query));
      
      if (!matchesQuery) return false;
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return (a.discounted_price || a.original_price) - (b.discounted_price || b.original_price);
      case 'price_high':
        return (b.discounted_price || b.original_price) - (a.discounted_price || a.original_price);
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      case 'oldest':
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      default:
        return (a.display_order || 0) - (b.display_order || 0);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Category Header */}
      <div className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-black/30" />
        {category?.banner_image && (
          <Image
            fill
            src={category.banner_image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover"
            quality={90}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="/placeholder.png"
          />
        )}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            {category?.name || categoryName}
          </h1>
          {category?.description && (
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
          <p className="text-sm md:text-base opacity-80 mt-4">
            {filteredProducts.length} products found
          </p>
        </div>
      </div>

      {/* Filters and Products Section */}
      <div className="px-3 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar and Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
            {/* Search Bar */}
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
                  <option value="display_order">Best selling</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <FilterSidebar
              currentGender={selectedGender}
              onGenderChange={handleGenderChange}
              selectedStyles={[]}
              selectedShapes={[]}
              currentPrice={{ min: priceRange[0], max: priceRange[1] }}
              onPriceChange={(price) => setPriceRange([price.min, price.max])}
              styleOptions={["Full Rim", "Half Rim", "Rimless"]}
              show={false}
              onClose={() => setShowFilters(false)}
              isMobile={false}
              onClearFilters={onClearFilters}
              onApplyFilters={onApplyFilters}
              maxPrice={maxPrice}
            />
            
            {/* Mobile Modal */}
            <FilterSidebar
              currentGender={selectedGender}
              onGenderChange={handleGenderChange}
              selectedStyles={[]}
              selectedShapes={[]}
              currentPrice={{ min: priceRange[0], max: priceRange[1] }}
              onPriceChange={(price) => setPriceRange([price.min, price.max])}
              styleOptions={["Full Rim", "Half Rim", "Rimless"]}
              show={showFilters}
              onClose={() => setShowFilters(false)}
              isMobile={true}
              onClearFilters={onClearFilters}
              onApplyFilters={onApplyFilters}
              maxPrice={maxPrice}
            />

            {/* Products Grid */}
            <main className="flex-1">
              {sortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                      <Filter className="w-10 h-10 text-indigo-500" />
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
                  {sortedProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="relative rounded-2xl shadow-lg max-h-[500px] group overflow-hidden flex flex-col cursor-pointer"
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
                        <span className="absolute top-3 left-3 z-10 bg-secondary text-white text-xs font-semibold px-3 py-1 md:px-4 md:py-2 rounded-full">
                          {calculateDiscount(product.original_price, product.discounted_price)}% OFF
                        </span>
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 