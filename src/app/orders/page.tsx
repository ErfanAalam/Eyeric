"use client";
import React, { useState } from "react";
import { useOrders } from "../../contexts/OrderContext";
import { useAuth } from "../../contexts/AuthContext";
// import Image from "next/image";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  Eye,
  Calendar,
//   MapPin,
//   Phone,
//   Mail,
} from "lucide-react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { OrderStatus } from "../../types/order";

const OrdersPage = () => {
  const { orderSummaries, loading } = useOrders();
  const { userProfile } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "processing":
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "refunded":
        return <RefreshCw className="w-5 h-5 text-orange-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
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

  const filteredOrders = selectedStatus === "all" 
    ? orderSummaries 
    : orderSummaries.filter(order => order.status === selectedStatus);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
                You need to be logged in to view your orders.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8 pb-32 lg:pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              My Orders
            </h1>
            <p className="text-gray-600 text-lg">
              Track your orders and view order history
            </p>
          </div>

          {/* Status Filter */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-white/20">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStatus("all")}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedStatus === "all"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  All Orders ({orderSummaries.length})
                </button>
                {(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"] as OrderStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      selectedStatus === status
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)} (
                    {orderSummaries.filter(order => order.status === status).length})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 text-lg text-gray-600">
                <RefreshCw className="w-6 h-6 animate-spin" />
                Loading orders...
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredOrders.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-12 border border-white/20 max-w-2xl mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Package className="w-16 h-16 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedStatus === "all" ? "No Orders Yet" : `No ${selectedStatus} Orders`}
                </h2>
                <p className="text-gray-600 mb-8">
                  {selectedStatus === "all" 
                    ? "Start shopping to see your orders here!"
                    : `You don't have any ${selectedStatus} orders at the moment.`
                  }
                </p>
                {selectedStatus === "all" && (
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl"
                  >
                    Start Shopping
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Orders List */}
          {!loading && filteredOrders.length > 0 && (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Order #{order.order_number}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(order.created_at)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              {order.item_count} item{order.item_count !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            ₹{order.total_amount.toFixed(2)}
                          </div>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>
                      </div>

                      {/* First Item Preview */}
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                            <span className="text-2xl">👓</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {order.first_item_title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {order.item_count > 1 
                                ? `+ ${order.item_count - 1} more item${order.item_count - 1 !== 1 ? "s" : ""}`
                                : "Single item order"
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      <Link
                        href={`/orders/${order.id}`}
                        className="w-full py-3 px-6 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors text-center"
                      >
                        <Eye className="w-4 h-4 inline mr-2" />
                        View Details
                      </Link>
                      
                      {order.status === "delivered" && (
                        <button className="w-full py-3 px-6 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-colors">
                          Rate & Review
                        </button>
                      )}
                      
                      {order.status === "pending" && (
                        <button className="w-full py-3 px-6 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 transition-colors">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage; 