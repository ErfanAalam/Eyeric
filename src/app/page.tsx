"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Eye, Glasses, Sun } from "lucide-react";
import Footer from "../../components/Footer";

// Hero Slider Component
const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Revolutionary Eyewear Collection",
      subtitle: "Discover the perfect blend of style and comfort",
      image:
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=600&fit=crop",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      title: "Premium Designer Frames",
      subtitle: "Elevate your look with luxury eyewear",
      image:
        "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&h=600&fit=crop",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      title: "Smart Vision Technology",
      subtitle: "Experience the future of optical wear",
      image:
        "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=800&h=600&fit=crop",
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
    <div className="relative h-[70vh] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up delay-200">
                {slide.subtitle}
              </p>
              <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-400">
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
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

  const categories = ["men", "women", "kids", "unisex"];

  const categoryData = {
    men: [
      {
        title: "Premium Spectacles",
        image:
          "https://images.unsplash.com/photo-1739237965255-a744c8dde2ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Professional eyewear for the modern gentleman",
      },
      {
        title: "Designer Sunglasses",
        image:
          "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&h=300&fit=crop",
        description: "Luxury sunglasses with UV protection",
      },
      {
        title: "Computer Glasses",
        image:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
        description: "Blue light blocking technology",
      },
      {
        title: "Sports Frames",
        image:
          "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=300&fit=crop",
        description: "Durable frames for active lifestyle",
      },
    ],
    women: [
      {
        title: "Elegant Frames",
        image:
          "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=300&fit=crop",
        description: "Sophisticated eyewear for every occasion",
      },
      {
        title: "Fashion Sunglasses",
        image:
          "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=300&fit=crop",
        description: "Trendy sunglasses for style-conscious women",
      },
      {
        title: "Cat Eye Collection",
        image:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
        description: "Classic cat-eye designs reimagined",
      },
      {
        title: "Vintage Inspired",
        image:
          "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&h=300&fit=crop",
        description: "Retro styles with modern comfort",
      },
    ],
    kids: [
      {
        title: "Fun & Colorful",
        image:
          "https://www.zeiss.com/content/dam/vis-b2c/reference-master/images/better-vision/health-prevention/the-right-spectacle-frames-for-children/zeiss_the-right-spectacle-frames-for-children.jpg",
        description: "Bright and playful designs for children",
      },
      {
        title: "Durable Frames",
        image:
          "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=300&fit=crop",
        description: "Built to withstand active play",
      },
      {
        title: "Safety First",
        image:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
        description: "Child-safe materials and designs",
      },
      {
        title: "Growing Collection",
        image:
          "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=300&fit=crop",
        description: "Adjustable frames that grow with your child",
      },
    ],
    unisex: [
      {
        title: "Universal Appeal",
        image:
          "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&h=300&fit=crop",
        description: "Timeless designs for everyone",
      },
      {
        title: "Minimalist Style",
        image:
          "https://images.unsplash.com/photo-1584036553516-bf83210aa16c?q=80&w=1960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Clean, simple aesthetics",
      },
      {
        title: "Versatile Frames",
        image:
          "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=300&fit=crop",
        description: "Perfect for any face shape",
      },
      {
        title: "Classic Collection",
        image:
          "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=300&fit=crop",
        description: "Enduring styles that never go out of fashion",
      },
    ],
  };

  return (
    <div className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Shop by Categories
        </h2>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-full p-2 border border-white/50 shadow-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 capitalize ${
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

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoryData[activeTab as keyof typeof categoryData].map(
            (item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white/30 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Explore
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// Vision Care Section
const VisionCareSection = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="absolute inset-0 bg-black/30" />
      <img
        src="https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=1200&h=800&fit=crop"
        alt="Eye care"
        className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
      />
      <div className="relative z-10 text-center text-white px-4 max-w-4xl animate-fade-in-up">
        <Eye className="w-20 h-20 mx-auto mb-8 text-blue-400" />
        <h2 className="text-5xl md:text-7xl font-bold mb-6">
          Your Vision, Our Priority
        </h2>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Experience the world through crystal-clear lenses with our advanced
          eye care technology
        </p>
        <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
          Schedule Eye Test
        </button>
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
      image:
        "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=400&fit=crop",
      description: "Classic round frames for a timeless look",
    },
    {
      name: "Square",
      image:
        "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&h=400&fit=crop",
      description: "Bold square frames for a modern edge",
    },
    {
      name: "Cat Eye",
      image:
        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=400&fit=crop",
      description: "Elegant cat-eye frames for sophistication",
    },
    {
      name: "Aviator",
      image:
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop",
      description: "Classic aviator style for adventure",
    },
    {
      name: "Wayfarer",
      image:
        "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=400&fit=crop",
      description: "Iconic wayfarer design for versatility",
    },
  ];

  return (
    <div className="py-20 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Shop by Shapes
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Preview Image */}
          <div className="order-1 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/30 backdrop-blur-sm border border-white/50">
              <img
                src={shapes[selectedShape].image}
                alt={shapes[selectedShape].name}
                className="w-full h-96 object-cover transition-all duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {shapes[selectedShape].name}
                </h3>
                <p className="text-lg opacity-90">
                  {shapes[selectedShape].description}
                </p>
              </div>
            </div>
          </div>

          {/* Shape Cards */}
          <div className="order-2 lg:order-2 space-y-4">
            {shapes.map((shape, index) => (
              <div
                key={index}
                onMouseEnter={() => setSelectedShape(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  selectedShape === index
                    ? "bg-white/60 backdrop-blur-sm shadow-xl scale-105 border-purple-200"
                    : "bg-white/30 backdrop-blur-sm hover:bg-white/50 border-white/30"
                } border`}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {shape.name}
                </h3>
                <p className="text-gray-600">{shape.description}</p>
              </div>
            ))}
          </div>
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
      image:
        "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500&h=400&fit=crop",
      description: "Premium UV protection with style",
      gradient: "from-orange-400 to-red-500",
    },
    {
      title: "Eyeglasses",
      icon: Glasses,
      image:
        "https://images.unsplash.com/photo-1653038282366-09ae0df227be?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Prescription lenses for perfect vision",
      gradient: "from-blue-400 to-purple-500",
    },
    {
      title: "Frames",
      icon: Eye,
      image:
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=400&fit=crop",
      description: "Designer frames for every style",
      gradient: "from-green-400 to-blue-500",
    },
  ];

  return (
    <div className="py-20 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
          Our Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <category.icon className="w-12 h-12 mb-4 text-blue-400" />
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <p className="text-lg opacity-90 mb-6">
                  {category.description}
                </p>
                <button
                  className={`w-full bg-gradient-to-r ${category.gradient} text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
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
      <ShopByShapes />
      <ProductCategories />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ken-burns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-ken-burns {
          animation: ken-burns 20s ease-in-out infinite alternate;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
      <Footer />
    </div>
  );
}
