"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ChevronRight,
  Shield,
  Truck,
  RefreshCw,
  Award,
  Eye,
  Share2,
  ArrowRight,
  ArrowLeft,
  X
} from "lucide-react";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import { supabase } from "../../../../lib/supabaseClient";
import { getProducts } from "../../../../src/services/homeService";
import { useFavorites } from "../../../contexts/FavoritesContext";
// import { useHasMounted } from "../../../hooks/useHasMounted";

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
  // Accept both old and new color formats
  colors: ({ color: string; images: string[] } | { colors: string[]; images: string[] })[];
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

// Helper to normalize color data
function normalizeColors(colors: Product["colors"]): { colors: string[]; images: string[] }[] {
  return colors.map((c) => {
    if ("colors" in c) return c as { colors: string[]; images: string[] };
    // old format: { color: string; images: string[] }
    return { colors: [c.color], images: c.images };
  });
}

const ProductDetailPage = () => {
//   const hasMounted = useHasMounted();
  const params = useParams();
  const router = useRouter();
  const { addToFavorites, removeFromFavorites, isFavorite, isLoggedIn } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [hoveredRecommendation, setHoveredRecommendation] = useState<number | null>(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  // Preview modal state
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

//   if (!hasMounted) return null;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          setError('Product not found');
          return;
        }

        setProduct(data as Product);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  // Fetch recommendations when product is loaded
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!product?.shape_category) return;

      try {
        const allProducts = await getProducts();
        const sameShapeProducts = allProducts.filter(
          p => p.id !== product.id && 
               p.shape_category && 
               p.shape_category.toLowerCase() === product.shape_category?.toLowerCase()
        );
        
        // Sort by display_order and limit to 8 products
        const sortedRecommendations = sameShapeProducts
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .slice(0, 8);
        
        setRecommendations(sortedRecommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [product]);

  const handleImageChange = (index: number) => {
    setSelectedImage(index);
  };

  const getProductImages = () => {
    if (!product) return [];
    const images = [];
    if (product.banner_image_1) images.push(product.banner_image_1);
    if (product.banner_image_2) images.push(product.banner_image_2);
    if (product.colors && product.colors[selectedColor]) {
      images.push(...product.colors[selectedColor].images);
    }
    return images;
  };

  const getCurrentPrice = () => {
    if (!product) return 0;
    return product.discounted_price || product.original_price;
  };

  const getDiscountPercentage = () => {
    if (!product || !product.discounted_price) return 0;
    return Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100);
  };

  const handleRecommendationClick = (recommendation: Product) => {
    router.push(`/product/${recommendation.id}`);
  };

  const handleFavoriteClick = async () => {
    if (!product) return;
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    try {
      if (isFavorite(product.id!)) {
        await removeFromFavorites(product.id!);
      } else {
        await addToFavorites({
          ...product,
          colors: normalizeColors(product.colors).map(c => ({
            color: c.colors[0],
            images: c.images,
          })),
        });
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  const handleRecommendationFavoriteClick = async (e: React.MouseEvent, recommendation: Product) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    try {
      if (isFavorite(recommendation.id!)) {
        await removeFromFavorites(recommendation.id!);
      } else {
        await addToFavorites({
          ...recommendation,
          colors: normalizeColors(recommendation.colors).map(c => ({
            color: c.colors[0],
            images: c.images,
          })),
        });
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  // Magnifier event handlers
  const handleMouseEnter = () => setShowMagnifier(true);
  const handleMouseLeave = () => setShowMagnifier(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setMagnifierPosition({ x, y });
  };

  // Preview modal handlers
  const handleImageClick = () => {
    setShowPreview(true);
    setPreviewIndex(selectedImage);
  };
  const handlePreviewLeft = () => {
    setPreviewIndex((i) => Math.max(0, i - 1));
  };
  const handlePreviewRight = () => {
    setPreviewIndex((i) => Math.min(productImages.length - 1, i + 1));
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (diff > 50 && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1); // swipe right
    } else if (diff < -50 && previewIndex < productImages.length - 1) {
      setPreviewIndex(previewIndex + 1); // swipe left
    }
    setTouchStartX(null);
  };

  // Focus modal for keyboard navigation
  useEffect(() => {
    if (showPreview) {
      const modal = document.querySelector('.z-50[tabindex="0"]');
      if (modal) (modal as HTMLElement).focus();
      setShowSwipeHint(true);
      const timer = setTimeout(() => setShowSwipeHint(false), 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [showPreview]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Eye className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = getProductImages();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <button onClick={() => router.push('/')} className="hover:text-blue-600">Home</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => router.push('/products')} className="hover:text-blue-600">Products</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image with Magnifier */}
            <div
              className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              {productImages.length > 0 ? (
                <Image
                  src={productImages[selectedImage]}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                  onClick={handleImageClick}
                  style={{ cursor: "zoom-in" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Eye className="w-16 h-16" />
                </div>
              )}
              {/* Magnifier */}
              {showMagnifier && productImages.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    pointerEvents: "none",
                    width: 200,
                    height: 200,
                    top: magnifierPosition.y - 100,
                    left: magnifierPosition.x - 100,
                    borderRadius: "50%",
                    border: "2px solid #ccc",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    background: `url(${productImages[selectedImage]}) no-repeat`,
                    backgroundSize: "1200px 1200px", // 2x zoom for 600x600 image
                    backgroundPosition: `-${magnifierPosition.x * 2 - 100}px -${magnifierPosition.y * 2 - 100}px`,
                    zIndex: 10,
                  }}
                />
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Badges */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                {product.bestseller && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Best Seller
                  </span>
                )}
                {product.latest_trend && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Latest Trend
                  </span>
                )}
                {product.discounted_price && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {getDiscountPercentage()}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-gray-600">(4.5)</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">128 reviews</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">₹{getCurrentPrice()}</span>
                {product.discounted_price && (
                  <span className="text-xl text-gray-400 line-through">₹{product.original_price}</span>
                )}
              </div>
              {product.discounted_price && (
                <p className="text-green-600 font-semibold">Save ₹{product.original_price - product.discounted_price}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Colors</h3>
                <div className="flex gap-3">
                  {normalizeColors(product.colors).map((colorObj, index) => {
                    const colorArr = colorObj.colors || [];
                    let background = "#eee";
                    if (colorArr.length === 1) {
                      background = colorArr[0];
                    } else if (colorArr.length === 2) {
                      background = `linear-gradient(90deg, ${colorArr[0]} 50%, ${colorArr[1]} 50%)`;
                    } else if (colorArr.length > 2) {
                      // conic-gradient for 3+ colors
                      const stops = colorArr
                        .map((col, i) => {
                          const start = (i * 100) / colorArr.length;
                          const end = ((i + 1) * 100) / colorArr.length;
                          return `${col} ${start}%, ${col} ${end}%`;
                        })
                        .join(", ");
                      background = `conic-gradient(${stops})`;
                    }
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(index)}
                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                          selectedColor === index ? 'border-blue-600 scale-110' : 'border-gray-300'
                        }`}
                        style={{ background: background }}
                        title={colorArr.join(", ")}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sizes</h3>
                <div className="flex gap-3">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(index)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === index
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button 
                onClick={handleFavoriteClick}
                className={`w-14 h-14 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors ${
                  isFavorite(product.id!) ? 'bg-red-50 border-red-300' : ''
                }`}
              >
                <Heart 
                  className={`w-6 h-6 transition-colors ${
                    isFavorite(product.id!) ? 'text-red-500 fill-current' : 'text-gray-600'
                  }`} 
                />
              </button>
              <button className="w-14 h-14 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.shape_category && (
                  <div>
                    <span className="text-gray-500">Shape:</span>
                    <span className="ml-2 text-gray-900 capitalize">{product.shape_category}</span>
                  </div>
                )}
                {product.frame_material && (
                  <div>
                    <span className="text-gray-500">Material:</span>
                    <span className="ml-2 text-gray-900">{product.frame_material}</span>
                  </div>
                )}
                {product.gender_category && product.gender_category.length > 0 && (
                  <div>
                    <span className="text-gray-500">Gender:</span>
                    <span className="ml-2 text-gray-900 capitalize">{product.gender_category.join(', ')}</span>
                  </div>
                )}
                {product.type_category && product.type_category.length > 0 && (
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2 text-gray-900 capitalize">{product.type_category.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-sm">2-Year Warranty</p>
                    <p className="text-xs text-gray-500">Premium protection</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-sm">Free Shipping</p>
                    <p className="text-xs text-gray-500">Orders over ₹500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-semibold text-sm">30-Day Returns</p>
                    <p className="text-xs text-gray-500">Hassle-free policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-sm">Premium Quality</p>
                    <p className="text-xs text-gray-500">Certified materials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              More {product.shape_category} Styles
            </h2>
            <div className="relative">
              <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex space-x-6 min-w-min">
                  {recommendations.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="group relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-none w-[280px] md:w-[320px] flex flex-col cursor-pointer"
                      onMouseEnter={() => setHoveredRecommendation(index)}
                      onMouseLeave={() => setHoveredRecommendation(null)}
                      onClick={() => handleRecommendationClick(item)}
                    >
                      {/* Sale Badge */}
                      {item.discounted_price && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Sale
                          </span>
                        </div>
                      )}
                      {/* Wishlist Icon */}
                      <button 
                        onClick={(e) => handleRecommendationFavoriteClick(e, item)}
                        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
                      >
                        <Heart 
                          className={`w-5 h-5 transition-colors ${
                            isFavorite(item.id!) ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-red-500'
                          }`} 
                        />
                      </button>
                      {/* Product Image */}
                      <div className="aspect-square overflow-hidden">
                        <Image
                          width={400}
                          height={300}
                          loading="lazy"
                          src={
                            hoveredRecommendation === index && item.banner_image_2
                              ? item.banner_image_2
                              : item.banner_image_1 || item.banner_image_2 || ''
                          }
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      {/* Product Info */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-md md:text-lg font-bold mb-2 text-gray-800 line-clamp-2 min-h-[3.5rem]">
                          {item.title}
                        </h3>
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">(4.5)</span>
                          </div>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-md md:text-xl font-bold text-blue-600">
                            ₹{item.discounted_price || item.original_price}
                          </span>
                          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-sm rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      {/* Fullscreen Preview Modal */}
      {showPreview && productImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' && previewIndex > 0) {
              handlePreviewLeft();
            } else if (e.key === 'ArrowRight' && previewIndex < productImages.length - 1) {
              handlePreviewRight();
            } else if (e.key === 'Escape') {
              setShowPreview(false);
            }
          }}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setShowPreview(false)}
            aria-label="Close"
          >
            <X className="w-10 h-10" />
          </button>
          {/* Left button */}
          {previewIndex > 0 && (
            <button
              className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl px-4 py-2 bg-black bg-opacity-30 rounded-full hover:bg-opacity-60 transition"
              onClick={handlePreviewLeft}
              aria-label="Previous"
            >
              <ArrowLeft className="w-8 h-8 md:w-10 md:h-10" />
            </button>
          )}
          {/* Image */}
          <Image
            width={1000}
            height={1000}
            src={productImages[previewIndex]}
            alt={product.title}
            className="max-h-[80vh] max-w-[90vw] object-contain shadow-2xl"
            draggable={false}
          />
          {/* Pagination Dots for Mobile */}
          <div className="flex justify-center mt-4 md:hidden absolute bottom-16 left-1/2 -translate-x-1/2">
            {productImages.map((_, idx) => (
              <span
                key={idx}
                className={`mx-1 h-2 w-2 rounded-full inline-block transition-all duration-200 ${
                  idx === previewIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          {/* Swipe Hint for Mobile */}
          {showSwipeHint && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm md:hidden">
              Swipe to see more
            </div>
          )}
          {/* Right button */}
          {previewIndex < productImages.length - 1 && (
            <button
              className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl px-4 py-2 bg-black bg-opacity-30 rounded-full hover:bg-opacity-60 transition"
              onClick={handlePreviewRight}
              aria-label="Next"
            >
              <ArrowRight className="w-8 h-8 md:w-10 md:h-10" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage; 