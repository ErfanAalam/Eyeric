"use client";

import React from "react";
import {
  Heart,
  Target,
  Eye,
  Sparkles,
  Users,
  Star,
  Award,
  Palette,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Calendar,
  Lightbulb,
  Rocket,
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const StoryPage = () => {
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
                  <Heart className="w-12 h-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Our Story
              </h1>
              <p className="text-xl text-purple-100">
                The journey of Eyeric started with a simple but powerful idea
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <Lightbulb className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  The Beginning
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  The journey of Eyeric started with a simple but powerful idea—luxury should be accessible to everyone.
                </p>
              </div>
            </div>

            {/* The Problem */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <Eye className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  The Problem We Saw
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our founder noticed a big problem in the eyewear industry: premium glasses were either overpriced or cheap frames compromised on quality. Stylish, durable, and affordable eyewear was missing from the market.
                </p>
                <p>
                  That&apos;s when Eyeric was born—with a mission to bring handcrafted quality, stylish frames, and advanced lenses at prices people can actually afford.
                </p>
              </div>
            </div>

            {/* Launch Date */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  The Launch
                </h2>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                  <span className="text-white text-2xl font-bold">1st</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">August 2025</p>
                <p className="text-gray-600">Eyeric officially launched</p>
                <p className="text-gray-700 mt-4">
                  Today, we&apos;re proud to be the go-to destination for eyewear lovers who want the perfect balance of style, comfort, and affordability.
                </p>
              </div>
            </div>

            {/* Our Mission */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Our Mission
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg font-semibold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  To make luxury eyewear an everyday experience for everyone.
                </p>
                <p>
                  We believe eyewear isn&apos;t just about better vision—it&apos;s about self-expression. That&apos;s why our collection is designed for all moods, outfits, and occasions, so you can look your best every day.
                </p>
              </div>
            </div>

            {/* Our Vision */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <Eye className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Our Vision
                </h2>
              </div>
              <p className="text-gray-700 mb-6">
                We want to transform the way people perceive and purchase eyewear.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Eyewear should not feel like a burden—it should feel like a style upgrade.
                  </span>
                </div>
                <div className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Everyone deserves clear vision and stylish designs without spending a fortune.
                  </span>
                </div>
                <div className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    To be India&apos;s most trusted luxury-yet-affordable eyewear brand.
                  </span>
                </div>
              </div>
            </div>

            {/* Why Choose Eyeric */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Why Choose Eyeric?
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Premium Materials</strong> - Lightweight, durable, and handcrafted with care.
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Advanced Lens Options</strong> - Blue light filter, prescription, polarized, UV protection.
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Affordable Pricing</strong> - Luxury without the heavy price tag.
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Timeless & Trendy Designs</strong> - Styles for men, women, and kids.
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Customer-First Approach</strong> - We listen, we care, we improve.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Craftsmanship Promise */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Craftsmanship Promise
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  Every Eyeric frame is built with precision. From scratch-resistant lenses to ergonomic temple designs, our eyewear ensures comfort for long hours without compromising on style.
                </p>
              </div>
            </div>

            {/* Style Philosophy */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-pink-100 p-3 rounded-full mr-4">
                  <Palette className="w-6 h-6 text-pink-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Style Philosophy
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  We believe glasses are not just a necessity—they&apos;re a fashion statement. Just like your outfit, your eyewear should reflect your personality. With Eyeric, you can switch up your frames as easily as you switch up your style.
                </p>
              </div>
            </div>

            {/* Customer Love */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Customer Love
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <p className="text-gray-700 italic mb-3">
                    &quot;For the first time, I found premium-looking glasses that actually fit my budget. Eyeric is my go-to brand now!&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      R
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Rohan</p>
                      <p className="text-sm text-gray-600">Jaipur</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-red-50 p-6 rounded-lg">
                  <p className="text-gray-700 italic mb-3">
                    &quot;Stylish, comfortable, and affordable. I bought two pairs instead of one—because I could!&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Sneha</p>
                      <p className="text-sm text-gray-600">Delhi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Future Goals */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Rocket className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Future Goals
                </h2>
              </div>
              <p className="text-gray-700 mb-6">
                We&apos;re just getting started 🚀
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Lenses</h3>
                  <p className="text-sm text-gray-600">Expanding into contact lenses and eyewear accessories</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pop-up Stores</h3>
                  <p className="text-sm text-gray-600">Hosting pop-up stores & eye-check camps</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-sm text-gray-600">Continuing to innovate with new designs & technology</p>
                </div>
              </div>
            </div>

            {/* Behind the Name */}
            <div className="bg-primary rounded-xl p-8 text-white">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Behind the Name - Eyeric</h2>
                <p className="text-xl mb-6">
                  The name Eyeric is inspired by a vision:
                </p>
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">Eye</div>
                    <p className="text-purple-100">representing clarity, vision, and individuality</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">Ric</div>
                    <p className="text-purple-100">symbolizing richness in style, design, and personality</p>
                  </div>
                </div>
                <div className="mt-8 p-6 bg-white/10 rounded-lg">
                  <p className="text-2xl font-bold">
                    Together, Eyeric means &quot;Luxury you can wear every day.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StoryPage; 