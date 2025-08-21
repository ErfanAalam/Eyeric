"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Heart,
  ShoppingBag,
  Eye,
  Share2,
  ArrowLeft,
  X,
  Ruler,
  Monitor,
  Glasses,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import { supabase } from "../../../../lib/supabaseClient";
import { getProducts } from "../../../../src/services/homeService";
import { useFavorites } from "../../../contexts/FavoritesContext";
import { getLensesByCategory } from "../../../../src/services/homeService";
import { useCart } from "../../../contexts/CartContext";
import AddPowerModal from "./AddPowerModal";
import EnterPowerManuallyModal from "./EnterPowerManuallyModal";
import UploadPrescriptionModal from "./UploadPrescriptionModal";
import { useAuth } from "../../../contexts/AuthContext";

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
  lens_width?: number;
  bridge_width?: number;
  temple_length?: number;
  is_lens_used?: boolean; // Added for new logic
  lens_category_id?: number; // Should be number for compatibility
  product_serial_number?: string;
  frame_colour?: string;
  temple_colour?: string;
  coupons?: Coupon[]; // Added for coupon functionality
}

// Define Coupon interface
interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_cart_value?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  description?: string;
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

// Define PowerDetails for prescription fields
export interface PowerDetails {
  samePower: boolean;
  cylindrical: boolean;
  leftSPH: string;
  rightSPH: string;
  leftCYL: string;
  rightCYL: string;
  leftAxis: string;
  rightAxis: string;
  leftAddlPower: string;
  rightAddlPower: string;
  lensCategory?: string;
}
// Define PowerEntry for full power object
export interface PowerEntry {
  id: string;
  name: string;
  phone: string;
  method: string;
  power_details: PowerDetails | null;
  prescription_image_url: string | null;
  created_at: string;
}

