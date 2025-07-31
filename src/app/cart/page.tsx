'use client'
import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import type { CartItem } from '../../contexts/CartContext';
import Image from 'next/image';
import { Minus, Plus, Trash2, Heart, Truck, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';


const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.18; // 18% GST
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = subtotal + shipping + tax - discount;

  const handleQuantityChange = (index: number, newQuantity: number) => {
    updateQuantity(index, newQuantity);
  };

  const moveToSaved = (index: number) => {
    const item = cartItems[index];
    setSavedItems(prev => [...prev, item]);
    removeFromCart(index);
  };

  const applyCoupon = () => {
    // Mock coupon logic
    if (couponCode.toLowerCase() === 'welcome10') {
      setAppliedCoupon({ code: couponCode, discount: 10 });
      setCouponCode('');
    } else if (couponCode.toLowerCase() === 'save20') {
      setAppliedCoupon({ code: couponCode, discount: 20 });
      setCouponCode('');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center bg-white rounded-3xl shadow-xl p-12">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 text-lg">Looks like you haven&apos;t added any products to your cart yet.</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Cart Section */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <span className="text-lg text-gray-600">({getCartCount()} items)</span>
              </div>

              {/* Cart Items */}
              <div className="space-y-6">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-white rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
                        {item.product.banner_image_1 ? (
                          <Image 
                            src={item.product.banner_image_1} 
                            alt={item.product.title} 
                            width={96} 
                            height={96} 
                            className="object-cover w-full h-full" 
                          />
                        ) : (
                          <span className="text-3xl">👓</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl text-gray-900 truncate">{item.product.title}</h3>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => moveToSaved(idx)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Save for later"
                            >
                              <Heart className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => removeFromCart(idx)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-2xl font-bold text-blue-600 mb-3">
                          ₹{(item.product.discounted_price || item.product.original_price || 0) * (item.quantity || 1)}
                        </div>

                        {/* Product Specifications */}
                        <div className="space-y-1 mb-4">
                          <div className="text-sm text-gray-600">
                            Type: {item.product.type_category?.join(', ')}
                          </div>
                          {item.powerCategory && (
                            <div className="text-sm text-blue-700 font-medium">
                              Power: {item.powerCategory}
                            </div>
                          )}
                          {item.lens && (
                            <>
                              <div className="text-sm text-green-700 font-medium">
                                Lens: {item.lens.title}
                              </div>
                              <div className="text-sm text-gray-600">
                                Lens Type: {item.lens.category}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                              <button
                                onClick={() => handleQuantityChange(idx, (item.quantity || 1) - 1)}
                                className="p-2 hover:bg-gray-50 transition-colors rounded-l-lg"
                                disabled={(item.quantity || 1) <= 1}
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="px-4 py-2 text-lg font-semibold text-gray-900 min-w-[3rem] text-center">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(idx, (item.quantity || 1) + 1)}
                                className="p-2 hover:bg-gray-50 transition-colors rounded-r-lg"
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Price per item</div>
                            <div className="text-lg font-semibold text-gray-900">
                              ₹{item.product.discounted_price || item.product.original_price}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Actions */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <Link href="/products" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                  Continue Shopping
                </Link>
                <button 
                  onClick={clearCart}
                  className="px-6 py-3 text-red-600 hover:text-red-700 font-semibold hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-3 flex items-center justify-between bg-green-50 p-3 rounded-xl">
                    <span className="text-green-700 font-medium">
                      {appliedCoupon.code} - {appliedCoupon.discount}% off
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-700"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
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
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 mb-4">
                Proceed to Checkout
              </button>

              {/* Trust Indicators */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping on orders above ₹1000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure payment & 30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Items Section */}
        {savedItems.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved for Later ({savedItems.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedItems.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
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
                        <h3 className="font-semibold text-gray-900 truncate">{item.product.title}</h3>
                        <div className="text-lg font-bold text-blue-600 mt-1">
                          ₹{item.product.discounted_price || item.product.original_price}
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
      <Footer />
    </div>
  );
};

export default CartPage; 