"use client";
import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import type { CartItem } from "../../contexts/CartContext";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  Heart,
  Truck,
  Shield,
  ArrowLeft,
  X,
  CheckCircle,
  Star,
  Eye,
  ShoppingBag,
  CreditCard,
  Lock,
  Package,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const CartPage = () => {
  const {
    cartItems,
    cartLoading,
    removeFromCart,
    clearCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
  } = useCart();
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [showCouponError, setShowCouponError] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.18; // 18% GST
  const discount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const total = subtotal + shipping + tax - discount;

  const handleQuantityChange = (index: number, newQuantity: number) => {
    updateQuantity(index, newQuantity);
  };

  const moveToSaved = (index: number) => {
    const item = cartItems[index];
    setSavedItems((prev) => [...prev, item]);
    removeFromCart(index);
  };

  const applyCoupon = () => {
    setShowCouponError(false);
    if (!couponCode.trim()) return;

    // Mock coupon logic
    if (couponCode.toLowerCase() === "welcome10") {
      setAppliedCoupon({ code: couponCode, discount: 10 });
      setCouponCode("");
    } else if (couponCode.toLowerCase() === "save20") {
      setAppliedCoupon({ code: couponCode, discount: 20 });
      setCouponCode("");
    } else {
      setShowCouponError(true);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // const getEstimatedDelivery = () => {
  //   const today = new Date();
  //   const deliveryDate = new Date(today);
  //   deliveryDate.setDate(today.getDate() + 3);
  //   return deliveryDate.toLocaleDateString("en-US", {
  //     weekday: "long",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

  // Enhanced Loading State
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Skeleton Header */}
            <div className="mb-8">
              <div className="h-10 w-64 bg-white/70 rounded-2xl animate-pulse mb-4" />
              <div className="h-6 w-48 bg-white/50 rounded-xl animate-pulse" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">
              {/* Skeleton Cart Items */}
              <div className="space-y-6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/20 animate-pulse"
                  >
                    <div className="flex gap-6">
                      <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl" />
                      <div className="flex-1 space-y-4">
                        <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/4" />
                        <div className="h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/3" />
                        <div className="flex gap-2">
                          <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-20" />
                          <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-24" />
                        </div>
                        <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-48" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skeleton Summary */}
              <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-8 h-fit animate-pulse">
                <div className="h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/3 mb-8" />
                <div className="space-y-6">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-5 bg-gradient-to-r from-gray-100 to-gray-200 rounded"
                    />
                  ))}
                  <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl mt-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-12 border border-white/20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="w-16 h-16 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover our amazing collection of eyewear and start building
                your perfect look today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Start Shopping
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 border-2 border-gray-200 transition-all duration-300"
                >
                  <Eye className="w-5 h-5" />
                  Browse Collections
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8 pb-32 lg:pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 text-lg">
                  You have {getCartCount()} item
                  {getCartCount() !== 1 ? "s" : ""} in your cart
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Secure Checkout</span>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-center text-sm sm:flex">
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <span className="font-medium">Cart</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 mx-4 rounded-full">
                  <div className="w-1/3 h-full bg-blue-600 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <span>Checkout</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 mx-4 rounded-full"></div>
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <span>Complete</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">
            {/* Main Cart Section */}
            <div className="space-y-6">
              {/* Cart Items */}
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col gap-6">
                    {/* Product Image */}
                    <div className="relative">
                      <div className="w-fit bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex items-center gap-10 justify-center shadow-lg">
                        {item.product.banner_image_1 ? (
                          <>
                          <Image
                            src={item.product.banner_image_1}
                            alt={item.product.title}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                          />
                          <Image
                            src={item.product.banner_image_2}
                            alt={item.product.title}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                          />
                          </>
                        ) : (
                          <div className="text-4xl">👓</div>
                        )}
                      </div>
                      {/* Stock Badge */}
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        In Stock
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl sm:text-2xl text-gray-900 mb-2 line-clamp-2">
                            {item.product.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              (4.8 • 127 reviews)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => moveToSaved(idx)}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-xl"
                            title="Save for later"
                            aria-label="Save item for later"
                          >
                            <Heart className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-xl"
                            title="Remove item"
                            aria-label="Remove item from cart"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Price Display */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                          ₹
                          {(item.product.discounted_price ||
                            item.product.original_price ||
                            0) * (item.quantity || 1)}
                        </div>
                        {item.product.original_price &&
                          item.product.discounted_price && (
                            <div className="text-lg text-gray-500 line-through">
                              ₹
                              {item.product.original_price *
                                (item.quantity || 1)}
                            </div>
                          )}
                        {item.product.discounted_price &&
                          item.product.original_price && (
                            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-semibold">
                              Save ₹
                              {(
                                (item.product.original_price -
                                  item.product.discounted_price) *
                                (item.quantity || 1)
                              ).toFixed(2)}
                            </div>
                          )}
                      </div>

                      {/* Product Specifications */}
                      <div className="space-y-3 mb-6">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Type:</span>{" "}
                          {item.product.type_category?.join(", ")}
                        </div>
                        {item.powerCategory && (
                          <div className="inline-flex items-center gap-2 text-sm text-blue-700 font-medium bg-blue-50 px-3 py-2 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Power: {item.powerCategory}
                          </div>
                        )}
                        {item.lens && (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-green-700 font-medium bg-green-50 px-3 py-2 rounded-xl">
                              Lens: {item.lens.title}
                            </span>
                            <span className="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-xl">
                              Type: {item.lens.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            Quantity:
                          </span>
                          <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  idx,
                                  (item.quantity || 1) - 1
                                )
                              }
                              className="p-2 sm:p-3 hover:bg-gray-100 transition-colors rounded-l-xl disabled:opacity-40 disabled:cursor-not-allowed"
                              disabled={(item.quantity || 1) <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold text-gray-900 min-w-[3rem] sm:min-w-[4rem] text-center">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  idx,
                                  (item.quantity || 1) + 1
                                )
                              }
                              className="p-2 sm:p-3 hover:bg-gray-100 transition-colors rounded-r-xl"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right w-full sm:w-auto">
                          <div className="text-xs sm:text-sm text-gray-500">
                            Price per item
                          </div>
                          <div className="text-base sm:text-lg font-semibold text-gray-900">
                            ₹
                            {item.product.discounted_price ||
                              item.product.original_price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Cart Actions */}
              <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Link
                    href="/products"
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Continue Shopping
                  </Link>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={clearCart}
                      className="px-6 py-3 text-red-600 hover:text-red-700 font-semibold hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      Clear Cart
                    </button>
                    <button className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 rounded-xl transition-all duration-200">
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Update Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="xl:w-96">
              <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 sm:p-8 sticky top-8 h-fit border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Estimated Delivery */}
                {/* <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">
                      Estimated Delivery
                    </span>
                  </div>
                  <p className="text-blue-800 text-sm">
                    {getEstimatedDelivery()}
                  </p> */}
                {/* </div> */}

                {/* Coupon Section */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Have a coupon?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex flex-col  gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") applyCoupon();
                        }}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                    {showCouponError && (
                      <div className="text-red-600 text-sm">
                        Invalid coupon code. Try &apos;welcome10&apos; or
                        &apos;save20&apos;
                      </div>
                    )}
                    {appliedCoupon && (
                      <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-200">
                        <span className="text-green-700 font-medium">
                          {appliedCoupon.code} - {appliedCoupon.discount}% off
                        </span>
                        <button
                          onClick={removeCoupon}
                          className="text-green-600 hover:text-green-700 p-1"
                          aria-label="Remove coupon"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getCartCount()} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span
                      className={
                        shipping === 0 ? "text-green-600 font-semibold" : ""
                      }
                    >
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount ({appliedCoupon.discount}%)</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-2xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Including all taxes
                    </p>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl mb-6">
                  Proceed to Checkout
                </button>

                {/* Trust Indicators */}
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Free Shipping
                      </div>
                      <div className="text-gray-600">On orders above ₹1000</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Secure Payment
                      </div>
                      <div className="text-gray-600">
                        SSL encrypted checkout
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Package className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Easy Returns
                      </div>
                      <div className="text-gray-600">30-day return policy</div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">We accept:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CreditCard className="w-4 h-4" />
                      <span>Cards</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span>UPI</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Package className="w-4 h-4" />
                      <span>COD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Items Section */}
          {savedItems.length > 0 && (
            <div className="mt-8">
              <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 sm:p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Saved for Later ({savedItems.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                          {item.product.banner_image_1 ? (
                            <Image
                              src={item.product.banner_image_1}
                              alt={item.product.title}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-2xl">👓</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {item.product.title}
                          </h3>
                          <div className="text-lg font-bold text-blue-600 mt-1">
                            ₹
                            {item.product.discounted_price ||
                              item.product.original_price}
                          </div>
                          <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur px-4 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-gray-500">Total Amount</div>
            <div className="text-xl font-bold text-gray-900">
              ₹{total.toFixed(2)}
            </div>
          </div>
          <button className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:scale-105 transition-transform">
            Checkout Now
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
