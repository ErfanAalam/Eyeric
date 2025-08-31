"use client";

import React from "react";
import {
  Eye,
  Sparkles,
//   Users,
  Star,
  Award,
  Target,
  Heart,
//   Globe,
  Shield,
  Zap,
  Palette,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const AboutPage = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-primary text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full">
                  <Eye className="w-12 h-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Us - Eyeric
              </h1>
              <p className="text-xl text-blue-100">
                Luxury eyewear accessible for everyday life
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Vision
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  At Eyeric, we believe that eyewear is more than just vision correction - it&apos;s a reflection of who you are. Founded on 1st August 2025, our journey began with a simple idea: to make luxury eyewear accessible for everyday life.
                </p>
              </div>
            </div>

            {/* Our Story */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Our Story
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  The inspiration behind Eyeric was born from the need for premium-quality frames that don&apos;t just enhance eyesight but also empower confidence and style. We set out to create a brand that blends fashion, function, and affordability, giving everyone the freedom to express themselves through eyewear.
                </p>
                <p>
                  Every Eyeric frame is carefully designed to match modern trends while ensuring long-lasting comfort – because luxury should feel effortless.
                </p>
              </div>
            </div>

            {/* What We Offer */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  What We Offer
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Premium Frames</strong> – handcrafted and designed for durability, comfort, and elegance
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Advanced Lenses</strong> – including prescription, blue light filter, and polarized protection
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>For Everyone</strong> – stylish collections for men, women, and kids across all ages
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Online-First</strong> – a seamless shopping experience from the comfort of your home
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Promise */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Our Promise
                </h2>
              </div>
              <p className="text-gray-700 mb-6">
                At Eyeric, we stand by three core values:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quality You Can Trust</h3>
                  <p className="text-sm text-gray-600">Crafted with precision and care</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Style That Defines You</h3>
                  <p className="text-sm text-gray-600">Eyewear that complements every personality</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Luxury Made Affordable</h3>
                  <p className="text-sm text-gray-600">Premium designs at accessible prices</p>
                </div>
              </div>
            </div>

            {/* Looking Ahead */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Looking Ahead
                </h2>
              </div>
              <p className="text-gray-700 mb-6">
                We are constantly innovating to redefine the eyewear experience. The future of Eyeric includes:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>AR Try-On Technology</strong> -to help you find your perfect frame virtually
                    </span>
                  </div>
                  <div className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Exclusive Designer Collaborations</strong> - bringing global fashion trends to your doorstep
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Sustainable Eyewear Practices</strong> - eco-friendly packaging and responsibly sourced materials
                    </span>
                  </div>
                  <div className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Expanded Collections</strong> - timeless classics, bold new styles, and much more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* More Than Eyewear */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  More Than Eyewear
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  Eyeric is not just about glasses – it&apos;s about creating a lifestyle movement. Whether you&apos;re working, traveling, or making a style statement, our frames are designed to be your everyday companion.
                </p>
                <p className="text-lg font-semibold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  With Eyeric, you don&apos;t just wear eyewear – you wear confidence, comfort, and everyday luxury.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">50K+</div>
                  <div className="text-blue-100">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">4.9</div>
                  <div className="text-blue-100">Customer Rating</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">1000+</div>
                  <div className="text-blue-100">Frame Styles</div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage; 