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
  X,
  Ruler,
  Divide,
  MoveHorizontal,
  Monitor,
  Glasses
} from "lucide-react";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import { supabase } from "../../../../lib/supabaseClient";
import { getProducts } from "../../../../src/services/homeService";
import { useFavorites } from "../../../contexts/FavoritesContext";
import { getLensesByCategory } from "../../../../src/services/homeService";
import { useCart } from '../../../contexts/CartContext';
import AddPowerModal from './AddPowerModal';
import EnterPowerManuallyModal from './EnterPowerManuallyModal';
import UploadPrescriptionModal from './UploadPrescriptionModal';
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
  lens_width?: number;
  bridge_width?: number;
  temple_length?: number;
  is_lens_used?: boolean; // Added for new logic
  lens_category_id?: number; // Should be number for compatibility
}

// Define Lens type for modal
interface Lens {
  id: string;
  image_url: string;
  title: string;
  description: string;
  features: string[];
  original_price: number;
  category: string;
  lens_category_id: number;
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
  const { addToCart, isInCart, removeByDetails } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  // const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [hoveredRecommendation, setHoveredRecommendation] = useState<number | null>(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  // Preview modal state
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const imageContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLensModal, setShowLensModal] = useState(false);
  const [lenses, setLenses] = useState<Lens[]>([]);
  const [lensesLoading, setLensesLoading] = useState(false);
  const [lensesError, setLensesError] = useState<string | null>(null);
  const [showPowerModal, setShowPowerModal] = useState(false);
  const [selectedLensId, setSelectedLensId] = useState<string | null>(null);
  const lensTypes = [
    {
      key: "single-vision",
      icon: <Glasses className="w-8 h-8 text-gray-700" />,
      title: "Single Vision",
      description: "For distance or near vision (Thin, anti-glare, blue-cut options)",
    },
    {
      key: "bifocal-progressive",
      icon: <Glasses className="w-8 h-8 text-gray-700" />,
      title: "Progressive + Bifocal",
      description: "Bifocal and Progressives (For two powers in same lenses)",
    },
    {
      key: "zero-power",
      icon: <Monitor className="w-8 h-8 text-gray-700" />,
      title: "Zero Power",
      description: "Block 98% of harmful rays (Anti-glare and blue-cut options)",
    },
    {
      key: "frame-only",
      icon: <Glasses className="w-8 h-8 text-gray-700" />,
      title: "Frame Only",
      description: "Buy Only Frame",
    },
  ];
  const [showPowerLensModal, setShowPowerLensModal] = useState(false);
  const [powerLensList, setPowerLensList] = useState<Lens[]>([]);
  const [powerLensLoading, setPowerLensLoading] = useState(false);
  const [powerLensError, setPowerLensError] = useState<string | null>(null);
  const [selectedPowerLensId, setSelectedPowerLensId] = useState<string | null>(null);
  const [selectedLensType, setSelectedLensType] = useState<string | null>(null);
  const [showAddPowerModal, setShowAddPowerModal] = useState(false);
  const [showEnterPowerManuallyModal, setShowEnterPowerManuallyModal] = useState(false);
  const [showUploadPrescriptionModal, setShowUploadPrescriptionModal] = useState(false);
  const [selectedLensForPower, setSelectedLensForPower] = useState<Lens | null>(null);
  const [savedPowers] = useState([
    { id: '1', label: 'Saved Power', details: 'Last used / added powers' },
  ]);
  const [isPowerFlow, setIsPowerFlow] = useState(false);

  // Handler to open AddPowerModal after lens selection for single vision/progressive
  const handleLensSelectForPower = (lens: Lens) => {
    setSelectedLensForPower(lens);
    setShowAddPowerModal(true);
  };

  const handleSubmitPowerLater = () => {
    if (product && selectedLensForPower) {
      addToCart({ product, lens: selectedLensForPower, powerCategory: 'submit-later' });
    }
    setShowAddPowerModal(false);
    setSelectedLensForPower(null);
  };

  const handleEnterPowerManually = () => {
    setShowAddPowerModal(false);
    setShowEnterPowerManuallyModal(true);
  };

  const handleUploadPrescription = () => {
    setShowAddPowerModal(false);
    setShowUploadPrescriptionModal(true);
  };

  const handleSelectSavedPower = () => {
    if (product && selectedLensForPower) {
      addToCart({ product, lens: selectedLensForPower, powerCategory: 'saved' });
    }
    setShowAddPowerModal(false);
    setSelectedLensForPower(null);
  };

  const handleManualPowerSubmit = () => {
    if (product && selectedLensForPower) {
      addToCart({ product, lens: selectedLensForPower, powerCategory: 'manual' });
    }
    setShowEnterPowerManuallyModal(false);
    setSelectedLensForPower(null);
  };

  const handlePrescriptionSubmit = () => {
    if (product && selectedLensForPower) {
      addToCart({ product, lens: selectedLensForPower, powerCategory: 'prescription' });
    }
    setShowUploadPrescriptionModal(false);
    setSelectedLensForPower(null);
  };


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

  const handleAddLensClick = async () => {
    setIsPowerFlow(false);
    if (!product?.lens_category_id && product?.lens_category_id !== 0) {
      
    };
    setShowLensModal(true);
    setLensesLoading(true);
    setLensesError(null);
    try {
      const data = await getLensesByCategory(product.lens_category_id!);
      setLenses(data);
    } catch {
      setLensesError('Failed to load lenses');
    } finally {
      setLensesLoading(false);
    }
  };

  const handleAddPowerClick = () => {
    setIsPowerFlow(true);
    setShowPowerModal(true);
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
      setSwipeDirection("right");
      setIsAnimating(true);
      setTimeout(() => {
        setPreviewIndex((prev) => prev - 1);
        setIsAnimating(false);
        setSwipeDirection(null);
      }, 300);
    } else if (diff < -50 && previewIndex < productImages.length - 1) {
      setSwipeDirection("left");
      setIsAnimating(true);
      setTimeout(() => {
        setPreviewIndex((prev) => prev + 1);
        setIsAnimating(false);
        setSwipeDirection(null);
      }, 300);
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
  const BRAND_COLOR = "#2D6CDF";

  // Handler for selecting a lens type in Power modal
  const handlePowerLensTypeSelect = async (typeKey: string) => {
    setSelectedLensType(typeKey);

    if (typeKey === "frame-only") {
      // Add to cart directly for frame only
      if (product) {
        addToCart({ product, powerCategory: "frame only" });
        setShowPowerModal(false);
        alert("Added to cart!");
      }
      return;
    }

    setShowPowerLensModal(true);
    setPowerLensLoading(true);
    setPowerLensError(null);
    setSelectedPowerLensId(null);
    try {
      if (!product?.lens_category_id) throw new Error('No lens category id');
      const allLenses = await getLensesByCategory(product.lens_category_id);
      // Map UI typeKey to DB category
      let dbCategory = typeKey;
      if (typeKey === 'bifocal-progressive') dbCategory = 'progressive';
      if (typeKey === 'single-vision') dbCategory = 'single vision';
      if (typeKey === 'zero-power') dbCategory = 'zero power';
      if (typeKey === 'frame-only') dbCategory = 'frame only';
      const filtered = allLenses.filter(lens => lens.category === dbCategory);
      setPowerLensList(filtered);
    } catch {
      setPowerLensError('Failed to load lenses');
      setPowerLensList([]);
    } finally {
      setPowerLensLoading(false);
    }
  };

  // Add to Cart (frame only)
  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ product, powerCategory: 'frame only' });
    alert('Added to cart!');
  };
  const handleRemoveFromCart = () => {
    if (!product) return;
    removeByDetails({ product, powerCategory: 'frame only' });
    alert('Removed from cart!');
  };
  // Add to Cart with lens
  const handleAddLensToCart = (lens: Lens) => {
    if (!product) return;
    addToCart({ product, lens });
    alert('Added to cart with lens!');
  };
  const handleRemoveLensFromCart = (lens: Lens) => {
    if (!product) return;
    removeByDetails({ product, lens });
    alert('Removed from cart!');
  };
  // Add to Cart with power (category and lens)
  const handleAddPowerToCart = (powerCategory: string, lens: Lens) => {
    if (!product) return;
    addToCart({ product, lens, powerCategory });
    alert('Added to cart with power and lens!');
  };


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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
          {/* Product Images */}
          <div className="space-y-4 relative">
            {/* Main Image with Magnifier */}
            <div
              ref={imageContainerRef}
              className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              {productImages.length > 0 ? (
                <>
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
                  <button
                    onClick={() => { /* TODO: add share logic */ }}
                    className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
                    aria-label="Share"
                  >
                    <Share2 className="w-6 h-6 text-gray-600" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Eye className="w-16 h-16" />
                </div>
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
            {/* Magnifier Square (desktop only) */}
            {showMagnifier && productImages.length > 0 && (
              <div
                className="hidden md:block"
                style={{
                  position: "absolute",
                  top: 0,
                  left: "calc(100% + 32px)", // 32px gap to the right
                  width: 550,
                  height: 550,
                  border: "2px solid #ccc",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  background: `url(${productImages[selectedImage]}) no-repeat`,
                  backgroundSize: "1200px 1200px", // 2x zoom for 600x600 image
                  backgroundPosition: `-${magnifierPosition.x * 2 - 125}px -${magnifierPosition.y * 2 - 125}px`,
                  zIndex: 20,
                  backgroundColor: "#fff",
                }}
              />
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

            {/* Frame Measurements or Sizes */}
            {(product.lens_width || product.bridge_width || product.temple_length) ? (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Frame Measurements</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {/* Lens Width */}
                  {product.lens_width && (
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 min-w-[140px] shadow-sm">
                      <Ruler className="w-10 h-10 mb-2 text-blue-500" />
                      <span className="text-xs text-gray-500">LENS WIDTH</span>
                      <span className="text-xl font-bold mt-1">{product.lens_width}mm</span>
                    </div>
                  )}
                  {/* Bridge Width */}
                  {product.bridge_width && (
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 min-w-[140px] shadow-sm">
                      <Divide className="w-10 h-10 mb-2 text-green-500" />
                      <span className="text-xs text-gray-500">BRIDGE WIDTH</span>
                      <span className="text-xl font-bold mt-1">{product.bridge_width}mm</span>
                    </div>
                  )}
                  {/* Temple Length */}
                  {product.temple_length && (
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 min-w-[140px] shadow-sm">
                      <MoveHorizontal className="w-10 h-10 mb-2 text-purple-500" />
                      <span className="text-xs text-gray-500">TEMPLE LENGTH</span>
                      <span className="text-xl font-bold mt-1">{product.temple_length}mm</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (product.sizes && product.sizes.length > 0) ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sizes</h3>
                <div className="flex gap-3">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-lg border-2 transition-all {'border-blue-600 bg-blue-50 text-blue-600'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Sizes */}
            {/* {product.sizes && product.sizes.length > 0 && (
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
            )} */}

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
              {/* Sunglasses & Powered Sunglasses logic */}
              {product.type_category &&
                (product.type_category.includes("sunglasses") || product.type_category.includes("powered sunglasses")) ? (
                  product.is_lens_used ? (
                    <>
                      {product && isInCart({ product, powerCategory: 'frame only' }) ? (
                        <button className="flex-1 bg-red-500 text-white py-4 rounded-xl font-semibold hover:bg-red-600 cursor-pointer transition-colors flex items-center justify-center gap-2" onClick={handleRemoveFromCart}>
                          Remove from Cart
                        </button>
                      ) : (
                        <button
                          className="flex-1 bg-primary/80 text-white py-4 rounded-xl font-semibold hover:bg-primary cursor-pointer transition-colors flex items-center justify-center gap-2"
                          onClick={handleAddToCart}
                        >
                          <ShoppingBag className="w-5 h-5" />
                          Add to Cart
                        </button>
                      )}
                      <button
                        className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 cursor-pointer transition-colors flex items-center justify-center gap-2"
                        onClick={handleAddLensClick}
                      >
                        <Ruler className="w-5 h-5" />
                        Add Lens
                      </button>
                    </>
                  ) : (
                    <button
                      className="flex-1 bg-primary/80 text-white py-4 rounded-xl font-semibold hover:bg-primary cursor-pointer transition-colors flex items-center justify-center gap-2"
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </button>
                  )
                ) :
                // Eyeglasses & Computer Glasses logic
                product.type_category &&
                (product.type_category.includes("eyeglasses") || product.type_category.includes("computer glasses") || product.type_category.includes("computerglasses")) ? (
                  <button
                    className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 cursor-pointer transition-colors flex items-center justify-center gap-2"
                    onClick={handleAddPowerClick}
                  >
                    <Ruler className="w-5 h-5" />
                    Add Power
                  </button>
                ) : (
                  // Default fallback (show Add to Cart)
                  <button
                    className="flex-1 bg-primary/80 text-white py-4 rounded-xl font-semibold hover:bg-primary cursor-pointer transition-colors flex items-center justify-center gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </button>
                )
              }
              {/* Favorite Button (unchanged) */}
              <button 
                onClick={handleFavoriteClick}
                className={`w-14 h-14 border border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
                  isFavorite(product.id!) ? 'bg-red-50 border-red-300' : ''
                }`}
              >
                <Heart 
                  className={`w-6 h-6 transition-colors ${
                    isFavorite(product.id!) ? 'text-red-500 fill-current' : 'text-gray-600'
                  }`} 
                />
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-text bg-clip-text text-transparent">
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
                          <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
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
                          <span className="text-md md:text-xl font-bold text-text">
                            ₹{item.discounted_price || item.original_price}
                          </span>
                          <button className="bg-primary text-white px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-sm rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
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
              setSwipeDirection("right");
              setIsAnimating(true);
              setTimeout(() => {
                handlePreviewLeft();
                setIsAnimating(false);
                setSwipeDirection(null);
              }, 300);
            } else if (e.key === 'ArrowRight' && previewIndex < productImages.length - 1) {
              setSwipeDirection("left");
              setIsAnimating(true);
              setTimeout(() => {
                handlePreviewRight();
                setIsAnimating(false);
                setSwipeDirection(null);
              }, 300);
            } else if (e.key === 'Escape') {
              setShowPreview(false);
            }
          }}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-white text-3xl z-20"
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
          <div
            className={`relative w-screen h-screen flex items-center justify-center transition-transform duration-300 z-0 ${
              isAnimating
                ? swipeDirection === "left"
                  ? "-translate-x-full"
                  : swipeDirection === "right"
                  ? "translate-x-full"
                  : "translate-x-0"
                : "translate-x-0"
            }`}
            style={{ willChange: 'transform' }}
          >
            <Image
              fill
              src={productImages[previewIndex]}
              alt={product.title}
              className="object-contain"
              draggable={false}
            />
          </div>
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

      {/* Lens Modal/Drawer */}
      {showLensModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end bg-black/40"
          onClick={() => setShowLensModal(false)}
        >
          <div
            className="w-full md:w-[50vw] bg-gradient-to-br from-[#f5faff] via-[#faf8f6] to-[#f0f4fa] rounded-t-2xl md:rounded-l-2xl shadow-2xl p-0 overflow-y-auto animate-slideInUp md:animate-slideInRight relative flex flex-col h-[100vh]"
            style={{ position: 'relative', bottom: 0, right: 0 }}
            onClick={event => event.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-2 border-b border-gray-100 bg-gradient-to-b from-white/90 to-[#faf8f6] backdrop-blur">
              <button className="p-2 mr-2" onClick={() => setShowLensModal(false)}>
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="flex-1 text-center text-lg md:text-2xl font-bold text-gray-900 tracking-tight">Choose Lens Package</h2>
              <button className="p-2 ml-2" onClick={() => setShowLensModal(false)}>
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-2 md:px-6 py-2 md:py-6">
              {lensesLoading ? (
                <div className="flex justify-center items-center py-8">Loading lenses...</div>
              ) : lensesError ? (
                <div className="text-red-500 py-8">{lensesError}</div>
              ) : lenses.length === 0 ? (
                <div className="text-gray-500 py-8">No lenses found for this category.</div>
              ) : (
                <div className="flex flex-col gap-3 md:gap-6">
                  {lenses.map((lens) => (
                    <div
                      key={lens.id}
                      className={`group flex items-center bg-white rounded-2xl shadow-lg px-3 py-3 md:px-6 md:py-5 cursor-pointer border-2 transition-all duration-200 relative overflow-hidden
                        ${selectedLensId === lens.id
                          ? 'border-[2.5px] border-primary bg-gradient-to-br from-primary/60 to-yellow-50/40 scale-[1.02]'
                          : 'border-gray-100 hover:border-primary hover:shadow-xl hover:scale-[1.01]'}
                      `}
                      style={{ boxShadow: selectedLensId === lens.id ? `0 0 0 2px ${BRAND_COLOR}33` : undefined }}
                      onClick={() =>
                        (lens.category === 'single vision' || lens.category === 'progressive' || lens.category === 'bifocal')
                          ? handleLensSelectForPower(lens)
                          : setSelectedLensId(lens.id)
                      }
                    >
                      <div className="w-16 h-16 md:w-60 md:h-40 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mr-2 md:mr-6 border border-gray-200">
                        {lens.image_url ? (
                          <Image src={lens.image_url} alt={lens.title} width={96} height={96} className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-2xl md:text-4xl">👓</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base md:text-2xl text-gray-900 mb-1 truncate">{lens.title}</div>
                        <ul className="text-gray-700 text-xs md:text-[16px] mb-1 md:mb-2 list-disc list-inside space-y-0.5">
                          {Array.isArray(lens.features) && lens.features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                        <div className="text-gray-500 text-xs md:text-[18px] mb-1">Applicable Only for Single Vision Power</div>
                        <div className="text-gray-500 text-xs md:text-[18px] mb-1">UV-400 Protection</div>
                        <div className="font-semibold text-base md:text-xl text-primary mt-1 md:mt-2">
                          Frame + Lens: <span className="text-gray-900">₹{lens.original_price}</span>
                        </div>
                      </div>
                      {/* Selection checkmark */}
                      {selectedLensId === lens.id && (
                        <span className="ml-2 text-primary text-xl md:text-2xl font-bold absolute top-3 right-3 md:static">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="sticky bottom-0 z-10 px-3 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-gradient-to-t from-white/90 to-[#faf8f6] flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm md:text-base">Subtotal (Frame):</span>
                <span className="text-xl md:text-2xl font-bold text-gray-900">₹{product?.discounted_price || product?.original_price}</span>
              </div>
              {selectedLensId && isInCart({ product, lens: lenses.find(l => l.id === selectedLensId) }) ? (
                <button className="w-full py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all duration-200 text-base md:text-lg" onClick={() => handleRemoveLensFromCart(lenses.find(l => l.id === selectedLensId))}>
                  Remove from Cart
                </button>
              ) : (
                <button className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 shadow-md transition-all duration-200 text-base md:text-lg" onClick={() => selectedLensId && handleAddLensToCart(lenses.find(l => l.id === selectedLensId))}>
                  Add to Cart
                </button>
              )}
              <div className="text-gray-400 text-xs md:text-sm text-center mt-1">Need help? <span className="underline cursor-pointer">Contact Support</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Power Modal/Drawer */}
      {showPowerModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end bg-black/40"
          onClick={() => setShowPowerModal(false)}
        >
          <div
            className="w-full md:w-[50vw] bg-gradient-to-br from-[#f5faff] via-[#faf8f6] to-[#f0f4fa] rounded-t-2xl md:rounded-l-2xl shadow-2xl p-0 overflow-y-auto animate-slideInUp md:animate-slideInRight relative flex flex-col h-[100vh]"
            style={{ position: 'relative', bottom: 0, right: 0 }}
            onClick={event => event.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-2 border-b border-gray-100 bg-gradient-to-b from-white/90 to-[#faf8f6] backdrop-blur">
              <button className="p-2 mr-2" onClick={() => setShowPowerModal(false)}>
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="flex-1 text-center text-lg md:text-2xl font-bold text-gray-900 tracking-tight">Select Lens Type</h2>
              <button className="p-2 ml-2" onClick={() => setShowPowerModal(false)}>
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-2 md:px-6 py-2 md:py-6">
              <div className="flex flex-col gap-3 md:gap-6">
                {lensTypes.map((type) => (
                  <div
                    key={type.key}
                    className={`group flex items-center bg-white rounded-2xl shadow-lg px-3 py-3 md:px-6 md:py-5 cursor-pointer border-2 transition-all duration-200 relative overflow-hidden
                      ${selectedLensType === type.key
                        ? 'border-[2.5px] border-primary bg-gradient-to-br from-primary/60 to-yellow-50/40 scale-[1.02]'
                        : 'border-gray-100 hover:border-primary hover:shadow-xl hover:scale-[1.01]'}
                    `}
                    style={{ boxShadow: selectedLensType === type.key ? `0 0 0 2px ${BRAND_COLOR}33` : undefined }}
                    onClick={() => handlePowerLensTypeSelect(type.key)}
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mr-2 md:mr-6 border border-gray-200">
                      {type.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base md:text-xl text-gray-900 mb-1 truncate">{type.title}</div>
                      <div className="text-gray-700 text-xs md:text-base mb-1">{type.description}</div>
                    </div>
                    {/* Selection checkmark */}
                    {selectedLensType === type.key && (
                      <span className="ml-2 text-primary text-xl md:text-2xl font-bold absolute top-3 right-3 md:static">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Footer */}
            <div className="sticky bottom-0 z-10 px-3 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-gradient-to-t from-white/90 to-[#faf8f6] flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm md:text-base">Subtotal (Frame):</span>
                <span className="text-xl md:text-2xl font-bold text-gray-900">₹{product?.discounted_price || product?.original_price}</span>
              </div>
              <button
                className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all duration-200 text-base md:text-lg ${selectedLensType ? 'bg-primary hover:bg-primary/80' : 'bg-gray-300 cursor-not-allowed'}`}
                disabled={!selectedLensType}
                onClick={() => selectedLensType && handlePowerLensTypeSelect(selectedLensType)}
              >
                {isInCart({ product, powerCategory: selectedLensType }) ? (
                  <span>Remove from Cart</span>
                ) : (
                  <span>Continue</span>
                )}
              </button>
              <div className="text-gray-400 text-xs md:text-sm text-center mt-1">Need help? <span className="underline cursor-pointer">Contact Support</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Power Lens Modal (above Power Modal) */}
      {showPowerLensModal && (
        <div
          className="fixed inset-0 z-60 flex items-end md:items-stretch md:justify-end bg-black/60"
          onClick={() => setShowPowerLensModal(false)}
        >
          <div
            className="w-full md:w-[50vw] bg-gradient-to-br from-[#f5faff] via-[#faf8f6] to-[#f0f4fa] rounded-t-2xl md:rounded-l-2xl shadow-2xl p-0 overflow-y-auto animate-slideInUp md:animate-slideInRight relative flex flex-col h-[100vh]"
            style={{ position: 'relative', bottom: 0, right: 0 }}
            onClick={event => event.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-2 border-b border-gray-100 bg-gradient-to-b from-white/90 to-[#faf8f6] backdrop-blur">
              <button className="p-2 mr-2" onClick={() => setShowPowerLensModal(false)}>
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="flex-1 text-center text-lg md:text-2xl font-bold text-gray-900 tracking-tight">Select Lens</h2>
              <button className="p-2 ml-2" onClick={() => setShowPowerLensModal(false)}>
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-2 md:px-6 py-2 md:py-6">
              {powerLensLoading ? (
                <div className="flex justify-center items-center py-8">Loading lenses...</div>
              ) : powerLensError ? (
                <div className="text-red-500 py-8">{powerLensError}</div>
              ) : powerLensList.length === 0 ? (
                <div className="text-gray-500 py-8">No lenses found for this type.</div>
              ) : (
                <div className="flex flex-col gap-3 md:gap-6">
                  {powerLensList.map((lens) => (
                    <div
                      key={lens.id}
                      className={`group flex items-center bg-white rounded-2xl shadow-lg px-3 py-3 md:px-6 md:py-5 cursor-pointer border-2 transition-all duration-200 relative overflow-hidden
                        ${selectedPowerLensId === lens.id
                          ? 'border-[2.5px] border-primary bg-gradient-to-br from-primary/60 to-yellow-50/40 scale-[1.02]'
                          : 'border-gray-100 hover:border-primary hover:shadow-xl hover:scale-[1.01]'}
                      `}
                      style={{ boxShadow: selectedPowerLensId === lens.id ? `0 0 0 2px ${BRAND_COLOR}33` : undefined }}
                      onClick={() => setSelectedPowerLensId(lens.id)}
                    >
                      <div className="w-16 h-16 md:w-60 md:h-40 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mr-2 md:mr-6 border border-gray-200">
                        {lens.image_url ? (
                          <Image src={lens.image_url} alt={lens.title} width={96} height={96} className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-2xl md:text-4xl">👓</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base md:text-2xl text-gray-900 mb-1 truncate">{lens.title}</div>
                        <ul className="text-gray-700 text-xs md:text-[16px] mb-1 md:mb-2 list-disc list-inside space-y-0.5">
                          {Array.isArray(lens.features) && lens.features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                        <div className="text-gray-500 text-xs md:text-[18px] mb-1">Applicable Only for Single Vision Power</div>
                        <div className="text-gray-500 text-xs md:text-[18px] mb-1">UV-400 Protection</div>
                        <div className="font-semibold text-base md:text-xl text-primary mt-1 md:mt-2">
                          Frame + Lens: <span className="text-gray-900">₹{lens.original_price}</span>
                        </div>
                      </div>
                      {/* Selection checkmark */}
                      {selectedPowerLensId === lens.id && (
                        <span className="ml-2 text-primary text-xl md:text-2xl font-bold absolute top-3 right-3 md:static">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="sticky bottom-0 z-10 px-3 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-gradient-to-t from-white/90 to-[#faf8f6] flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm md:text-base">Subtotal (Frame):</span>
                <span className="text-xl md:text-2xl font-bold text-gray-900">₹{product?.discounted_price || product?.original_price}</span>
              </div>
              {selectedPowerLensId && selectedLensType && (
                isPowerFlow ? (
                  <button
                    className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 shadow-md transition-all duration-200 text-base md:text-lg"
                    onClick={() => {
                      setShowPowerLensModal(false);
                      setShowAddPowerModal(true);
                      setSelectedLensForPower(powerLensList.find(l => l.id === selectedPowerLensId));
                    }}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 shadow-md transition-all duration-200 text-base md:text-lg"
                    onClick={() => selectedPowerLensId && selectedLensType && handleAddPowerToCart(selectedLensType, powerLensList.find(l => l.id === selectedPowerLensId))}
                  >
                    Add to Cart
                  </button>
                )
              )}
              <div className="text-gray-400 text-xs md:text-sm text-center mt-1">Need help? <span className="underline cursor-pointer">Contact Support</span></div>
            </div>
          </div>
        </div>
      )}
      <AddPowerModal
        open={showAddPowerModal}
        onClose={() => { setShowAddPowerModal(false); setSelectedLensForPower(null); setIsPowerFlow(false); }}
        onSubmitPowerLater={handleSubmitPowerLater}
        onEnterPowerManually={handleEnterPowerManually}
        onUploadPrescription={handleUploadPrescription}
        onSelectSavedPower={handleSelectSavedPower}
        savedPowers={savedPowers}
      />
      <EnterPowerManuallyModal
        open={showEnterPowerManuallyModal}
        onClose={() => { setShowEnterPowerManuallyModal(false); setSelectedLensForPower(null); }}
        onSubmit={handleManualPowerSubmit}
        lensCategory={selectedLensType === 'bifocal-progressive' || selectedLensType === 'progressive' ? selectedLensType : undefined}
      />
      <UploadPrescriptionModal
        open={showUploadPrescriptionModal}
        onClose={() => { setShowUploadPrescriptionModal(false); setSelectedLensForPower(null); }}
        onSubmit={handlePrescriptionSubmit}
      />
    </div>
  );
};

export default ProductDetailPage; 