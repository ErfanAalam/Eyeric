'use client';

import React from 'react';
import { 
//   Phone, 
  MapPin, 
  Mail, 
  Clock, 
  ShoppingBag, 
  Truck, 
  MessageCircle, 
//   Star,
  Building2,
  Globe,
//   Calendar,
//   Users
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const ContactPage = () => {
  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Have questions? Need help with your order? We&apos;re here for you!
            </p>
            <p className="text-lg text-blue-100">
              Feel free to reach out anytime — our team is happy to assist you.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="">
          {/* Business Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Business Name</h3>
                    <p className="text-gray-600">Eyeric</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">Jaipur, Rajasthan, India</p>
                    <p className="text-sm text-gray-500 mt-2">
                      (Note: Exact location will be shared during order processing, if required.)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <ShoppingBag className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Business Type</h3>
                    <p className="text-gray-600">Eyewear Retailer</p>
                    <p className="text-sm text-gray-500 mt-2">
                      (Online store for eyeglasses, sunglasses, prescription lenses & accessories)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-orange-100 p-3 rounded-full mr-4">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Email Support</h3>
                    <a 
                      href="mailto:support@eyeric.in" 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      support@eyeric.in
                    </a>
                    <p className="text-sm text-gray-500 mt-2">
                      We aim to respond within 24–48 business hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Truck className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Order / Return Queries</h3>
                    <p className="text-gray-600 mb-2">
                      If you received a damaged or defective item, or want to request a return or replacement, please email us with your Order ID and issue details at:
                    </p>
                    <a 
                      href="mailto:support@eyeric.in" 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      support@eyeric.in
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <Globe className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Social Media</h3>
                    <p className="text-gray-600">Coming Soon — stay tuned for updates, offers & more.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Working Hours</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Monday to Saturday</h4>
                <p className="text-gray-600">10:00 AM – 7:00 PM</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sunday</h4>
                <p className="text-gray-600">Closed</p>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Feedback & Suggestions</h2>
            </div>
            <p className="text-gray-700 mb-6">
              We value your feedback! Email us with suggestions to help improve our products and service.
            </p>
            <a 
              href="mailto:support@eyeric.in" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send Feedback
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </div>
  );
};

export default ContactPage; 