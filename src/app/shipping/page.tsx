'use client';

import React from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
//   Package, 
  AlertTriangle, 
  Mail, 
  Globe, 
  CheckCircle, 
  XCircle,
//   Calendar,
//   Phone,
  Building2
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const ShippingPage = () => {
  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Truck className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Shipping & Delivery Policy
            </h1>
            <p className="text-xl text-orange-100">
              Last updated on July 20, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="">
          {/* Introduction */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <p className="text-gray-700 leading-relaxed">
              At Eyeric, we are committed to delivering your eyewear safely and on time across India. This Shipping & Delivery Policy explains how we manage the shipping process.
            </p>
          </div>

          {/* Shipping Availability */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">1. Shipping Availability</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">We currently offer shipping only within India.</span>
              </div>
              <div className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">International shipping is not available.</span>
              </div>
            </div>
          </div>

          {/* Order Processing & Dispatch */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">2. Order Processing & Dispatch</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Orders are typically dispatched within 0–7 working days after successful order confirmation and payment.
            </p>
            <p className="text-gray-700 mb-4">
              Processing time may vary based on:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Customization or prescription lens requirements</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Product availability</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Delivery location and courier service schedules</span>
              </li>
            </ul>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">3. Delivery Address</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Orders will be delivered to the address provided by the customer at the time of checkout.
              </p>
              <p>
                Please make sure your contact and address details are complete and accurate to avoid delays or re-delivery charges.
              </p>
            </div>
          </div>

          {/* Delivery Method & Partners */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">4. Delivery Method & Partners</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                All orders are shipped via reliable logistics partners, including Shiprocket and its courier network.
              </p>
              <p>
                Once dispatched, you will receive a tracking ID via email, WhatsApp, or SMS to monitor your delivery status.
              </p>
            </div>
          </div>

          {/* Delivery Delays */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">5. Delivery Delays</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                While we ensure timely dispatch, Eyeric is not liable for delays caused by courier companies, weather conditions, strikes, or any unforeseen issues beyond our control.
              </p>
              <p>
                We guarantee handover of the package to our delivery partners within the committed dispatch time.
              </p>
            </div>
          </div>

          {/* Order Communication */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">6. Order Communication</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                You will receive confirmation via email or WhatsApp once your order is placed and again when it is shipped.
              </p>
              <p>
                In case of any delivery-related issue, customers are encouraged to reach out to us promptly.
              </p>
            </div>
          </div>

          {/* Customer Support */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 border border-orange-100">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Customer Support</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-orange-600 mr-3" />
                <span>support@eyeric.in</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-orange-600 mr-3" />
                <span>www.eyeric.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </div>
  );
};

  export default ShippingPage; 