// Utility to add a power entry to user table
async function addPowerToUserTable(userId: string, newPower: PowerEntry) {
  const { data } = await supabase
    .from("user")
    .select("powers")
    .eq("id", userId)
    .single();
  let powers = [];
  if (data && data.powers) powers = data.powers;
  powers.push(newPower);
  await supabase.from("user").update({ powers }).eq("id", userId);
  return newPower.id;
}

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addToFavorites, removeFromFavorites, isFavorite, isLoggedIn } =
    useFavorites();
  const { addToCart, isInCart, removeByDetails, cartLoading } = useCart();
  const { userProfile } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0, relativeX: 0, relativeY: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [showMobileSwipeHint, setShowMobileSwipeHint] = useState(false);
  const imageContainerRef = React.useRef<HTMLDivElement>(null);
  const previewScrollContainerRef = React.useRef<HTMLDivElement>(null);
  const previewModalRef = React.useRef<HTMLDivElement>(null);
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
      description:
        "For distance or reading, Includes anti-glare, blue-light filter & thin lens options.",
    },
    {
      key: "bifocal-progressive",
      icon: <Glasses className="w-8 h-8 text-gray-700" />,
      title: "Progressive/Bifocal",
      description:
        "Two-in-one lenses for distance and reading - no need to switch glasses.",
    },
    {
      key: "zero-power",
      icon: <Monitor className="w-8 h-8 text-gray-700" />,
      title: "Zero Power",
      description:
        "Protect your eyes from screens - Anti-glare & blue light protection.",
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
  const [selectedPowerLensId, setSelectedPowerLensId] = useState<string | null>(
    null
  );
  const [selectedLensType, setSelectedLensType] = useState<string | null>(null);
  const [showAddPowerModal, setShowAddPowerModal] = useState(false);
  const [showEnterPowerManuallyModal, setShowEnterPowerManuallyModal] =
    useState(false);
  const [showUploadPrescriptionModal, setShowUploadPrescriptionModal] =
    useState(false);
  const [selectedLensForPower, setSelectedLensForPower] = useState<Lens | null>(
    null
  );
  const [showSavedPowersModal, setShowSavedPowersModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    description: false,
    easyReturn: false,
  });

  // Toggle dropdown sections
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handler to open AddPowerModal after lens selection for single vision/progressive
  const handleLensSelectForPower = (lens: Lens) => {
    setSelectedLensForPower(lens);
    setShowAddPowerModal(true);
  };

  // Handler for manual power submit
  const handleManualPowerSubmit = async (
    powerDetails: PowerDetails,
    name: string,
    phone: string
  ) => {
    if (!product || !selectedLensForPower || !userProfile || cartLoading)
      return;

    // Validate required fields
    if (!name || !phone) {
      toast.error("Please provide name and phone number.");
      return;
    }

    const newPower: PowerEntry = {
      id: crypto.randomUUID(),
      name,
      phone,
      method: "manual",
      power_details: powerDetails,
      prescription_image_url: null,
      created_at: new Date().toISOString(),
    };
    await addPowerToUserTable(userProfile.id, newPower);
    addToCart({
      product,
      lens: selectedLensForPower,
      powerCategory: "manual",
      quantity: 1,
      powerDetails: powerDetails,
      prescriptionImageUrl: null,
      powerMethod: "manual",
      powerName: name,
      powerPhone: phone,
    });
    setShowEnterPowerManuallyModal(false);
    setSelectedLensForPower(null);
    toast.success("Power details saved and added to cart successfully!");
  };

  // Handler for prescription upload
  const handleUploadPrescription = async (
    imageUrl: string,
    name: string,
    phone: string
  ) => {
    if (!product || !selectedLensForPower || !userProfile || cartLoading)
      return;

    // Validate required fields
    if (!imageUrl || !name || !phone) {
      toast.error(
        "Please provide all required information: prescription image, name, and phone number."
      );
      return;
    }

    const newPower: PowerEntry = {
      id: crypto.randomUUID(),
      name,
      phone,
      method: "upload",
      power_details: null,
      prescription_image_url: imageUrl,
      created_at: new Date().toISOString(),
    };
    await addPowerToUserTable(userProfile.id, newPower);
    addToCart({
      product,
      lens: selectedLensForPower,
      powerCategory: "prescription",
      quantity: 1,
      powerDetails: null,
      prescriptionImageUrl: imageUrl,
      powerMethod: "upload",
      powerName: name,
      powerPhone: phone,
    });
    setShowUploadPrescriptionModal(false);
    setSelectedLensForPower(null);
    toast.success("Prescription uploaded and added to cart successfully!");
  };

  const handleEnterPowerManually = () => {
    setShowAddPowerModal(false);
    setShowEnterPowerManuallyModal(true);
  };



  // Handler for adding to cart with submit power later (no name/phone required)
  const handleAddToCartWithSubmitPowerLater = () => {
    if (!product || !selectedLensForPower || cartLoading) return;

    addToCart({
      product,
      lens: selectedLensForPower,
      powerCategory: "submit-later",
      quantity: 1,
      powerDetails: null,
      prescriptionImageUrl: null,
      powerMethod: "submit-later",
      powerName: "",
      powerPhone: "",
    });
    setShowAddPowerModal(false);
    setSelectedLensForPower(null);
    toast.success(
      "Item added to cart! You can submit your power within 7 days."
    );
  };

  // Handler for saved power
  const handleSelectSavedPower = () => {
    setShowAddPowerModal(false);
    setShowSavedPowersModal(true);
  };

  // Handler for selecting a specific saved power
  const handleSelectSpecificSavedPower = (power: PowerEntry) => {
    if (!product || !selectedLensForPower || cartLoading) return;
    addToCart({
      product,
      lens: selectedLensForPower,
      powerCategory: "saved",
      quantity: 1,
      powerDetails: power.power_details,
      prescriptionImageUrl: power.prescription_image_url,
      powerMethod: power.method,
      powerName: power.name,
      powerPhone: power.phone,
    });
    setShowSavedPowersModal(false);
    setSelectedLensForPower(null);
    toast.success(`Item added to cart with saved power for ${power.name}!`);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          setError("Product not found");
          return;
        }

        // Fetch coupons associated with this product
        const { data: productCoupons } = await supabase
          .from("product_coupons")
          .select("coupon_id")
          .eq("product_id", params.id);
        
        let coupons = [];
        if (productCoupons && productCoupons.length > 0) {
          const couponIds = productCoupons.map(pc => pc.coupon_id);
          const { data: couponsData } = await supabase
            .from("coupons")
            .select("id, code, discount_type, discount_value, min_cart_value, start_date, end_date, is_active, description")
            .in("id", couponIds)
            .eq("is_active", true);
          
          coupons = couponsData || [];
        }

        // Add coupons to the product object
        setProduct({...data, coupons} as Product);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product");
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
          (p) =>
            p.id !== product.id &&
            p.shape_category &&
            p.shape_category.toLowerCase() ===
              product.shape_category?.toLowerCase()
        );

        // Sort by display_order and limit to 8 products
        const sortedRecommendations = sameShapeProducts
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .slice(0, 8);

        setRecommendations(sortedRecommendations as unknown as Product[]);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
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
    if (product.images && product.images.length > 0) {
      // Sort by display_order and add image URLs
      const sortedImages = product.images.sort(
        (a, b) => a.display_order - b.display_order
      );
      images.push(...sortedImages.map((img) => img.url));
    }
    return images;
  };

  const getCurrentPrice = () => {
    if (!product) return 0;
    return product.discounted_price || product.original_price;
  };

  const getDiscountPercentage = () => {
    if (!product || !product.discounted_price) return 0;
    return Math.round(
      ((product.original_price - product.discounted_price) /
        product.original_price) *
        100
    );
  };

  const handleRecommendationClick = (recommendation: Product) => {
    router.push(`/product/${recommendation.id}`);
  };

  const handleFavoriteClick = async () => {
    if (!product) return;

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      if (isFavorite(product.id!)) {
        await removeFromFavorites(product.id!);
      } else {
        await addToFavorites(product);
      }
    } catch (error) {
      console.error("Error handling favorite:", error);
    }
  };

  const handleRecommendationFavoriteClick = async (
    e: React.MouseEvent,
    recommendation: Product
  ) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      if (isFavorite(recommendation.id!)) {
        await removeFromFavorites(recommendation.id!);
      } else {
        await addToFavorites(recommendation);
      }
    } catch (error) {
      console.error("Error handling favorite:", error);
    }
  };

  const handleAddLensClick = async () => {
    if (!product?.lens_category_id && product?.lens_category_id !== 0) {
    }
    setShowLensModal(true);
    setLensesLoading(true);
    setLensesError(null);
    try {
      const data = await getLensesByCategory(product.lens_category_id!);
      // Only show lenses with category 'single vision'
      const singleVisionLenses = data.filter(
        (lens) => lens.category === "single vision"
      );
      // Sort lenses by display_order (lower numbers first)
      const sortedLenses = singleVisionLenses.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        return orderA - orderB;
      });
      setLenses(sortedLenses);
    } catch {
      setLensesError("Failed to load lenses");
    } finally {
      setLensesLoading(false);
    }
  };

  const handleAddPowerClick = () => {
    setShowPowerModal(true);
  };

  // Enhanced Magnifier event handlers
  const handleMouseEnter = () => setShowMagnifier(true);
  const handleMouseLeave = () => {
    // Add a small delay to prevent flickering when moving between elements
    setTimeout(() => setShowMagnifier(false), 100);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    // Calculate position with bounds checking
    const x = Math.max(0, Math.min(e.clientX - left, width));
    const y = Math.max(0, Math.min(e.clientY - top, height));
    
    // Calculate relative position (0 to 1)
    const relativeX = x / width;
    const relativeY = y / height;
    
    // Use relative position to ensure we're showing the correct part of the image
    // This helps ensure the magnifier shows exactly what's under the cursor
    setMagnifierPosition({ 
      x: x, 
      y: y,
      relativeX: relativeX,
      relativeY: relativeY
    });
  };

  // Preview modal handlers
  const handleImageClick = () => {
    setShowPreview(true);
    setPreviewIndex(selectedImage);
    // Preload images when opening preview
    setTimeout(() => {
      productImages.forEach((src) => {
        if (typeof window !== "undefined") {
          const preloader = document.createElement("img");
          preloader.src = src;
        }
      });
    }, 100);
  };

  const handlePreviewLeft = () => {
    const newIndex = Math.max(0, previewIndex - 1);
    if (newIndex !== previewIndex) {
      setPreviewIndex(newIndex);
      // Scroll to the new index smoothly using ref
      if (previewScrollContainerRef.current) {
        console.log('Scrolling left to index:', newIndex);
        previewScrollContainerRef.current.scrollTo({
          left: newIndex * previewScrollContainerRef.current.clientWidth,
          behavior: "smooth",
        });
      } else {
        console.log('previewScrollContainerRef.current is null');
      }
    }
  };
  const handlePreviewRight = () => {
    const newIndex = Math.min(productImages.length - 1, previewIndex + 1);
    if (newIndex !== previewIndex) {
      setPreviewIndex(newIndex);
      // Scroll to the new index smoothly using ref
      if (previewScrollContainerRef.current) {
        console.log('Scrolling right to index:', newIndex);
        previewScrollContainerRef.current.scrollTo({
          left: newIndex * previewScrollContainerRef.current.clientWidth,
          behavior: "smooth",
        });
      } else {
        console.log('previewScrollContainerRef.current is null');
      }
    }
  };

  // Mobile touch handling for smooth scrolling
  // const handleTouchStart = (e: React.TouchEvent) => {
  //   const touch = e.touches[0];
  //   const container = e.currentTarget as HTMLDivElement;
  //   container.dataset.touchStartX = touch.clientX.toString();
  //   container.dataset.touchStartScrollLeft = container.scrollLeft.toString();
  // };

  // const handleTouchMove = (e: React.TouchEvent) => {
  //   const touch = e.touches[0];
  //   const container = e.currentTarget as HTMLDivElement;
  //   const startX = parseFloat(container.dataset.touchStartX || '0');
  //   const startScrollLeft = parseFloat(container.dataset.touchStartScrollLeft || '0');
  //   const diff = startX - touch.clientX;
  //   container.scrollLeft = startScrollLeft + diff;
  // };

  // const handleTouchEnd = (e: React.TouchEvent) => {
  //   const container = e.currentTarget as HTMLDivElement;
  //   delete container.dataset.touchStartX;
  //   delete container.dataset.touchStartScrollLeft;
  // };

  const productImages = getProductImages();
  const BRAND_COLOR = "#2D6CDF";

  // Focus modal for keyboard navigation
  useEffect(() => {
    if (showPreview) {
      if (previewModalRef.current) {
        previewModalRef.current.focus();
      }
      setShowSwipeHint(true);
      const timer = setTimeout(() => setShowSwipeHint(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showPreview]);

  // Show mobile swipe hint when component mounts
  useEffect(() => {
    if (productImages.length > 1) {
      setShowMobileSwipeHint(true);
      const timer = setTimeout(() => setShowMobileSwipeHint(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [productImages.length]);

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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The product you are looking for does not exist."}
            </p>
            <button
              onClick={() => router.back()}
              className="bg-button text-white px-6 py-3 rounded-lg hover:bg-button/80 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }



  // Handler for selecting a lens type in Power modal
  const handlePowerLensTypeSelect = async (typeKey: string) => {
    setSelectedLensType(typeKey);

    if (typeKey === "frame-only") {
      // For frame-only, do not open lens modal, let the footer button handle it.
      return;
    }

    setShowPowerLensModal(true);
    setPowerLensLoading(true);
    setPowerLensError(null);
    setSelectedPowerLensId(null);
          try {
        if (!product?.lens_category_id) throw new Error("No lens category id");
        const allLenses = await getLensesByCategory(product.lens_category_id);
        // Map UI typeKey to DB category
        let dbCategory = typeKey;
        if (typeKey === "bifocal-progressive") dbCategory = "progressive";
        if (typeKey === "single-vision") dbCategory = "single vision";
        if (typeKey === "zero-power") dbCategory = "zero power";
        if (typeKey === "frame-only") dbCategory = "frame only";
        const filtered = allLenses.filter((lens) => lens.category === dbCategory);
        // Sort lenses by display_order (lower numbers first)
        const sortedLenses = filtered.sort((a, b) => {
          const orderA = a.display_order || 0;
          const orderB = b.display_order || 0;
          return orderA - orderB;
        });
        setPowerLensList(sortedLenses);
      } catch {
      setPowerLensError("Failed to load lenses");
      setPowerLensList([]);
    } finally {
      setPowerLensLoading(false);
    }
  };

  // Add to Cart (frame only)
  const handleAddToCart = () => {
    if (!product || cartLoading) return;
    addToCart({ product, powerCategory: "frame only", quantity: 1 });
    toast.success("Frame added to cart successfully!");
    router.push("/cart");
  };
  const handleRemoveFromCart = () => {
    if (!product || cartLoading) return;
    removeByDetails({ product, powerCategory: "frame only", quantity: 1 });
    toast.success("Frame removed from cart!");
  };
  // Add to Cart with lens
  const handleAddLensToCart = (lens: Lens) => {
    if (!product || cartLoading) return;
    addToCart({ product, lens, quantity: 1 });
    router.push("/cart");
    toast.success(`Added to cart with ${lens.title}!`);
  };
  const handleRemoveLensFromCart = (lens: Lens) => {
    if (!product || cartLoading) return;
    removeByDetails({ product, lens, quantity: 1 });
    toast.success(`Removed from cart!`);
  };
  // Add to Cart with power (category and lens)
  const handleAddPowerToCart = (powerCategory: string, lens: Lens) => {
    if (!product || cartLoading) return;
    addToCart({ product, lens, powerCategory, quantity: 1 });
    toast.success(`Added to cart with ${lens.title} and ${powerCategory}!`);
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative">
          {/* Product Images */}
          <div className="space-y-6 relative">
            {/* Desktop Layout: Thumbnails on left, main image on right */}
            <div className="hidden lg:flex gap-6">
              {/* Thumbnail Images - Left Side */}
              {productImages.length > 1 && (
                <div className="flex flex-col space-y-3 w-20">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                        selectedImage === index
                          ? "border-black shadow-lg ring-2 ring-black/20"
                          : "border-gray-200 hover:border-gray-300 shadow-sm"
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

              {/* Main Image */}
              <div className="flex-1">
                <div
                  ref={imageContainerRef}
                  className="aspect-square bg-white rounded-lg overflow-hidden relative hover:border-gray-300 transition-all duration-200 group"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >
                  {/* Magnifier Tooltip */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 flex items-center gap-1.5 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zoom-in">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                    <span>Hover to zoom (2x)</span>
                  </div>
                  {productImages.length > 0 ? (
                    <>
                      <Image
                        src={productImages[selectedImage]}
                        alt={product.title}
                        width={600}
                        height={600}
                        sizes="100vw"
                        className="w-full h-full object-cover select-none"
                        draggable={false}
                        onClick={handleImageClick}
                        style={{ cursor: "zoom-in" }}
                        priority={selectedImage === 0}
                        loading={selectedImage === 0 ? "eager" : "lazy"}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlIi8+PC9zdmc+"
                        decoding="async"
                      />
                      
                      {/* Magnifier Cursor Indicator */}
                      {showMagnifier && (
                        <>
                          {/* Outer ring */}
                          <div
                            className="absolute w-12 h-12 border border-white/50 rounded-full pointer-events-none z-10 animate-pulse"
                            style={{
                              left: magnifierPosition.x - 24,
                              top: magnifierPosition.y - 24,
                              boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          {/* Inner circle */}
                          <div
                            className="absolute w-6 h-6 border-2 border-white rounded-full shadow-lg pointer-events-none z-10"
                            style={{
                              left: magnifierPosition.x - 12,
                              top: magnifierPosition.y - 12,
                              boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.3)",
                            }}
                          />
                          {/* Center dot */}
                          <div
                            className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-sm pointer-events-none z-10"
                            style={{
                              left: magnifierPosition.x - 3,
                              top: magnifierPosition.y - 3,
                            }}
                          />
                        </>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={handleFavoriteClick}
                        className={`absolute top-3 right-15 z-10 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 bg-white shadow-md hover:shadow-lg ${
                          isFavorite(product.id!)
                            ? "text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFavorite(product.id!) ? "fill-current" : ""
                          }`}
                        />
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={() => {
                          /* TODO: add share logic */
                        }}
                        className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md hover:shadow-lg text-gray-400 hover:text-gray-600 transition-all duration-200"
                        aria-label="Share"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Eye className="w-16 h-16" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Layout: Main image on top, thumbnails below */}
            <div className="lg:hidden space-y-4">
              {/* Main Image */}
              <div
                ref={imageContainerRef}
                className="aspect-square bg-whiterounded-2xl overflow-hidden relative group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                {/* Swipeable Image Container for Mobile */}
                <div 
                  className="w-full h-full overflow-x-auto snap-x snap-mandatory flex"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                  onScroll={(e) => {
                    const container = e.currentTarget;
                    const scrollLeft = container.scrollLeft;
                    const itemWidth = container.clientWidth;
                    const index = Math.round(scrollLeft / itemWidth);
                    if (index !== selectedImage) {
                      setSelectedImage(index);
                    }
                  }}
                >
                  {productImages.length > 0 ? (
                    productImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="min-w-full h-full flex-shrink-0 snap-center"
                      >
                        <Image
                          src={img}
                          alt={`${product.title} ${idx + 1}`}
                          width={600}
                          height={600}
                          sizes="(min-width: 1024px) 600px, 100vw"
                          className="w-full h-full object-cover select-none"
                          draggable={false}
                          onClick={handleImageClick}
                          style={{ cursor: "zoom-in" }}
                          priority={idx === 0}
                          loading={idx === 0 ? "eager" : "lazy"}
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlIi8+PC9zdmc+"
                          decoding="async"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Eye className="w-16 h-16" />
                    </div>
                  )}
                </div>

                {/* Magnifier Tooltip (Mobile) */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 flex items-center gap-1.5 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zoom-in">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                  <span>Hover to zoom (2x)</span>
                </div>
                
                {/* Magnifier Cursor Indicator (Mobile) */}
                {showMagnifier && (
                  <>
                    {/* Outer ring */}
                    <div
                      className="absolute w-12 h-12 border border-white/50 rounded-full pointer-events-none z-10 animate-pulse"
                      style={{
                        left: magnifierPosition.x - 24,
                        top: magnifierPosition.y - 24,
                        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    {/* Inner circle */}
                    <div
                      className="absolute w-6 h-6 border-2 border-white rounded-full shadow-lg pointer-events-none z-10"
                      style={{
                        left: magnifierPosition.x - 12,
                        top: magnifierPosition.y - 12,
                        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.3)",
                      }}
                    />
                    {/* Center dot */}
                    <div
                      className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-sm pointer-events-none z-10"
                      style={{
                        left: magnifierPosition.x - 3,
                        top: magnifierPosition.y - 3,
                      }}
                    />
                  </>
                )}

                {/* Favorite Button */}
                <button
                  onClick={handleFavoriteClick}
                  className={`absolute top-3 right-16 z-10 w-12 h-12 border-2 border-gray-200 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 bg-white/95 backdrop-blur-sm hover:scale-110 ${
                    isFavorite(product.id!)
                      ? "border-red-400 bg-red-50 shadow-lg"
                      : "hover:border-gray-300 hover:shadow-lg"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-all duration-300 ${
                      isFavorite(product.id!)
                        ? "text-red-500 fill-current"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                  />
                </button>

                {/* Share Button */}
                <button
                  onClick={() => {
                    /* TODO: add share logic */
                  }}
                  className="absolute top-3 right-3 z-10 border-2 border-gray-200 bg-white/95 backdrop-blur-sm w-12 h-12 flex items-center justify-center rounded-xl shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:scale-110"
                  aria-label="Share"
                >
                  <Share2 className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />
                </button>

                {/* Pagination dots for mobile */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {productImages.map((_, idx) => (
                    <button 
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImage === idx ? 'bg-white scale-125 shadow-md' : 'bg-white/50'
                      }`}
                      onClick={() => handleImageChange(idx)}
                    />
                  ))}
                </div>

                {/* Mobile swipe hint */}
                {showMobileSwipeHint && productImages.length > 1 && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-pulse z-30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 5l-5 5 5 5"></path>
                    </svg>
                    Swipe to view more
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 19l5-5-5-5"></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Thumbnail Images - Bottom */}
              {productImages.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                        selectedImage === index
                          ? "border-black shadow-lg ring-2 ring-black/20"
                          : "border-gray-200 hover:border-gray-300 shadow-sm"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Magnifier (desktop only) */}
            {showMagnifier && productImages.length > 0 && (
              <div
                className="hidden lg:block absolute top-0 left-[calc(100%+32px)] w-[420px] h-[420px] rounded-2xl border-2 border-white shadow-2xl overflow-hidden bg-white animate-in fade-in-0 zoom-in-95 duration-200"
                style={{
                  zIndex: 30,
                  background: `url(${productImages[selectedImage]}) no-repeat`,
                  backgroundSize: `${productImages[selectedImage] ? '1000px 1000px' : '800px 800px'}`,
                  backgroundPosition: `${-magnifierPosition.relativeX * 1000 + 210}px ${-magnifierPosition.relativeY * 1000 + 210}px`,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  backgroundColor: "white",
                }}
              >
                {/* Magnifier Border Glow Effect */}
                <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
                
                {/* Magnifier Corner Indicators */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-white/80 rounded-full shadow-sm" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-white/80 rounded-full shadow-sm" />
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/80 rounded-full shadow-sm" />
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-white/80 rounded-full shadow-sm" />
                
                {/* Zoom Level Indicator */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium">
                  2x Zoom
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title and Badges */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl capitalize font-medium text-gray-900 leading-tight tracking-tight">
                  {product.title}
                </h1>
                {/* <div className="flex items-center gap-2 mt-3">
                  {product.bestseller && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Best Seller
                    </span>
                  )}
                  {product.latest_trend && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Trending
                    </span>
                  )}
                  {product.discounted_price && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {getDiscountPercentage()}% OFF
                    </span>
                  )}
                </div> */}
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-gray-900">
                  ₹{getCurrentPrice()}
                </span>
                {product.discounted_price && (
                  <>
                    <span className="text-xl text-gray-500 line-through font-light">
                      ₹{product.original_price}
                    </span>

                    {product.discounted_price && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ({getDiscountPercentage()}% OFF)
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Available Coupons */}
            {product.coupons && product.coupons.length > 0 && (
              <div className="border-b border-gray-200 py-4">
                <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M22 12a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4z"></path>
                    <path d="M16 2H8l-4 10 4 10h8l4-10-4-10z"></path>
                    <path d="M9.45 12h5.1"></path>
                  </svg>
                  Available Coupons
                </h3>
                <div className="space-y-2 mt-3">
                  {product.coupons.map((coupon) => (
                    <div 
                      key={coupon.id} 
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-2 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded text-sm">
                          {coupon.code}
                        </div>
                        <div className="text-sm">
                          {coupon.discount_type === 'flat' ? 
                            `₹${coupon.discount_value} off` : 
                            coupon.discount_type === 'percentage' ? 
                            `${coupon.discount_value}% off` : 
                            coupon.discount_type}
                          {coupon.min_cart_value ? ` on min. purchase of ₹${coupon.min_cart_value}` : ''}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(coupon.code);
                          toast.success("Coupon code copied!");
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Frame Measurements */}
            {product.lens_width ||
            product.bridge_width ||
            product.temple_length ? (
              <div className="space-y-4 items-center">
                {/* <h3 className="text-lg font-medium text-gray-900">
                  Frame Details
                </h3> */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex gap-2 items-center justify-center">
                    {product.sizes.map((size, index) => (
                      <h3
                        key={index}
                        className="text-lg font-medium text-gray-900 text-center"
                      >
                        SIZE : {size}
                      </h3>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  {/* Lens Width */}
                  {product.lens_width && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Image
                        src="/image2.png"
                        className="w-6 h-6 mx-auto mb-2 opacity-60"
                        alt="Lens Width"
                        width={24}
                        height={24}
                      />
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Lens Width
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {product.lens_width}mm
                      </p>
                    </div>
                  )}
                  {/* Bridge Width */}
                  {product.bridge_width && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Image
                        src="/image3.png"
                        className="w-6 h-6 mx-auto mb-2 opacity-60"
                        alt="Bridge Width"
                        width={24}
                        height={24}
                      />
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Bridge Width
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {product.bridge_width}mm
                      </p>
                    </div>
                  )}
                  {/* Temple Length */}
                  {product.temple_length && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Image
                        src="/image.png"
                        className="w-6 h-6 mx-auto mb-2 opacity-60"
                        alt="Temple Length"
                        width={24}
                        height={24}
                      />
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Temple Length
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {product.temple_length}mm
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Size Guide Button */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => router.push("/size-guide")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-medium text-sm"
                  >
                    <Ruler className="w-4 h-4" />
                    Size Guide
                  </button>
                </div>
              </div>
            ) : product.sizes && product.sizes.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Available Sizes
                </h3>
                <div className="flex gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
                
                {/* Size Guide Button */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => router.push("/size-guide")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-medium text-sm"
                  >
                    <Ruler className="w-4 h-4" />
                    Size Guide
                  </button>
                </div>
              </div>
            ) : null}

            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-16 h-10 border-t border-b border-gray-300 flex items-center justify-center text-sm font-medium bg-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Sunglasses & Powered Sunglasses logic */}
              {product.type_category &&
              (product.type_category.includes("sunglasses") ||
                product.type_category.includes("powered sunglasses")) ? (
                product.is_lens_used ? (
                  <div className="space-y-3">
                    {product &&
                    isInCart({
                      product,
                      powerCategory: "frame only",
                      quantity: 1,
                    }) ? (
                      <button
                        className="w-full bg-red-600 text-white py-3 px-6 rounded-md font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        onClick={handleRemoveFromCart}
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Remove from Cart
                      </button>
                    ) : (
                      <button
                        className="w-full bg-button text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                        onClick={handleAddToCart}
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                      </button>
                    )}
                    <button
                      className="w-full bg-white text-gray-900 py-3 px-6 rounded-md font-medium border border-gray-300 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center gap-2"
                      onClick={handleAddLensClick}
                    >
                      <Ruler className="w-5 h-5" />
                      Add Lens
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </button>
                )
              ) : // Eyeglasses & Computer Glasses logic
              product.type_category &&
                (product.type_category.includes("eyeglasses") ||
                  product.type_category.includes("computer glasses") ||
                  product.type_category.includes("computerglasses")) ? (
                <button
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={handleAddPowerClick}
                >
                  <Ruler className="w-5 h-5" />
                  Add Power
                </button>
              ) : (
                // Default fallback (show Add to Cart)
                <button
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
              )}
            </div>
          </div>

          {/* Product Description Dropdown */}
          <div className=" mt-12">
            <div className="border-0 border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection("description")}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors bg-white"
              >
                <span className="font-medium text-2xl text-gray-900 ">
                  Product Details
                </span>
                <span
                  className={`transform transition-transform duration-200 ${
                    expandedSections.description ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {expandedSections.description && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  {/* Frame Features Section */}
                  <div className="mb-6">
                    <h4 className="font-bold text-xl text-gray-900 mb-3">
                      Frame Features :
                    </h4>
                    <div className=" text-sm">
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex gap-2 py-1">
                          <span className="text-gray-900 font-medium text-lg">
                            Frame Size:
                          </span>
                          <span className="text-gray-900 font-medium text-lg">
                            {product.sizes.join(", ")}
                          </span>
                        </div>
                      )}
                      {product.gender_category &&
                        product.gender_category.length > 0 && (
                          <div className="flex gap-2 py-1">
                            <span className="text-gray-900 font-medium text-lg">
                              Gender:
                            </span>
                            <span className="text-gray-900 font-medium capitalize text-lg">
                              {product.gender_category.join(", ")}
                            </span>
                          </div>
                        )}
                      {product.frame_material && (
                        <div className="flex gap-2 py-1">
                          <span className="text-gray-900 font-medium text-lg">
                            Frame Material:
                          </span>
                          <span className="text-gray-900 font-medium text-lg">
                            {product.frame_material}
                          </span>
                        </div>
                      )}

                      {product.bridge_width &&
                        product.temple_length &&
                        product.lens_width && (
                          <div className="flex gap-2 py-1">
                            <span className="text-gray-900 font-medium text-lg">
                              Frame Dimensions:
                            </span>
                            <span className="text-gray-900 font-medium text-lg">
                              {product.lens_width}-{product.bridge_width}-
                              {product.temple_length}
                            </span>
                          </div>
                        )}
                      {/* {product.temple_length && (
                        <div className="flex gap-2 py-1">
                          <span className="text-gray-900 font-medium">Temple Length:</span>
                          <span className="text-gray-900 font-medium">
                            {product.temple_length}
                          </span>
                        </div>
                      )}
                      {product.lens_width && (
                        <div className="flex gap-2 py-1">
                          <span className="text-gray-900 font-medium">Lens Width:</span>
                          <span className="text-gray-900 font-medium">
                            {product.lens_width}
                          </span>
                        </div>
                      )} */}
                      {/* <div className="flex gap-2 py-1">
                        <span className="text-gray-900 font-medium text-lg">
                          Age Group:
                        </span>
                        <span className="text-gray-900 font-medium text-lg">
                          Adult
                        </span>
                      </div> */}
                      {product.frame_colour && (
                        <div className="flex gap-2 py-1">
                          <span className="text-gray-900 font-medium text-lg">
                            Frame Colour:
                          </span>
                          <span className="text-gray-900 font-medium text-lg">
                            {product.frame_colour}
                          </span>
                        </div>
                      )}
                      {product.temple_colour && (
                        <div className="flex gap-2 py-1">
                          <span className="text-gray-900 font-medium text-lg">
                            Temple Colour:
                          </span>
                          <span className="text-gray-900 font-medium text-lg">
                            {product.temple_colour}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Style Section */}
                  <div className="mb-6">
                    <h4 className="font-bold text-xl text-gray-900 mb-3">
                      Lens Featues
                    </h4>
                    {product.type_category.includes("sunglasses") ||
                    product.type_category.includes("powered sunglasses") ? (
                      <ul className="list-disc list-inside text-gray-900 font-medium space-y-2 text-lg capitalize leading-relaxed text-medium">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                      <li>UV 400 Protection</li>
                      <li>Scratch Resistance</li>
                      <li>High Quality finish</li>
                      <li>7 days replacement Warranty against manufacturing defects</li>
                      <li>6 months warranty</li>
                      <li>What&apos;s Included with Your Purchase</li>
                      <li>✓ 1 Premium Eyeric Eyewear Case – For safe & stylish storage</li>
                      <li>✓ 1 Eyeric Microfiber Cleaning Cloth – To keep your lenses spotless</li>
                      <li>✓ 1 Eyeric Lens Cleaning Spray – For crystal-clear vision</li>
                      <li>All accessories are provided absolutely free with every frame.</li>
                    </ul>
                    ) : null}
                    <br />

                    <h4 className="font-bold text-xl text-gray-900 mb-3">
                      Description
                    </h4>

                    <p className="text-gray-900 font-medium leading-relaxed text-medium">
                      {product.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Easy Return Dropdown */}
            <div className="mt-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("easyReturn")}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors bg-white"
                >
                  <span className="font-medium text-xl text-gray-900">
                    Returns & Exchange
                  </span>
                  <span
                    className={`transform transition-transform duration-200 ${
                      expandedSections.easyReturn ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {expandedSections.easyReturn && (
                  <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-medium text-lg mb-4">
                      Eyeric provides exchange or refunds only on products that
                      are returned in their original condition, with all tags
                      and packaging intact. No request for return or exchange
                      will be accepted if the original tag is missing. &nbsp;
                      <button
                        onClick={() => router.push("/refund")}
                        className="text-gray-900 underline hover:text-gray-700 transition-colors text-sm font-medium"
                      >
                        Read More
                      </button>
                    </p>
                    {/* {product.product_serial_number && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="text-gray-600 text-sm">
                          SKU: {product.product_serial_number}
                        </span>
                      </div>
                    )} */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-gray-900 mb-2">
                You might also like
              </h2>
              <p className="text-gray-600">
                Similar {product.shape_category} styles
              </p>
            </div>
            <div className="flex gap-6 overflow-x-auto">
              {recommendations.slice(0, 10).map((item, index) => (
                <div
                  key={item.id || index}
                  className="group cursor-pointer min-w-72"
                  onClick={() => handleRecommendationClick(item)}
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3 relative">
                    {item.discounted_price && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                          Sale
                        </span>
                      </div>
                    )}
                    <button
                      onClick={(e) =>
                        handleRecommendationFavoriteClick(e, item)
                      }
                      className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite(item.id!)
                            ? "text-red-500 fill-current"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      />
                    </button>
                    <Image
                      width={300}
                      height={300}
                      loading="lazy"
                      src={item.banner_image_1 || item.banner_image_2 || ""}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-gray-900">
                        ₹{item.discounted_price || item.original_price}
                      </span>
                      {item.discounted_price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.original_price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />

      {/* Enhanced Fullscreen Preview Modal */}
      {showPreview && productImages.length > 0 && (
        <div
          ref={previewModalRef}
          className="fixed inset-0 z-50 bg-white flex items-center justify-center"
          tabIndex={0}
          onKeyDown={(e) => {
            console.log('Key pressed:', e.key, 'previewIndex:', previewIndex);
            if (e.key === "ArrowLeft" && previewIndex > 0) {
              console.log('Handling left arrow');
              handlePreviewLeft();
            } else if (
              e.key === "ArrowRight" &&
              previewIndex < productImages.length - 1
            ) {
              console.log('Handling right arrow');
              handlePreviewRight();
            } else if (e.key === "Escape") {
              setShowPreview(false);
            }
          }}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-gray-700 text-3xl z-20 bg-white/90 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            onClick={() => setShowPreview(false)}
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Left button */}
          {previewIndex > 0 && (
            <button
              className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 bg-white/90 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              onClick={handlePreviewLeft}
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image Container */}
          <div className="relative w-full h-full">
            <div
              ref={previewScrollContainerRef}
              className="w-full h-full flex overflow-x-auto scrollbar-hide"
              style={{ 
                scrollBehavior: "smooth",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "none"
              }}
              onScroll={(e) => {
                const container = e.currentTarget as HTMLDivElement;
                const scrollLeft = container.scrollLeft;
                const containerWidth = container.clientWidth;
                const newIndex = Math.round(scrollLeft / containerWidth);

                // Only update if the index is valid and different
                if (
                  newIndex >= 0 &&
                  newIndex < productImages.length &&
                  newIndex !== previewIndex
                ) {
                  setPreviewIndex(newIndex);
                }
              }}
            >
              {productImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative min-w-full h-full flex items-center justify-center p-4 md:p-8"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <Image
                    src={src}
                    alt={`${product.title} ${idx + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain max-h-full max-w-full transition-transform duration-300"
                    draggable={false}
                    priority={
                      idx === previewIndex ||
                      idx === previewIndex - 1 ||
                      idx === previewIndex + 1
                    }
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlIi8+PC9zdmc+"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots for Mobile */}
          <div className="flex justify-center mt-4 md:hidden absolute bottom-8 left-1/2 -translate-x-1/2">
            {productImages.map((_, idx) => (
              <span
                key={idx}
                className={`mx-1 h-3 w-3 rounded-full inline-block transition-all duration-300 ${
                  idx === previewIndex ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Swipe Hint for Mobile */}
          {showSwipeHint && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-800/80 text-white px-4 py-2 rounded-full text-sm md:hidden">
              Swipe to see more
            </div>
          )}

          {/* Right button */}
          {previewIndex < productImages.length - 1 && (
            <button
              className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 bg-white/90 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              onClick={handlePreviewRight}
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute top-6 left-6 bg-white/90 rounded-full px-4 py-2 shadow-lg">
            <span className="text-gray-700 font-medium">
              {previewIndex + 1} / {productImages.length}
            </span>
          </div>
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
            style={{ position: "relative", bottom: 0, right: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-2 border-b border-gray-100 bg-gradient-to-b from-white/90 to-[#faf8f6] backdrop-blur">
              <button
                className="p-2 mr-2"
                onClick={() => setShowLensModal(false)}
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="flex-1 text-center text-lg md:text-2xl font-bold text-gray-900 tracking-tight">
                Choose Lens Package
              </h2>
              <button
                className="p-2 ml-2"
                onClick={() => setShowLensModal(false)}
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-2 md:px-6 py-2 md:py-6">
              {lensesLoading ? (
                <div className="flex justify-center items-center py-8">
                  Loading lenses...
                </div>
              ) : lensesError ? (
                <div className="text-red-500 py-8">{lensesError}</div>
              ) : lenses.length === 0 ? (
                <div className="text-gray-500 py-8">
                  No lenses found for this category.
                </div>
              ) : (
                <div className="flex flex-col gap-3 md:gap-6">
                  {lenses.map((lens) => (
                    <div
                      key={lens.id}
                      className={`group flex items-center bg-white rounded-2xl shadow-lg px-3 py-3 md:px-6 md:py-5 cursor-pointer border-2 transition-all duration-200 relative overflow-hidden
                        ${
                          selectedLensId === lens.id
                            ? "border-[2.5px] border-primary bg-gradient-to-br from-primary/60 to-yellow-50/40 scale-[1.02]"
                            : "border-gray-100 hover:border-primary hover:shadow-xl hover:scale-[1.01]"
                        }
                      `}
                      style={{
                        boxShadow:
                          selectedLensId === lens.id
                            ? `0 0 0 2px ${BRAND_COLOR}33`
                            : undefined,
                      }}
                      onClick={() =>
                        lens.category === "single vision" ||
                        lens.category === "progressive" ||
                        lens.category === "bifocal"
                          ? handleLensSelectForPower(lens)
                          : setSelectedLensId(lens.id)
                      }
                    >
                      <div className="w-30 h-30 md:w-60 md:h-40 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mr-2 md:mr-6 ">
                        {lens.image_url ? (
                          <Image
                            src={lens.image_url}
                            alt={lens.title}
                            width={326}
                            height={326}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-2xl md:text-4xl">👓</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base md:text-2xl text-gray-900 mb-1 truncate">
                          {lens.title}
                        </div>
                        <ul className="text-gray-700 text-xs md:text-[16px] mb-1 md:mb-2 list-disc list-inside space-y-0.5">
                          {Array.isArray(lens.features) &&
                            lens.features.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                        {/* <div className="text-gray-500 text-xs md:text-[18px] mb-1">
                          Applicable Only for Single Vision Power
                        </div>
                        <div className="text-gray-500 text-xs md:text-[18px] mb-1">
                          UV-400 Protection
                        </div> */}
                        <div className="font-semibold text-base md:text-xl text-primary mt-1 md:mt-2">
                          Frame + Lens:{" "}
                          <span className="text-gray-900">
                            ₹{lens.original_price}
                          </span>
                        </div>
                      </div>
                      {/* Selection checkmark */}
                      {selectedLensId === lens.id && (
                        <span className="ml-2 text-primary text-xl md:text-2xl font-bold absolute top-3 right-3 md:static">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="sticky bottom-0 z-10 px-3 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-gradient-to-t from-white/90 to-[#faf8f6] flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm md:text-base">
                  Subtotal (Frame):
                </span>
                <span className="text-xl md:text-2xl font-bold text-gray-900">
                  ₹{product?.discounted_price || product?.original_price}
                </span>
              </div>
              {selectedLensId &&
                (() => {
                  const selectedLens = lenses.find(
                    (l) => l.id === selectedLensId
                  );
                  const inCart = isInCart({
                    product,
                    lens: selectedLens,
                    quantity: 1,
                  });
                  return inCart ? (
                    <button
                      className="w-full py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all duration-200 text-base md:text-lg"
                      onClick={() => handleRemoveLensFromCart(selectedLens)}
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 shadow-md transition-all duration-200 text-base md:text-lg"
                      onClick={() => handleAddLensToCart(selectedLens)}
                    >
                      Add to Cart
                    </button>
                  );
                })()}
              <div className="text-gray-400 text-xs md:text-sm text-center mt-1">
                Need help choosing?{" "}
                <span className="underline cursor-pointer">
                  Talk to our expert : 8905344556
                </span>
              </div>
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
            style={{ position: "relative", bottom: 0, right: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-2 border-b border-gray-100 bg-gradient-to-b from-white/90 to-[#faf8f6] backdrop-blur">
              <button
                className="p-2 mr-2"
                onClick={() => setShowPowerModal(false)}
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="flex-1 text-center text-lg md:text-2xl font-bold text-gray-900 tracking-tight">
                Select Lens Type
              </h2>
              <button
                className="p-2 ml-2"
                onClick={() => setShowPowerModal(false)}
              >
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
                      ${
                        selectedLensType === type.key
                          ? "border-[2.5px]  to-yellow-50/40 scale-[1.02]"
                          : "border-gray-100  hover:scale-[1.01]"
                      }
                    `}
                    style={{
                      boxShadow:
                        selectedLensType === type.key
                          ? `0 0 0 2px ${BRAND_COLOR}33`
                          : undefined,
                    }}
                    onClick={() => handlePowerLensTypeSelect(type.key)}
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mr-2 md:mr-6 border border-gray-200">
                      {type.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base md:text-lg text-gray-900 mb-1 truncate">
                        {type.title}
                      </div>
                      <div className="text-gray-700 text-xs md:text-base mb-1">
                        {type.description}
                      </div>
                    </div>
                    {/* Selection checkmark */}
                    {selectedLensType === type.key && (
                      <span className="ml-2 text-primary text-xl md:text-2xl font-bold absolute top-3 right-3 md:static">
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Footer */}
            <div className="sticky bottom-0 z-10 px-3 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-gradient-to-t from-white/90 to-[#faf8f6] flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm md:text-base">
                  Subtotal (Frame):
                </span>
                <span className="text-xl md:text-2xl font-bold text-gray-900">
                  ₹{product?.discounted_price || product?.original_price}
                </span>
              </div>
              {/* Frame Only and Zero Power logic */}
              {selectedLensType === "frame-only" ? (
                isInCart({ product, powerCategory: "frame only" }) ? (
                  <button
                    className="w-full py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all duration-200 text-base md:text-lg"
                    onClick={() => {
                      removeByDetails({ product, powerCategory: "frame only" });
                      setShowPowerModal(false);
                      toast.success("Removed from cart!");
                    }}
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 shadow-md transition-all duration-200 text-base md:text-lg"
                    onClick={() => {
                      addToCart({ product, powerCategory: "frame only" });
                      setShowPowerModal(false);
                      toast.success("Added to cart!");
                    }}
                  >
                    Add to Cart
                  </button>
                )
              ) : selectedLensType === "zero-power" ? (
                isInCart({ product, powerCategory: "zero power" }) ? (
                  <button
                    className="w-full py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all duration-200 text-base md:text-lg"
                    onClick={() => {
                      removeByDetails({ product, powerCategory: "zero power" });
                      setShowPowerModal(false);
                      toast.success("Removed from cart!");
                    }}
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 shadow-md transition-all duration-200 text-base md:text-lg"
                    onClick={() => {
                      addToCart({ product, powerCategory: "zero power" });
                      setShowPowerModal(false);
                      toast.success("Added to cart!");
                    }}
                  >
                    Add to Cart
                  </button>
                )
              ) : (
                <button
                  className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all duration-200 text-base md:text-lg ${
                    selectedLensType
                      ? "bg-primary hover:bg-primary/80"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={!selectedLensType}
                  onClick={() =>
                    selectedLensType &&
                    handlePowerLensTypeSelect(selectedLensType)
                  }
                >
                  Continue
                </button>
              )}
              <div className="text-gray-400 text-xs md:text-sm text-center mt-1">
                Need help choosing?{" "}
                <span className="underline cursor-pointer">
                  Talk to our expert : 8905344556
                </span>
              </div>
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
            style={{ position: "relative", bottom: 0, right: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-2 border-b border-gray-100 bg-gradient-to-b from-white/90 to-[#faf8f6] backdrop-blur">
              <button
                className="p-2 mr-2"
                onClick={() => setShowPowerLensModal(false)}
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="flex-1 text-center text-lg md:text-2xl font-bold text-gray-900 tracking-tight">
                Select Lens
              </h2>
              <button
                className="p-2 ml-2"
                onClick={() => setShowPowerLensModal(false)}
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-2 md:px-6 py-2 md:py-6">
              {powerLensLoading ? (
                <div className="flex justify-center items-center py-8">
                  Loading lenses...
                </div>
              ) : powerLensError ? (
                <div className="text-red-500 py-8">{powerLensError}</div>
              ) : powerLensList.length === 0 ? (
                <div className="text-gray-500 py-8">
                  No lenses found for this type.
                </div>
              ) : (
                <div className="flex flex-col gap-3 md:gap-6">
                  {powerLensList.map((lens) => (
                    <div
                      key={lens.id}
                      className={`group flex items-center bg-white rounded-2xl shadow-lg px-3 py-3 md:px-6 md:py-5 cursor-pointer border-2 transition-all duration-200 relative overflow-hidden
                        ${
                          selectedPowerLensId === lens.id
                            ? "border-[2.5px]  to-yellow-50/40 scale-[1.02]"
                            : "border-gray-100  hover:scale-[1.01]"
                        }
                      `}
                      style={{
                        boxShadow:
                          selectedPowerLensId === lens.id
                            ? `0 0 0 2px ${BRAND_COLOR}33`
                            : undefined,
                      }}
                      onClick={() => setSelectedPowerLensId(lens.id)}
                    >
                      <div className="w-30 h-30 md:w-60 md:h-40 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mr-2 md:mr-6">
                        {lens.image_url ? (
                          <Image
                            src={lens.image_url}
                            alt={lens.title}
                            width={326}
                            height={326}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-2xl md:text-4xl">👓</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base md:text-2xl text-gray-900 mb-1 truncate">
                          {lens.title}
                        </div>
                        <ul className="text-gray-700 text-xs md:text-[16px] mb-1 md:mb-2 list-disc list-inside space-y-0.5">
                          {Array.isArray(lens.features) &&
                            lens.features.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                        {/* <div className="text-gray-500 text-xs md:text-[18px] mb-1">
                          Applicable Only for Single Vision Power
                        </div>
                        <div className="text-gray-500 text-xs md:text-[18px] mb-1">
                          UV-400 Protection
                        </div> */}
                        <div className="font-semibold text-base md:text-xl text-primary mt-1 md:mt-2">
                          Frame + Lens:{" "}
                          <span className="text-gray-900">
                            ₹{lens.original_price}
                          </span>
                        </div>
                      </div>
                      {/* Selection checkmark */}
                      {selectedPowerLensId === lens.id && (
                        <span className="ml-2 text-primary text-xl md:text-2xl font-bold absolute top-3 right-3 md:static">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="sticky bottom-0 z-10 px-3 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-gradient-to-t from-white/90 to-[#faf8f6] flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm md:text-base">
                  Subtotal (Frame):
                </span>
                <span className="text-xl md:text-2xl font-bold text-gray-900">
                  ₹{product?.discounted_price || product?.original_price}
                </span>
              </div>
              {selectedPowerLensId &&
                selectedLensType &&
                (() => {
                  const selectedLens = powerLensList.find(
                    (l) => l.id === selectedPowerLensId
                  );
                  const inCart = isInCart({
                    product,
                    lens: selectedLens,
                    powerCategory: selectedLensType,
                  });

                  if (selectedLensType === "zero-power") {
                    // Zero Power: Add to cart directly, do NOT open Add Power modal
                    return inCart ? (
                      <button
                        className="w-full py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all duration-200 text-base md:text-lg"
                        onClick={() => {
                          removeByDetails({
                            product,
                            lens: selectedLens,
                            powerCategory: "zero power",
                          });
                          setShowPowerLensModal(false);
                          toast.success("Removed from cart!");
                        }}
                      >
                        Remove from Cart
                      </button>
                    ) : (
                      <button
                        className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 shadow-md transition-all duration-200 text-base md:text-lg"
                        onClick={() => {
                          addToCart({
                            product,
                            lens: selectedLens,
                            powerCategory: "zero power",
                          });
                          setShowPowerLensModal(false);
                          toast.success("Added to cart!");
                        }}
                      >
                        Add to Cart
                      </button>
                    );
                  } else if (
                    selectedLensType === "single-vision" ||
                    selectedLensType === "bifocal-progressive"
                  ) {
                    // Single Vision/Progressive: Open Add Power modal after lens selection
                    return inCart ? (
                      <button
                        className="w-full py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all duration-200 text-base md:text-lg"
                        onClick={() => {
                          removeByDetails({
                            product,
                            lens: selectedLens,
                            powerCategory: selectedLensType,
                          });
                          setShowPowerLensModal(false);
                          toast.success("Removed from cart!");
                        }}
                      >
                        Remove from Cart
                      </button>
                    ) : (
                      <button
                        className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 shadow-md transition-all duration-200 text-base md:text-lg"
                        onClick={() => {
                          setShowPowerLensModal(false);
                          setShowAddPowerModal(true);
                          setSelectedLensForPower(selectedLens);
                        }}
                      >
                        Continue
                      </button>
                    );
                  } else {
                    // Any other type: Add to cart directly
                    return inCart ? (
                      <button
                        className="w-full py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all duration-200 text-base md:text-lg"
                        onClick={() => {
                          removeByDetails({
                            product,
                            lens: selectedLens,
                            powerCategory: selectedLensType,
                          });
                          setShowPowerLensModal(false);
                          toast.success("Removed from cart!");
                        }}
                      >
                        Remove from Cart
                      </button>
                    ) : (
                      <button
                        className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 shadow-md transition-all duration-200 text-base md:text-lg"
                        onClick={() =>
                          selectedPowerLensId &&
                          selectedLensType &&
                          handleAddPowerToCart(selectedLensType, selectedLens)
                        }
                      >
                        Add to Cart
                      </button>
                    );
                  }
                })()}
              <div className="text-gray-400 text-xs md:text-sm text-center mt-1">
                Need help choosing?{" "}
                <span className="underline cursor-pointer">
                  Talk to our expert : 8905344556
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <AddPowerModal
        open={showAddPowerModal}
        onClose={() => {
          setShowAddPowerModal(false);
          setSelectedLensForPower(null);
        }}
        onSubmitPowerLater={handleAddToCartWithSubmitPowerLater}
        onEnterPowerManually={handleEnterPowerManually}
        onUploadPrescription={() => {
          setShowAddPowerModal(false);
          setShowUploadPrescriptionModal(true);
        }}
        onSelectSavedPower={handleSelectSavedPower}
        savedPowers={
          userProfile && "powers" in userProfile
            ? (userProfile as { powers: PowerEntry[] }).powers
            : []
        }
      />
      <EnterPowerManuallyModal
        open={showEnterPowerManuallyModal}
        onClose={() => {
          setShowEnterPowerManuallyModal(false);
          setSelectedLensForPower(null);
        }}
        onSubmit={handleManualPowerSubmit}
        lensCategory={
          selectedLensType === "bifocal-progressive" ||
          selectedLensType === "progressive"
            ? selectedLensType
            : undefined
        }
      />
      <UploadPrescriptionModal
        open={showUploadPrescriptionModal}
        onClose={() => {
          setShowUploadPrescriptionModal(false);
          setSelectedLensForPower(null);
        }}
        onSubmit={handleUploadPrescription}
      />
      {/* Saved Powers Modal/Drawer */}
      {showSavedPowersModal && (
        <div
          className="fixed inset-0 z-70 flex items-end md:items-stretch md:justify-end bg-black/40"
          onClick={() => setShowSavedPowersModal(false)}
        >
          <div
            className="w-full md:w-[50vw] bg-gradient-to-br from-[#f5faff] via-[#faf8f6] to-[#f0f4fa] rounded-t-2xl md:rounded-l-2xl shadow-2xl p-0 overflow-y-auto animate-slideInUp md:animate-slideInRight relative flex flex-col h-[100vh]"
            style={{ position: "relative", bottom: 0, right: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-2 border-b border-gray-100 bg-gradient-to-b from-white/90 to-[#faf8f6] backdrop-blur">
              <button
                className="p-2 mr-2"
                onClick={() => setShowSavedPowersModal(false)}
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="flex-1 text-center text-lg md:text-2xl font-bold text-gray-900 tracking-tight">
                Saved Powers
              </h2>
              <button
                className="p-2 ml-2"
                onClick={() => setShowSavedPowersModal(false)}
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-3 md:px-6 py-3 md:py-6">
              {(userProfile && "powers" in userProfile
                ? (userProfile as { powers: PowerEntry[] }).powers
                : []
              ).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Glasses className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-gray-600 text-lg">No saved powers found</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Add a new power to continue
                  </p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {(userProfile && "powers" in userProfile
                    ? (userProfile as { powers: PowerEntry[] }).powers
                    : []
                  ).map((power) => (
                    <div
                      key={power.id}
                      className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-5 hover:shadow-xl transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-base md:text-lg">
                            {power.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Phone: {power.phone}
                          </p>
                        </div>
                        <button
                          className="ml-3 bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/80 transition-colors text-sm font-medium"
                          onClick={() => handleSelectSpecificSavedPower(power)}
                        >
                          Select
                        </button>
                      </div>

                      {power.power_details && (
                        <div className="mb-3">
                          <p className="font-semibold text-gray-900 text-sm mb-2">
                            Power Details:
                          </p>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <ul className="list-disc list-inside space-y-1">
                              {Object.entries(power.power_details).map(
                                ([key, value]) => {
                                  if (
                                    key === "samePower" ||
                                    key === "cylindrical" ||
                                    key === "lensCategory"
                                  )
                                    return null;
                                  if (typeof value === "boolean") return null;
                                  if (!value || value === "") return null;
                                  return (
                                    <li
                                      key={key}
                                      className="text-xs md:text-sm text-gray-700"
                                    >
                                      <span className="font-medium">
                                        {key
                                          .replace(/([A-Z])/g, " $1")
                                          .replace(/^./, (str) =>
                                            str.toUpperCase()
                                          )}
                                        :
                                      </span>{" "}
                                      {value}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </div>
                        </div>
                      )}

                      {power.prescription_image_url && (
                        <div className="mb-3">
                          <p className="font-semibold text-gray-900 text-sm mb-2">
                            Prescription:
                          </p>
                          <a
                            href={power.prescription_image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                          >
                            View Prescription
                          </a>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 border-t pt-2">
                        Created:{" "}
                        {new Date(power.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="sticky bottom-0 z-10 px-3 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-gradient-to-t from-white/90 to-[#faf8f6]">
              <div className="text-gray-400 text-xs md:text-sm text-center">
                Need help choosing?{" "}
                <span className="underline cursor-pointer">
                  Talk to our expert : 8905344556
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
