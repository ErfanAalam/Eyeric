"use client";

import React, { useState, useEffect } from "react";
import { Eye, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import {
  heroSlides,
  categoryData,
  // brands,
  shapes,
  // productTypes,
  // features,
  // productCategories,
} from "../data/homeData";
import {
  getHeroSlides,
  getCategoryData,
  // getBrands,
  getShapes,
  // getProductTypes,
  // getFeatures,
  // getProductCategories,
} from "../services/homeService";
import productData from "../../productData";

// Hero Slider Component
const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(heroSlides);

  useEffect(() => {
    const fetchSlides = async () => {
      const data = await getHeroSlides();
      if (data.length > 0) {
        setSlides(data);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative md:h-[50vh] h-[30vh] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            width={2400}
            height={1600}
            className="w-full h-full object-center"
            quality={100}
          />
        </div>
      ))}

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
const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState("men");
  const [categories, setCategories] = useState(categoryData);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategoryData();
      if (Object.keys(data).length > 0) {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  const categoryKeys = Object.keys(categories);

  const handleCategoryClick = (category: string, title: string) => {
    // Map the title to the correct product type
    const type = title.toLowerCase();
    
    // Map the category to match productData gender values
    const mappedCategory = category.toLowerCase();
    
    console.log("Navigating to:", {
      category: mappedCategory,
      type: type
    });
    
    router.push(`/products?category=${mappedCategory}&type=${type}`);
  };

  return (
    <div className="py-10 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Shop by Categories
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
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 self-center">
          {categories[activeTab]?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(activeTab, item.title)}
              className="group relative overflow-hidden max-h-[420px] flex flex-col justify-between rounded-xl bg-white/30 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  width={400}
                  height={300}
                  loading="lazy"
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-[12px] md:text-lg font-bold mb-1 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-[12px] md:text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Vision Care Section
const VisionCareSection = () => {
  return (
    <div className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
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

// Shop by Brands Section
// const ShopByBrands = () => {
//   const [brandList, setBrandList] = useState(brands);

//   useEffect(() => {
//     const fetchBrands = async () => {
//       const data = await getBrands();
//       if (data.length > 0) {
//         setBrandList(data);
//       }
//     };
//     fetchBrands();
//   }, []);

//   return (
//     <div className="py-16 px-4 bg-gradient-to-br from-gray-100 to-blue-100">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Shop by Brands
//         </h2>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//           {brandList.map((brand, index) => (
//             <div
//               key={index}
//               className="group relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 aspect-square flex items-center justify-center"
//             >
//               <div
//                 className={`w-16 h-16 rounded-full bg-gradient-to-r ${brand.color} flex items-center justify-center text-white font-bold text-xl mb-4`}
//               >
//                 {brand.logo}
//               </div>
//               <div className="absolute bottom-4 left-0 right-0 text-center">
//                 <h3 className="text-sm font-bold text-gray-800">
//                   {brand.name}
//                 </h3>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// Best Sellers Section
const BestSellers = () => {
  const sellers = productData.slice(0, 8);

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Best Sellers
        </h2>
        <div className="relative">
          <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex space-x-6 min-w-min">
              {sellers
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((item, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-none w-[280px] md:w-[320px] flex flex-col"
                  >
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Best Seller
                      </span>
                    </div>
                    <div className="aspect-square overflow-hidden">
                      <Image
                        width={400}
                        height={300}
                        loading="lazy"
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-md md:text-lg font-bold mb-2 text-gray-800 line-clamp-2 min-h-[3.5rem]">
                        {item.title}
                      </h3>
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            (4.5)
                          </span>
                        </div>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-md md:text-xl font-bold text-purple-600">
                          ${item.price}
                        </span>
                        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-sm rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                          Add to Cart
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
const LatestTrends = () => {
  const trends = productData.slice(8, 16); // Get next 8 products after best sellers

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Latest Trends
        </h2>
        <div className="relative">
          <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex space-x-6 min-w-min">
              {trends
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((item, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-none w-[280px] md:w-[320px] flex flex-col"
                  >
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        New Trend
                      </span>
                    </div>
                    <div className="aspect-square overflow-hidden">
                      <Image
                        width={400}
                        height={300}
                        loading="lazy"
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-md md:text-lg font-bold mb-2 text-gray-800 line-clamp-2 min-h-[3.5rem]">
                        {item.title}
                      </h3>
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            (4.5)
                          </span>
                        </div>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-md md:text-xl font-bold text-blue-600">
                          ${item.price}
                        </span>
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-sm rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                          Add to Cart
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
const ShopByShapes = () => {
  const [selectedShape, setSelectedShape] = useState(0);
  const [shapeList, setShapeList] = useState(shapes);
  const router = useRouter();

  useEffect(() => {
    const fetchShapes = async () => {
      const data = await getShapes();
      if (data.length > 0) {
        setShapeList(data);
      }
    };
    fetchShapes();
  }, []);

  const handleShapeClick = (shape: string) => {
    const formattedShape = shape.toLowerCase().replace(/\s+/g, '-');
    router.push(`/shape-products?shape=${formattedShape}`);
  };

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Shop by Shapes
        </h2>

        <div className="flex flex-col items-center">
          {/* Preview Image */}
          <div className="w-full max-w-2xl mb-8">
            <div 
              className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/30 backdrop-blur-sm border border-white/50 cursor-pointer hover:shadow-3xl transition-all duration-500"
              onClick={() => handleShapeClick(shapeList[selectedShape].name)}
            >
              <Image
                width={600}
                height={400}
                loading="lazy"
                src={shapeList[selectedShape].image}
                alt={shapeList[selectedShape].name}
                className="w-full h-64 md:h-96 object-cover transition-all duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  {shapeList[selectedShape].name}
                </h3>
                <p className="text-sm md:text-lg opacity-90">
                  {shapeList[selectedShape].description}
                </p>
                <div className="mt-4 text-sm text-white/80">
                  Click to view all {shapeList[selectedShape].name.toLowerCase()} shaped products
                </div>
              </div>
            </div>
          </div>

          {/* Shape Buttons */}
          <div className="overflow-x-auto pb-4 px-4 py-2 w-full max-w-4xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex space-x-4 min-w-min">
              {shapeList.map((shape, index) => (
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
                    {shape.name}
                  </h3>
                  <p className="text-xs text-gray-600 hidden md:block">
                    {shape.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Info Section
// const ProductInfoSection = () => {
//   const [types, setTypes] = useState(productTypes);
//   const [featureList, setFeatureList] = useState(features);

//   useEffect(() => {
//     const fetchData = async () => {
//       const [typesData, featuresData] = await Promise.all([
//         getProductTypes(),
//         getFeatures(),
//       ]);

//       if (typesData.length > 0) {
//         setTypes(typesData);
//       }
//       if (featuresData.length > 0) {
//         setFeatureList(featuresData);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="py-16 px-4 bg-gradient-to-br from-gray-50 to-indigo-50">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent">
//           Why Choose Our Eyewear?
//         </h2>
//         <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
//           Discover our comprehensive range of premium eyewear designed for every
//           lifestyle and vision need.
//         </p>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {types.map((product, index) => (
//             <div
//               key={index}
//               className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50"
//             >
//               <div
//                 className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${product.color} flex items-center justify-center mb-6`}
//               >
//                 <product.icon className="w-8 h-8 text-white" />
//               </div>

//               <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
//                 {product.title}
//               </h3>
//               <p className="text-gray-600 mb-6 leading-relaxed">
//                 {product.description}
//               </p>

//               <div className="space-y-3">
//                 {product.features.map((feature, featureIndex) => (
//                   <div key={featureIndex} className="flex items-center">
//                     <div
//                       className={`w-2 h-2 rounded-full bg-gradient-to-r ${product.color} mr-3`}
//                     ></div>
//                     <span className="text-sm text-gray-700">{feature}</span>
//                   </div>
//                 ))}
//               </div>

//               <button
//                 className={`w-full mt-6 bg-gradient-to-r ${product.color} text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold`}
//               >
//                 Learn More
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Additional Features */}
//         <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
//           {featureList.map((feature, index) => (
//             <div
//               key={index}
//               className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50"
//             >
//               <feature.icon className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
//               <h4 className="font-semibold text-gray-800 mb-1">
//                 {feature.title}
//               </h4>
//               <p className="text-sm text-gray-600">{feature.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Product Categories Section
// const ProductCategories = () => {
//   const [categories, setCategories] = useState(productCategories);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const data = await getProductCategories();
//       if (data.length > 0) {
//         setCategories(data);
//       }
//     };
//     fetchCategories();
//   }, []);

//   return (
//     <div className="py-16 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 text-white">
//           Our Collections
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {categories.map((category, index) => (
//             <div
//               key={index}
//               className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4"
//             >
//               <div className="aspect-square overflow-hidden">
//                 <Image
//                   width={500}
//                   height={400}
//                   loading="lazy"
//                   src={category.image}
//                   alt={category.title}
//                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
//                 />
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
//               <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
//                 <category.icon className="w-10 h-10 md:w-12 md:h-12 mb-4 text-blue-400" />
//                 <h3 className="text-xl md:text-2xl font-bold mb-2">
//                   {category.title}
//                 </h3>
//                 <p className="text-sm md:text-lg opacity-90 mb-4 md:mb-6">
//                   {category.description}
//                 </p>
//                 <button
//                   className={`w-full bg-gradient-to-r ${category.gradient} text-white py-2 md:py-3 text-sm md:text-base rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
//                 >
//                   Shop Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// Main Home Component

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSlider />
      <CategoryTabs />
      <VisionCareSection />
      {/* <ShopByBrands /> */}
      <ShopByShapes />
      <BestSellers />
      <LatestTrends />
      {/* <ProductInfoSection /> */}
      {/* <ProductCategories /> */}
      <Footer />
    </div>
  );
}
