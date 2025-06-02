"use client";

import React, { useState, useEffect } from "react";
import { Eye, Glasses, Sun, Star, Shield, Clock, Users, Heart } from "lucide-react";
import Navbar  from '../../components/Navbar'; // Assuming you have a Navbar component
import Footer from "../../components/Footer";
import Image from "next/image";


// Hero Slider Component
const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Revolutionary Eyewear Collection",
      subtitle: "Discover perfect style & comfort",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=300&fit=crop",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      title: "Premium Designer Frames",
      subtitle: "Elevate your look with luxury",
      image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&h=300&fit=crop",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      title: "Smart Vision Technology",
      subtitle: "Experience the future of optical wear",
      image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=800&h=300&fit=crop",
      gradient: "from-indigo-600 to-blue-600",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative md:h-[50vh] h-[20vh] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image src={slide.image} alt={slide.title} width={400} height={500} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg mb-4 opacity-90">
                {slide.subtitle}
              </p>
              <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 text-sm rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
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

  const categories = ["men", "women", "kids", "unisex"];

  const categoryData = {
    men: [
      {
        title: "Premium Spectacles",
        image: "https://images.unsplash.com/photo-1739237965255-a744c8dde2ae?q=80&w=400&auto=format&fit=crop",
        description: "Professional eyewear for modern gentleman",
      },
      {
        title: "Designer Sunglasses",
        image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&h=250&fit=crop",
        description: "Luxury sunglasses with UV protection",
      },
      {
        title: "Computer Glasses",
        image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop",
        description: "Blue light blocking technology",
      },
      {
        title: "Sports Frames",
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop",
        description: "Durable frames for active lifestyle",
      },
    ],
    women: [
      {
        title: "Elegant Frames",
        image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=250&fit=crop",
        description: "Sophisticated eyewear for every occasion",
      },
      {
        title: "Fashion Sunglasses",
        image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=250&fit=crop",
        description: "Trendy sunglasses for style-conscious women",
      },
      {
        title: "Cat Eye Collection",
        image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop",
        description: "Classic cat-eye designs reimagined",
      },
      {
        title: "Vintage Inspired",
        image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&h=250&fit=crop",
        description: "Retro styles with modern comfort",
      },
    ],
    kids: [
      {
        title: "Fun & Colorful",
        image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop",
        description: "Bright and playful designs for children",
      },
      {
        title: "Durable Frames",
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop",
        description: "Built to withstand active play",
      },
    ],
    unisex: [
      {
        title: "Universal Appeal",
        image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&h=250&fit=crop",
        description: "Timeless designs for everyone",
      },
      {
        title: "Minimalist Style",
        image: "https://images.unsplash.com/photo-1584036553516-bf83210aa16c?w=400&h=250&fit=crop",
        description: "Clean, simple aesthetics",
      },
    ],
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
              {categories.map((category) => (
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
        <div className={`grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 self-center"
        }`}>
          {categoryData[activeTab as keyof typeof categoryData].map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden max-h-[420px] flex flex-col justify-between rounded-xl bg-white/30 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
                <h3 className="text-[14px] md:text-lg font-bold mb-1 text-gray-800">{item.title}</h3>
                <p className="text-[12px] md:text-sm text-gray-600 mb-3">{item.description}</p>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 text-sm rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Explore
                </button>
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
          Experience the world through crystal-clear lenses with our advanced eye care technology
        </p>
        <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 text-sm md:text-base rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
          Schedule Eye Test
        </button>
      </div>
    </div>
  );
};

// Shop by Brands Section
const ShopByBrands = () => {
  const brands = [
    { name: "Ray-Ban", logo: "RB", color: "from-red-500 to-orange-500" },
    { name: "Oakley", logo: "OK", color: "from-blue-500 to-green-500" },
    { name: "Prada", logo: "PR", color: "from-purple-500 to-pink-500" },
    { name: "Gucci", logo: "GU", color: "from-green-500 to-teal-500" },
    { name: "Tom Ford", logo: "TF", color: "from-gray-700 to-gray-900" },
    { name: "Versace", logo: "VE", color: "from-yellow-500 to-orange-500" },
  ];

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Shop by Brands
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 aspect-square flex items-center justify-center"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${brand.color} flex items-center justify-center text-white font-bold text-xl mb-4`}>
                {brand.logo}
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <h3 className="text-sm font-bold text-gray-800">{brand.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Best Sellers Section
const BestSellers = () => {
  const bestSellers = [
    {
      name: "Classic Aviator",
      price: "$199",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&h=300&fit=crop",
      badge: "Best Seller"
    },
    {
      name: "Modern Square",
      price: "$149",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
      badge: "Top Rated"
    },
    {
      name: "Cat Eye Elegance",
      price: "$179",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=300&fit=crop",
      badge: "Trending"
    },
    {
      name: "Round Vintage",
      price: "$129",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=300&fit=crop",
      badge: "Popular"
    },
  ];

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Best Sellers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {item.badge}
                </span>
              </div>
              <div className="aspect-square overflow-hidden">
                <Image
                  width={400}
                  height={300}
                  loading="lazy"
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md md:text-lg font-bold mb-1 text-gray-800">{item.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(item.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({item.rating})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-md md:text-xl font-bold text-purple-600">{item.price}</span>
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
  );
};

// Shop by Shapes Section
const ShopByShapes = () => {
  const [selectedShape, setSelectedShape] = useState(0);

  const shapes = [
    {
      name: "Round",
      image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=400&fit=crop",
      description: "Classic round frames for a timeless look",
    },
    {
      name: "Square",
      image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&h=400&fit=crop",
      description: "Bold square frames for a modern edge",
    },
    {
      name: "Cat Eye",
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=400&fit=crop",
      description: "Elegant cat-eye frames for sophistication",
    },
    {
      name: "Aviator",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop",
      description: "Classic aviator style for adventure",
    },
    {
      name: "Wayfarer",
      image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=400&fit=crop",
      description: "Iconic wayfarer design for versatility",
    },
  ];

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Shop by Shapes
        </h2>

        <div className="flex flex-col items-center">
          {/* Preview Image */}
          <div className="w-full max-w-2xl mb-8">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/30 backdrop-blur-sm border border-white/50">
              <Image
                width={600}
                height={400}
                loading="lazy"
                src={shapes[selectedShape].image}
                alt={shapes[selectedShape].name}
                className="w-full h-64 md:h-96 object-cover transition-all duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  {shapes[selectedShape].name}
                </h3>
                <p className="text-sm md:text-lg opacity-90">
                  {shapes[selectedShape].description}
                </p>
              </div>
            </div>
          </div>

          {/* Shape Buttons */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 w-full max-w-4xl">
            {shapes.map((shape, index) => (
              <button
                key={index}
                onMouseEnter={() => setSelectedShape(index)}
                onClick={() => setSelectedShape(index)}
                className={`p-4 rounded-xl text-center transition-all duration-300 ${
                  selectedShape === index
                    ? "bg-white/60 backdrop-blur-sm shadow-xl scale-105 border-2 border-purple-300"
                    : "bg-white/30 backdrop-blur-sm hover:bg-white/50 border border-black/10"
                }`}
              >
                <h3 className="text-sm md:text-lg font-bold text-gray-800 mb-1">
                  {shape.name}
                </h3>
                <p className="text-xs text-gray-600 hidden md:block">{shape.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Info Section
const ProductInfoSection = () => {
  const productTypes = [
    {
      icon: Glasses,
      title: "Eyeglasses",
      description: "Precision-crafted prescription lenses with designer frames for optimal vision correction and style.",
      features: ["Anti-glare coating", "UV protection", "Scratch-resistant", "Custom prescriptions"],
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Sun,
      title: "Sunglasses",
      description: "Premium UV protection sunglasses that combine fashion with function for all-day comfort.",
      features: ["100% UV protection", "Polarized lenses", "Impact-resistant", "Stylish designs"],
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Eye,
      title: "Specialty Frames",
      description: "Innovative eyewear solutions including blue light blocking glasses and sports frames.",
      features: ["Blue light filtering", "Lightweight materials", "Flexible hinges", "Sport-specific designs"],
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent">
          Why Choose Our Eyewear?
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover our comprehensive range of premium eyewear designed for every lifestyle and vision need.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {productTypes.map((product, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${product.color} flex items-center justify-center mb-6`}>
                <product.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">{product.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
              
              <div className="space-y-3">
                {product.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${product.color} mr-3`}></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className={`w-full mt-6 bg-gradient-to-r ${product.color} text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold`}>
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: "Lifetime Warranty", desc: "Premium protection for your investment" },
            { icon: Clock, title: "Fast Delivery", desc: "Quick shipping to your doorstep" },
            { icon: Users, title: "Expert Support", desc: "Professional guidance and advice" },
            { icon: Heart, title: "Customer Love", desc: "99% satisfaction guarantee" }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50">
              <feature.icon className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
              <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Product Categories Section
const ProductCategories = () => {
  const categories = [
    {
      title: "Sunglasses",
      icon: Sun,
      image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500&h=400&fit=crop",
      description: "Premium UV protection with style",
      gradient: "from-orange-400 to-red-500",
    },
    {
      title: "Eyeglasses",
      icon: Glasses,
      image: "https://images.unsplash.com/photo-1653038282366-09ae0df227be?q=80&w=400&auto=format&fit=crop",
      description: "Prescription lenses for perfect vision",
      gradient: "from-blue-400 to-purple-500",
    },
    {
      title: "Frames",
      icon: Eye,
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=400&fit=crop",
      description: "Designer frames for every style",
      gradient: "from-green-400 to-blue-500",
    },
  ];

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 text-white">
          Our Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  width={500}
                  height={400}
                  loading="lazy"
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <category.icon className="w-10 h-10 md:w-12 md:h-12 mb-4 text-blue-400" />
                <h3 className="text-xl md:text-2xl font-bold mb-2">{category.title}</h3>
                <p className="text-sm md:text-lg opacity-90 mb-4 md:mb-6">
                  {category.description}
                </p>
                <button
                  className={`w-full bg-gradient-to-r ${category.gradient} text-white py-2 md:py-3 text-sm md:text-base rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Home Component
export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSlider />
      <CategoryTabs />
      <VisionCareSection />
      <ShopByBrands />
      <BestSellers />
      <ShopByShapes />
      <ProductInfoSection />
      <ProductCategories />
      <Footer />
    </div>
  );
}