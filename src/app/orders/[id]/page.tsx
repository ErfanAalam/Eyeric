"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useOrders } from "../../../contexts/OrderContext";
import { useAuth } from "../../../contexts/AuthContext";
import Image from "next/image";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
//   Mail,
//   Star,
//   Minus,
//   Plus,
} from "lucide-react";
import Link from "next/link";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import { OrderStatus } from "../../../types/order";

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = params.id as string;
  const { getOrderById, loading } = useOrders();
  const { userProfile } = useAuth();
  
  const order = getOrderById(orderId);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case "processing":
        return <RefreshCw className="w-6 h-6 text-blue-500" />;
      case "shipped":
        return <Truck className="w-6 h-6 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "refunded":
        return <RefreshCw className="w-6 h-6 text-orange-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDescription = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Your order has been placed and is waiting for confirmation.";
      case "confirmed":
        return "Your order has been confirmed and is being processed.";
      case "processing":
        return "Your order is being prepared for shipping.";
      case "shipped":
        return "Your order has been shipped and is on its way.";
      case "delivered":
        return "Your order has been delivered successfully.";
      case "cancelled":
        return "Your order has been cancelled.";
      case "refunded":
        return "Your order has been refunded.";
      default:
        return "Order status information not available.";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-12 border border-white/20">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Please Login
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                You need to be logged in to view order details.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl"
              >
                Login to Continue
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 text-lg text-gray-600">
              <RefreshCw className="w-6 h-6 animate-spin" />
              Loading order details...
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-12 border border-white/20">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Order Not Found
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
              </p>
              <Link
                href="/orders"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl"
              >
                Back to Orders
              </Link>
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
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/orders"
              className="inline-flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Orders
            </Link>
          </div>

          {/* Order Header */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 border border-white/20 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Order #{order.order_number}
                </h1>
                <p className="text-gray-600 text-lg">
                  Placed on {formatDate(order.created_at)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₹{order.total_amount.toFixed(2)}
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
            </div>

            {/* Status Description */}
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
              <p className="text-gray-700">{getStatusDescription(order.status)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
            {/* Order Items */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
              
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/20"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
                      {item.product.banner_image_1 ? (
                        <Image
                          src={item.product.banner_image_1}
                          alt={item.product.title}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="text-3xl">👓</div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {item.product.title}
                      </h3>
                      
                      {/* Product Specifications */}
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Type:</span>{" "}
                          {item.product.type_category?.join(", ")}
                        </div>
                        {item.powerCategory && (
                          <div className="inline-flex items-center gap-2 text-sm text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Power: {item.powerCategory === "saved" ? "Saved Power" : 
                                   item.powerCategory === "manual" ? "Manual Entry" :
                                   item.powerCategory === "upload" ? "Prescription Upload" :
                                   item.powerCategory === "submit-later" ? "Submit Later" :
                                   item.powerCategory}
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

                        {/* Power Details */}
                        {item.powerDetails && (
                          <div className="bg-purple-50 rounded-xl p-4 mt-3">
                            <h6 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                              {item.powerMethod === "saved" ? "Saved Power Details" :
                               item.powerMethod === "manual" ? "Manual Power Entry" :
                               item.powerMethod === "upload" ? "Prescription Details" :
                               "Power Details"}
                            </h6>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-purple-700 font-medium">Left Eye (OS):</span>
                                <div className="ml-2 space-y-1">
                                  {item.powerDetails.leftSPH && (
                                    <div><span className="text-gray-600">SPH:</span> {item.powerDetails.leftSPH}</div>
                                  )}
                                  {item.powerDetails.leftCYL && (
                                    <div><span className="text-gray-600">CYL:</span> {item.powerDetails.leftCYL}</div>
                                  )}
                                  {item.powerDetails.leftAxis && (
                                    <div><span className="text-gray-600">Axis:</span> {item.powerDetails.leftAxis}</div>
                                  )}
                                  {item.powerDetails.leftAddlPower && (
                                    <div><span className="text-gray-600">Add Power:</span> {item.powerDetails.leftAddlPower}</div>
                                  )}
                                </div>
                              </div>
                              {!item.powerDetails.samePower && (
                                <div>
                                  <span className="text-purple-700 font-medium">Right Eye (OD):</span>
                                  <div className="ml-2 space-y-1">
                                    {item.powerDetails.rightSPH && (
                                      <div><span className="text-gray-600">SPH:</span> {item.powerDetails.rightSPH}</div>
                                    )}
                                    {item.powerDetails.rightCYL && (
                                      <div><span className="text-gray-600">CYL:</span> {item.powerDetails.rightCYL}</div>
                                    )}
                                    {item.powerDetails.rightAxis && (
                                      <div><span className="text-gray-600">Axis:</span> {item.powerDetails.rightAxis}</div>
                                    )}
                                    {item.powerDetails.rightAddlPower && (
                                      <div><span className="text-gray-600">Add Power:</span> {item.powerDetails.rightAddlPower}</div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            {item.powerName && item.powerPhone && (
                              <div className="mt-3 pt-3 border-t border-purple-200 text-xs text-purple-700">
                                <div>Name: {item.powerName}</div>
                                <div>Phone: {item.powerPhone}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Prescription Image */}
                        {item.prescriptionImageUrl && (
                          <div className="bg-orange-50 rounded-xl p-4 mt-3">
                            <h6 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              Prescription Uploaded
                            </h6>
                            <div className="text-sm text-orange-800">
                              <p>Prescription image has been uploaded for this order.</p>
                              {item.powerName && item.powerPhone && (
                                <div className="mt-2 pt-2 border-t border-orange-200 text-xs">
                                  <div>Name: {item.powerName}</div>
                                  <div>Phone: {item.powerPhone}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Submit Power Later */}
                        {item.powerCategory === "submit-later" && (
                          <div className="bg-yellow-50 rounded-xl p-4 mt-3">
                            <h6 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              Power to be Submitted Later
                            </h6>
                            <div className="text-sm text-yellow-800">
                              <p>You can submit your power details within 7 days of placing this order.</p>
                              <p className="mt-1 font-medium">Please contact customer support to submit your power.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-gray-900">
                            Quantity: {item.quantity || 1}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">
                            ₹{(item.product.discounted_price || item.product.original_price || 0) * (item.quantity || 1)}
                          </div>
                          {item.product.original_price && item.product.discounted_price && (
                            <div className="text-sm text-gray-500 line-through">
                              ₹{item.product.original_price * (item.quantity || 1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Price Breakdown */}
              <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/20">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({order.items.length} items)</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={order.shipping_cost === 0 ? "text-green-600 font-semibold" : ""}>
                      {order.shipping_cost === 0 ? "Free" : `₹${order.shipping_cost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (GST 18%)</span>
                    <span>₹{order.tax_amount.toFixed(2)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-₹{order.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-2xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Info */}
                {order.applied_coupon && (
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
                    <div className="text-green-700 font-medium">
                      Coupon Applied: {order.applied_coupon}
                    </div>
                    <div className="text-green-600 text-sm">
                      {order.coupon_discount_percentage}% discount
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/20">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Shipping Address
                </h3>
                <div className="space-y-2">
                  <div className="font-medium text-gray-900">{order.shipping_address.name}</div>
                  <div className="text-gray-600">{order.shipping_address.addressLine1}</div>
                  {order.shipping_address.addressLine2 && (
                    <div className="text-gray-600">{order.shipping_address.addressLine2}</div>
                  )}
                  <div className="text-gray-600">
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
                  </div>
                  <div className="text-gray-600">{order.shipping_address.country}</div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    {order.shipping_address.phone}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/20">
                <h3 className="font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium text-gray-900 capitalize">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-sm ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </div>
                  {order.transaction_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium text-gray-900 text-sm">{order.transaction_id}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Estimated Delivery */}
              {order.estimated_delivery && (
                <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/20">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Estimated Delivery
                  </h3>
                  <div className="text-lg font-medium text-gray-900">
                    {new Date(order.estimated_delivery).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetailPage; 