"use client";

import React, { useState, useEffect } from "react";
import { Eye, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
// import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import {
  // heroSlides, // Removed unused import
  // brands,
  // productTypes,
  // features,
  // productCategories,
  makeInIndia,
} from "../data/homeData";
import {
  // getHeroSlides, // Removed unused import
  getProducts,
  getSlides,
  getCategoryBanners,
  getShapeBanners,
} from "../services/homeService";
import { useHasMounted } from "../hooks/useHasMounted";
import colors from "../constants/colors";

// Define Product type locally
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
  shape_category: string;
  tags: string[];
  gender_category: string[];
  type_category: string[];
  created_at?: string;
  updated_at?: string;
}

// Define Slide type for hero slider
interface Slide {
  image_url?: string;
  image?: string;
  redirect_url?: string;
}

// Utility function to truncate description to 5 words
function truncateDescription(desc: string): string {
  if (!desc) return "";
  const words = desc.split(" ");
  if (words.length <= 4) return desc;
  return words.slice(0, 4).join(" ") + "...";
}

// console.log(colors)

// Hero Slider Component
const HeroSlider = ({ slides }: { slides: Slide[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSlideClick = (slide: Slide) => {
    if (slide.redirect_url) {
      window.open(slide.redirect_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative md:h-[65vh] h-[30vh] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <div 
            className={`w-full h-full aspect-video bg-gray-200 ${slide.redirect_url ? 'cursor-pointer' : ''}`}
            onClick={() => handleSlideClick(slide)}
          >
            <Image
              src={slide.image_url || slide.image}
              alt="slide"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="w-full h-full object-cover object-center"
              quality={90}
              sizes="(max-width: 768px) 100vw, 100vw"
              placeholder="blur"
              blurDataURL="/placeholder.png"
            />
            {/* {slide.redirect_url && (
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-gray-800">
                  Click to learn more
                </div>
              </div>
            )} */}
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      
      {/* Dots Navigation */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Category Tabs Component
interface CategoryBanner {
  gender?: string;
  type_category?: string;
  image_url: string;
}
const CategoryTabs = ({
  products,
  categoryBanners,
}: {
  products: Product[];
  categoryBanners: CategoryBanner[];
}) => {
  const [activeTab, setActiveTab] = useState("men");
  const router = useRouter();

  // Get all unique type categories from products
  const typeTitles = Array.from(
    new Set(
      products.flatMap((p) =>
        Array.isArray(p.type_category) ? p.type_category : []
      )
    )
  );
  const categoryKeys = ["men", "women", "kids"];

  // For kids, only show eyeglasses and computer glasses
  const kidsAllowedTypes = ["eyeglasses", "computer glasses"];

  // Build categories object dynamically from products
  const dynamicCategories: {
    [key: string]: { title: string; image: string; description: string }[];
  } = {};
  categoryKeys.forEach((gender) => {
    dynamicCategories[gender] = typeTitles
      .filter((type) =>
        gender === "kids" ? kidsAllowedTypes.includes(type.toLowerCase()) : true
      )
      .map((type) => {
        // Find a banner for this gender/type
        const banner = categoryBanners.find(
          (b: CategoryBanner) =>
            b.gender?.toLowerCase() === gender &&
            b.type_category?.toLowerCase() === type.toLowerCase()
        );
        // Fallback to product image if no banner
        const match = products.find(
          (p) =>
            Array.isArray(p.gender_category) &&
            p.gender_category.map((g) => g.toLowerCase()).includes(gender) &&
            Array.isArray(p.type_category) &&
            p.type_category
              .map((t) => t.toLowerCase())
              .includes(type.toLowerCase())
        );
        return banner
          ? {
              title: type,
              image: banner.image_url,
              description: match
                ? truncateDescription(match.description || "")
                : "",
            }
          : match
          ? {
              title: type,
              image: match.banner_image_1 || match.banner_image_2 || "",
              description: truncateDescription(match.description || ""),
            }
          : {
              title: type,
              image: "",
              description: "",
            };
      });
  });

  const handleCategoryClick = (category: string, title: string) => {
    const type = title.toLowerCase();
    const mappedCategory = category.toLowerCase();
    router.push(`/products?category=${mappedCategory}&type=${type}`);
  };

  return (
    <div className="py-10 px-4 bg-background text-text">
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-2xl md:text-4xl font-semibold text-center mb-8 bg-text bg-clip-text text-transparent`}
        >
          Pick Your Look
        </h2>
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-full p-1 border border-white/50 shadow-lg">
            <div className="flex flex-wrap justify-center">
              {categoryKeys.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-3 sm:px-4 md:px-6 py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 capitalize m-0.5 ${
                    activeTab === category
                      ? `bg-primary text-white shadow-lg transform scale-105`
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Category Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 self-center">
          {dynamicCategories[activeTab]?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(activeTab, item.title)}
              className="group relative overflow-hidden max-h-[520px] max-w-[300px] flex flex-col justify-between rounded-xl bg-white/30 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="aspect-[4/3] w-full h-full md:h-[300px] bg-gray-100 overflow-hidden flex items-center justify-center relative">
                {item.image ? (
                  <Image
                    fill
                    src={item.image}
                    alt={item.title}
                    className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-110"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 400px"
                    placeholder="blur"
                    blurDataURL="/placeholder.png"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-[12px] md:text-lg font-bold mb-1 text-gray-800">
                  {item.title.toUpperCase()}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Best Sellers Section
const BestSellers = ({ products }: { products: Product[] }) => {
  const sellers = (products || [])
    .filter((p) => p.bestseller)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .slice(0, 8);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const router = useRouter();
  const { addToFavorites, removeFromFavorites, isFavorite, isLoggedIn } =
    useFavorites();

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
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

  // Calculate discount percentage
  const calculateDiscount = (original: number, discounted: number) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  return (
    <div className="py-16 px-4 bg-background text-text">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-semibold text-center mb-12 bg-text bg-clip-text text-transparent">
          Best Sellers
        </h2>
        <div className="relative">
          <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex space-x-6 min-w-min">
              {sellers.map((item, index) => (
                <div
                  key={item.id || index}
                  className="group relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-none w-[200px] md:w-[320px] flex flex-col cursor-pointer max-h-[300px] md:max-h-[420px]"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleProductClick(item)}
                >
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Sale
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleFavoriteClick(e, item)}
                    className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-300 group-hover:bg-white"
                  >
                    <Heart
                      size={20}
                      className={`transition-all duration-300 ${
                        isFavorite(item.id!)
                          ? "text-red-500 fill-current"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>

                  <div className="aspect-square overflow-hidden">
                    <Image
                      width={400}
                      height={300}
                      loading="lazy"
                      src={
                        hoveredIndex === index && item.banner_image_2
                          ? item.banner_image_2
                          : item.banner_image_1 || item.banner_image_2 || ""
                      }
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-md md:text-lg font-bold mb-2 text-gray-800 line-clamp-2 min-h-[3.5rem]">
                      {item.title}
                    </h3>
                    {item.discounted_price && (
                      <>
                        <span className="text-xs md:text-sm w-fit font-semibold text-green-600 bg-green-100 px-1 py-0.5 rounded">
                          {calculateDiscount(
                            item.original_price,
                            item.discounted_price
                          )}
                          % OFF
                        </span>
                      </>
                    )}

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-md md:text-xl font-bold text-text">
                          ₹{item.discounted_price || item.original_price}
                        </span>
                        {item.discounted_price && (
                          <>
                            <span className="text-md md:text-xl font-bold text-gray-500">
                              <del>₹{item.original_price}</del>
                            </span>
                            {/* <span className="text-xs md:text-sm font-semibold text-green-600 bg-green-100 px-1 py-0.5 rounded">
                              {calculateDiscount(item.original_price, item.discounted_price)}% OFF
                            </span> */}
                          </>
                        )}
                      </div>
                      <button
                        className="bg-primary text-white px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-sm rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        onClick={() => handleProductClick(item)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Latest Trends Section
const LatestTrends = ({ products }: { products: Product[] }) => {
  const trends = (products || [])
    .filter((p) => p.latest_trend)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .slice(0, 8);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const router = useRouter();
  const { addToFavorites, removeFromFavorites, isFavorite, isLoggedIn } =
    useFavorites();

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
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

  // Calculate discount percentage
  const calculateDiscount = (original: number, discounted: number) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  return (
    <div className="py-16 px-4 bg-backgrond text-text`">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-text bg-clip-text text-transparent">
          Latest Trends
        </h2>
        <div className="relative">
          <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex space-x-6 min-w-min">
              {trends.map((item, index) => (
                <div
                  key={item.id || index}
                  className="group relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-none w-[200px] md:w-[320px] flex flex-col cursor-pointer max-h-[300px] md:max-h-[420px]"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleProductClick(item)}
                >
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Sale
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleFavoriteClick(e, item)}
                    className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-300 group-hover:bg-white"
                  >
                    <Heart
                      size={20}
                      className={`transition-all duration-300 ${
                        isFavorite(item.id!)
                          ? "text-red-500 fill-current"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>

                  <div className="aspect-square overflow-hidden">
                    <Image
                      width={400}
                      height={300}
                      loading="lazy"
                      src={
                        hoveredIndex === index && item.banner_image_2
                          ? item.banner_image_2
                          : item.banner_image_1 || item.banner_image_2 || ""
                      }
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-md md:text-lg font-bold mb-2 text-gray-800 line-clamp-2 min-h-[3.5rem]">
                      {item.title}
                    </h3>
                    {item.discounted_price && (
                      <>
                        <span className="text-xs md:text-sm w-fit font-semibold text-green-600 bg-green-100 px-1 py-0.5 rounded">
                          {calculateDiscount(
                            item.original_price,
                            item.discounted_price
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-md md:text-xl font-bold text-text">
                          ₹{item.discounted_price || item.original_price}
                        </span>
                        {item.discounted_price && (
                          <>
                            <span className="text-md md:text-xl font-bold text-gray-500">
                              <del>₹{item.original_price}</del>
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        className="bg-primary text-white px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-sm rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        onClick={() => handleProductClick(item)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shop by Shapes Section
interface ShapeBanner {
  shape?: string;
  image_url: string;
}
const ShopByShapes = ({
  products,
  shapeBanners,
}: {
  products: Product[];
  shapeBanners: ShapeBanner[];
}) => {
  // Get unique shapes from products
  const uniqueShapes: Product[] = [
    ...new Map(
      (products || [])
        .filter((p) => p.shape_category)
        .map((p) => [String(p.shape_category).toLowerCase(), p])
    ).values(),
  ];
  const [selectedShape, setSelectedShape] = useState(0);
  const router = useRouter();
  const getShapeBanner = (shape: string) =>
    shapeBanners.find(
      (b: ShapeBanner) => b.shape?.toLowerCase() === shape?.toLowerCase()
    );

  const handleShapeClick = (shape: string) => {
    const formattedShape = shape.toLowerCase().replace(/\s+/g, "-");
    router.push(`/shape-products?shape=${formattedShape}`);
  };

  const handlePrevious = () => {
    setSelectedShape((prev) => (prev === 0 ? uniqueShapes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedShape((prev) => (prev === uniqueShapes.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-background text-text py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-text bg-clip-text text-transparent">
          Shop by Shapes
        </h2>
        <div className="flex flex-col items-center">
          {/* Preview Image */}
          <div className="w-full max-w-2xl mb-8 relative">
            {uniqueShapes[selectedShape] && (
              <div
                className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/30 backdrop-blur-sm border border-white/50 cursor-pointer hover:shadow-3xl transition-all duration-500"
                onClick={() =>
                  handleShapeClick(
                    String(uniqueShapes[selectedShape].shape_category)
                  )
                }
              >
                <div className="aspect-[4/3] w-full bg-gray-100">
                  <Image
                    fill
                    src={
                      getShapeBanner(
                        String(uniqueShapes[selectedShape].shape_category)
                      )?.image_url ||
                      uniqueShapes[selectedShape].banner_image_1 ||
                      uniqueShapes[selectedShape].banner_image_2 ||
                      ""
                    }
                    alt={String(uniqueShapes[selectedShape].shape_category)}
                    className="object-cover object-center w-full h-full transition-all duration-500"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 600px"
                    placeholder="blur"
                    blurDataURL="/placeholder.png"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6 text-text">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    {uniqueShapes[selectedShape].shape_category
                      .charAt(0)
                      .toUpperCase() +
                      uniqueShapes[selectedShape].shape_category.slice(1)}
                  </h3>
                  <div className="mt-4 text-sm text-text/80">
                    Click to view all{" "}
                    {String(
                      uniqueShapes[selectedShape].shape_category
                    )?.toLowerCase()}{" "}
                    shaped products
                  </div>
                </div>
                
                {/* Navigation Buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {/* Shape Buttons */}
          <div className="overflow-x-auto pb-4 px-4 py-2 w-full max-w-4xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex space-x-4 min-w-min">
              {uniqueShapes.map((shape, index) => (
                <button
                  key={index}
                  onMouseEnter={() => setSelectedShape(index)}
                  onClick={() => setSelectedShape(index)}
                  className={`p-4 rounded-xl text-center transition-all duration-300 flex-none ${
                    selectedShape === index
                      ? "bg-white/60 backdrop-blur-sm shadow-xl scale-105 border-2 border-purple-300"
                      : "bg-white/30 backdrop-blur-sm hover:bg-white/50 border border-black/10"
                  }`}
                >
                  <h3 className="text-sm md:text-lg font-bold text-gray-800 mb-1">
                    {shape.shape_category.toUpperCase()}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Vision Care Section
const VisionCareSection = () => {
  return (
    <div className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden bg-text">
      <div className="absolute inset-0 bg-black/30" />
      <Image
        width={1200}
        height={600}
        loading="lazy"
        src="https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=1200&h=600&fit=crop"
        alt="Eye care"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <Eye className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-blue-400" />
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
          Your Vision, Our Priority
        </h2>
        <p className="text-sm md:text-lg lg:text-xl mb-6 opacity-90">
          Experience the world through crystal-clear lenses with our advanced
          eye care technology
        </p>
        <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 text-sm md:text-base rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
          Schedule Eye Test
        </button>
      </div>
    </div>
  );
};

// Make In India Banner Section
const MakeInIndia = () => (
  <div
    style={{ background: colors.background, color: colors.text }}
    className="py-12 flex flex-col items-center text-center"
  >
    <div className="mb-2 text-sm md:text-base text-gray-700">
      Styled By {makeInIndia.styledBy}
    </div>
    <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-2 text-gray-900">
      {makeInIndia.title}
    </h2>
    <div className="font-bold text-lg md:text-xl mb-6 text-gray-800">
      {makeInIndia.subtitle}
    </div>
    <a href={makeInIndia.buttonUrl}>
      <button className="bg-primary text-white px-8 py-3 rounded-md text-base font-medium hover:bg-gray-900 transition-all">
        {makeInIndia.buttonText}
      </button>
    </a>
  </div>
);

const HowToKnowFaceSize = () => {
  const router = useRouter();
  return (
    <div
      style={{ background: colors.background, color: colors.text }}
      className="py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-text bg-clip-text text-transparent">
            Find Your Perfect Fit
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Choosing the right frame size is crucial for comfort and style. Our
            comprehensive size guide helps you measure your face and find frames
            that complement your features perfectly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📏</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Measure Your Face
            </h3>
            <p className="text-sm text-gray-600">
              Learn how to accurately measure your face width, temple length,
              and bridge size.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">👓</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Frame Sizing Guide
            </h3>
            <p className="text-sm text-gray-600">
              Understand frame measurements and how they correspond to your face
              measurements.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Style Tips
            </h3>
            <p className="text-sm text-gray-600">
              Discover which frame styles work best for your face shape and
              size.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            className="bg-primary text-white px-8 py-3 rounded-full text-base font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => router.push("/size-guide")}
          >
            View Size Guide
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Need help? Our experts are ready to assist you
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Home Component

export default function Home() {
  const hasMounted = useHasMounted();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [categoryBanners, setCategoryBanners] = React.useState<
    CategoryBanner[]
  >([]);
  const [shapeBanners, setShapeBanners] = React.useState<ShapeBanner[]>([]);

  React.useEffect(() => {
    const fetchAll = async () => {
      const [productsData, slidesData, categoryBannersData, shapeBannersData] =
        await Promise.all([
          getProducts(),
          getSlides(),
          getCategoryBanners(),
          getShapeBanners(),
        ]);
      setProducts(productsData as unknown as Product[]);
      setSlides(slidesData);
      setCategoryBanners(categoryBannersData);
      setShapeBanners(shapeBannersData);
    };
    fetchAll();
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* <WelcomeSection /> */}
      <HeroSlider slides={slides} />
      <CategoryTabs products={products} categoryBanners={categoryBanners} />
      <VisionCareSection />
      <BestSellers products={products} />
      <LatestTrends products={products} />
      <ShopByShapes products={products} shapeBanners={shapeBanners} />
      <HowToKnowFaceSize />
      <MakeInIndia />
      <Footer />
    </div>
  );
}
