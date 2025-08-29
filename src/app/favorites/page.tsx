"use client";

import React from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useHasMounted } from "../../hooks/useHasMounted";

const FavoritesPage = () => {
  const hasMounted = useHasMounted();
  const { favorites, removeFromFavorites, loading } = useFavorites();
  const router = useRouter();
  if (!hasMounted) return null;

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleRemoveFromFavorites = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    await removeFromFavorites(productId);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement add to cart functionality
    console.log("Add to cart clicked");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Whislist...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show login prompt if user is not logged in
  // if (!isLoggedIn) {
  //   return (
  //     <div className="min-h-screen bg-white">
  //       <Navbar />
  //       <div className="max-w-7xl mx-auto px-4 py-8">
  //         <div className="text-center py-16">
  //           <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
  //             <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
  //               <Heart className="w-10 h-10 text-red-500" />
  //             </div>
  //             <h3 className="text-2xl font-bold text-gray-800 mb-3">
  //               Login Required
  //             </h3>
  //             <p className="text-gray-600 leading-relaxed mb-6">
  //               Please log in to view and manage your Wishlist products
  //             </p>
  //             <div className="space-y-3">
  //               <button
  //                 onClick={() => router.push('/login')}
  //                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
  //               >
  //                 Login
  //               </button>
  //               <button
  //                 onClick={() => router.push('/signup')}
  //                 className="w-full bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
  //               >
  //                 Create Account
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <Footer />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            My Favorites
          </h1>
          <p className="text-gray-600">
            {favorites.length === 0 
              ? "You haven't added any favorites yet" 
              : `${favorites.length} item${favorites.length === 1 ? '' : 's'} in your favorites`
            }
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No favorites yet
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Start exploring our collection and add products you love to your favorites
              </p>
              <button
                onClick={() => router.push('/products')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => handleProductClick(product.id!)}
              >
                {/* Remove from favorites button */}
                <button
                  onClick={(e) => handleRemoveFromFavorites(e, product.id!)}
                  className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow hover:bg-red-50 transition-colors group-hover:bg-red-100"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>

                {/* Sale Badge */}
                {product.discounted_price && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Sale
                    </span>
                  </div>
                )}

                {/* Product Image */}
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={product.banner_image_1 || product.banner_image_2 || ''}
                    alt={product.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    {product.discounted_price && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{product.original_price}
                      </span>
                    )}
                    <span className="text-blue-600 font-bold text-lg">
                      ₹{product.discounted_price || product.original_price}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="text-sm text-gray-500 mb-4 space-y-1">
                    {product.shape_category && (
                      <p>Shape: <span className="font-medium capitalize">{product.shape_category}</span></p>
                    )}
                    {product.type_category && product.type_category.length > 0 && (
                      <p>Type: <span className="font-medium capitalize">{product.type_category.join(', ')}</span></p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleProductClick(product.id!)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear All Button */}
        {favorites.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={async () => {
                for (const product of favorites) {
                  await removeFromFavorites(product.id!);
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Clear All Favorites
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FavoritesPage; 