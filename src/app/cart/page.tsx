'use client'
import React from 'react';
import { useCart } from '../../contexts/CartContext';
import Image from 'next/image';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.discounted_price || item.product.original_price || 0) + (item.lens?.original_price || 0), 0);

  return (
    <div className="min-h-screen bg-[#faf8f6] py-8 px-2 md:px-0">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <span className="text-5xl block mb-4">🛒</span>
            <p>Your cart is empty. Start shopping!</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 mb-6">
              {cartItems.map((item, idx) => (
                <li key={idx} className="flex gap-4 py-4 items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                    {item.product.banner_image_1 ? (
                      <Image src={item.product.banner_image_1} alt={item.product.title} width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-3xl">👓</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg text-gray-900 truncate">{item.product.title}</div>
                    <div className="text-gray-700 text-sm">₹{item.product.discounted_price || item.product.original_price}</div>
                    <div className="text-xs text-gray-500 mt-1">Product Type: {item.product.type_category?.join(', ')}</div>
                    {item.powerCategory && (
                      <div className="text-xs text-blue-700 mt-1">Power: {item.powerCategory}</div>
                    )}
                    {item.lens && (
                      <>
                        <div className="text-xs text-green-700 mt-1">Lens: {item.lens.title}</div>
                        <div className="text-xs text-gray-500">Lens Type: {item.lens.category}</div>
                      </>
                    )}
                  </div>
                  <button className="text-red-500 hover:underline text-xs" onClick={() => removeFromCart(idx)}>Remove</button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-lg">Subtotal:</span>
              <span className="text-xl font-bold text-gray-900">₹{subtotal}</span>
            </div>
            <button className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-200 text-lg mb-2">Checkout</button>
            <button className="w-full py-2 rounded-xl font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 shadow-sm transition-all duration-200 text-base" onClick={clearCart}>Clear Cart</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage; 