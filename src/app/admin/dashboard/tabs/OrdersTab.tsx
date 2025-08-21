"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../lib/supabaseClient";
import { Order, OrderStatus, PaymentStatus } from "../../../../types/order";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  Eye,
  X,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  // Calendar,
  // MapPin,
  // Phone,
  // Mail,
  Search,
  // Filter,
  // Download,
  // MoreVertical,
} from "lucide-react";
// import Image from "next/image";

// Order Details Modal Component
const OrderDetailsModal = ({ order, isOpen, onClose }: { order: Order | null; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0">
      <div className="bg-white w-full h-full max-w-none max-h-none rounded-none overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          <div>
            <h3 className="text-3xl font-bold text-slate-800">Order Details</h3>
            <p className="text-slate-600 text-lg">Order #{order.order_number}</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <X className="w-8 h-8 text-gray-600" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-blue-500" />
                <span className="font-medium text-gray-700">Order Date</span>
              </div>
              <p className="text-gray-900 font-medium">
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-6 h-6 text-green-500" />
                <span className="font-medium text-gray-700">Payment Method</span>
              </div>
              <p className="text-gray-900 font-medium capitalize">{order.payment_method}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-6 h-6 text-purple-500" />
                <span className="font-medium text-gray-700">Order Status</span>
              </div>
              <p className="text-gray-900 font-medium capitalize">{order.status}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-orange-500" />
                <span className="font-medium text-gray-700">Payment Status</span>
              </div>
              <p className="text-gray-900 font-medium capitalize">{order.payment_status}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-blue-500" />
              Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Full Name</label>
                <p className="text-gray-900 text-lg font-medium">{order.customer_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Email</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  {order.customer_email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Phone</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-500" />
                  {order.customer_phone}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-green-500" />
              Shipping Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Recipient Name</label>
                  <p className="text-gray-900 text-lg font-medium">{order.shipping_address.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Address Line 1</label>
                  <p className="text-gray-700">{order.shipping_address.addressLine1}</p>
                </div>
                {order.shipping_address.addressLine2 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Address Line 2</label>
                    <p className="text-gray-700">{order.shipping_address.addressLine2}</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">City, State, Pincode</label>
                  <p className="text-gray-700">
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Country</label>
                  <p className="text-gray-700">{order.shipping_address.country}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Type: <span className="capitalize font-medium">{order.shipping_address.type}</span>
                  </span>
                  {order.shipping_address.isDefault && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Default Address</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-slate-800 mb-6">Order Items</h4>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-2">{item.product.title}</h5>
                      
                      {/* Product Specifications */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-sm">
                        {item.product.frame_colour && (
                          <div>
                            <span className="text-gray-600">Frame Color:</span>
                            <span className="ml-1 text-gray-900 capitalize">{item.product.frame_colour}</span>
                          </div>
                        )}
                        {item.product.temple_colour && (
                          <div>
                            <span className="text-gray-600">Temple Color:</span>
                            <span className="ml-1 text-gray-900 capitalize">{item.product.temple_colour}</span>
                          </div>
                        )}
                        {item.product.frame_material && (
                          <div>
                            <span className="text-gray-600">Material:</span>
                            <span className="ml-1 text-gray-900 capitalize">{item.product.frame_material}</span>
                          </div>
                        )}
                        {item.product.shape_category && (
                          <div>
                            <span className="text-gray-600">Shape:</span>
                            <span className="ml-1 text-gray-900 capitalize">{item.product.shape_category}</span>
                          </div>
                        )}
                      </div>

                      {/* Lens Information */}
                      {item.lens && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                          <h6 className="font-medium text-blue-900 mb-2">Selected Lens</h6>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-blue-700">Lens:</span>
                              <span className="ml-1 text-blue-900">{item.lens.title}</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Category:</span>
                              <span className="ml-1 text-blue-900">{item.lens.category}</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Features:</span>
                              <span className="ml-1 text-blue-900">{item.lens.features.join(", ")}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Power Selection */}
                      {item.powerCategory && (
                        <div className="bg-green-50 rounded-lg p-3 mb-3">
                          <h6 className="font-medium text-green-900 mb-2">Power Selection</h6>
                          <p className="text-sm text-green-800">
                            <span className="font-medium">Category:</span> {item.powerCategory === "saved" ? "Saved Power" : 
                                                                       item.powerCategory === "manual" ? "Manual Entry" :
                                                                       item.powerCategory === "upload" ? "Prescription Upload" :
                                                                       item.powerCategory === "submit-later" ? "Submit Later" :
                                                                       item.powerCategory}
                          </p>
                          
                          {/* Power Details */}
                          {item.powerDetails && (
                            <div className="mt-3 pt-3 border-t border-green-200">
                              <h6 className="font-medium text-green-900 mb-2">
                                {item.powerMethod === "saved" ? "Saved Power Details:" :
                                 item.powerMethod === "manual" ? "Manual Power Entry:" :
                                 item.powerMethod === "upload" ? "Prescription Details:" :
                                 "Power Details:"}
                              </h6>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-green-700 font-medium">Left Eye (OS):</span>
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
                                    <span className="text-green-700 font-medium">Right Eye (OD):</span>
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
                                <div className="mt-3 pt-3 border-t border-green-200 text-xs text-green-700">
                                  <div>Name: {item.powerName}</div>
                                  <div>Phone: {item.powerPhone}</div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Prescription Image */}
                          {item.prescriptionImageUrl && (
                            <div className="mt-3 pt-3 border-t border-green-200">
                              <h6 className="font-medium text-green-900 mb-2">Prescription:</h6>
                              <div className="text-sm text-green-800">
                                <p>Prescription image has been uploaded for this order.</p>
                                <a
                                  href={item.prescriptionImageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline text-xs break-all"
                                >
                                  View Prescription
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Submit Power Later */}
                          {item.powerCategory === "submit-later" && (
                            <div className="mt-3 pt-3 border-t border-green-200">
                              <h6 className="font-medium text-yellow-700 mb-2">Power Status:</h6>
                              <div className="text-sm text-yellow-700">
                                <p>Power details to be submitted later by customer.</p>
                                <p className="mt-1 font-medium">Customer has 7 days to submit power details.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Quantity: {item.quantity || 1}
                        </span>
                        <span className="font-medium text-gray-900">
                          ₹{item.product.discounted_price || item.product.original_price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-slate-800 mb-6">Order Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
              </div>
              {order.shipping_cost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">₹{order.shipping_cost.toFixed(2)}</span>
                </div>
              )}
              {order.tax_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">₹{order.tax_amount.toFixed(2)}</span>
                </div>
              )}
              {order.discount_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">-₹{order.discount_amount.toFixed(2)}</span>
                </div>
              )}
              {order.applied_coupon && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Coupon Applied:</span>
                  <span className="font-medium text-blue-600">{order.applied_coupon}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-slate-800">₹{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {order.notes && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-slate-800 mb-6">Additional Notes</h4>
              <p className="text-gray-700 text-lg">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-8 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        return false;
      }

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === "all" || order.payment_status === paymentStatusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.created_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      switch (dateFilter) {
        case "today":
          matchesDate = orderDate.toDateString() === today.toDateString();
          break;
        case "yesterday":
          matchesDate = orderDate.toDateString() === yesterday.toDateString();
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = orderDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = orderDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDate;
  });

  const getTotalRevenue = () => {
    return filteredOrders
      .filter(order => order.status !== 'cancelled' && order.status !== 'refunded')
      .reduce((sum, order) => sum + order.total_amount, 0);
  };

  const getOrderCount = () => filteredOrders.length;

  const getPendingOrders = () => filteredOrders.filter(order => order.status === 'pending').length;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Order Management</h2>
        <p className="text-slate-600">Manage and track all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-slate-800">{getOrderCount()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-800">₹{getTotalRevenue().toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Pending Orders</p>
              <p className="text-3xl font-bold text-slate-800">{getPendingOrders()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value as PaymentStatus | "all")}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Payment Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-3 text-lg text-slate-600">
              <RefreshCw className="w-6 h-6 animate-spin" />
              Loading orders...
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-6">📦</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Orders Found</h3>
            <p className="text-slate-600">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order.order_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.payment_method.toUpperCase()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items[0]?.product?.title || 'Product'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.total_amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.created_at)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDateTime(order.created_at).split(',')[1]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTab; 