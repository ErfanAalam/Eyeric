'use client';

import React from 'react';
import { 
  FileText, 
  Globe, 
  Eye, 
//   AlertTriangle, 
  XCircle, 
  Shield, 
  ExternalLink, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Gavel, 
  Mail, 
  Building2,
  CheckCircle,
//   Users,
  ShoppingBag
} from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <FileText className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms and Conditions
            </h1>
            <p className="text-xl text-indigo-100">
              Last updated on July 20, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Eyeric. By accessing or using our website www.eyeric.in and purchasing products from us, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.
            </p>
            <p className="text-gray-700 leading-relaxed">
              For this document, the terms &quot;we&quot;, &quot;us&quot;, or &quot;our&quot; refer to Eyeric, a business operating from Jaipur, Rajasthan, India. The terms &quot;you&quot;, &quot;your&quot;, &quot;customer&quot;, or &quot;user&quot; refer to any person accessing the website or purchasing products.
            </p>
          </div>

          {/* Website Usage */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">1. Website Usage</h2>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>This website is intended to provide general information and sell eyewear and related products.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Content on this website is subject to change without notice.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>By continuing to use this site, you agree to these terms and all applicable laws.</span>
              </li>
            </ul>
          </div>

          {/* Product & Service Disclaimer */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">2. Product & Service Disclaimer</h2>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>We make every effort to display accurate product details, images, and pricing.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Colors may slightly vary due to screen/display settings.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>We do not guarantee that all product descriptions or other content is accurate, complete, or error-free.</span>
              </li>
            </ul>
          </div>

          {/* Order Acceptance & Cancellation */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">3. Order Acceptance & Cancellation</h2>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Orders placed on our website are subject to confirmation and availability.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>We reserve the right to refuse or cancel any order due to pricing errors, stock issues, or suspicious activity.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Customers will be notified via email/WhatsApp in case of cancellation.</span>
              </li>
            </ul>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">4. Intellectual Property</h2>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>All content on this site (designs, logos, graphics, text, etc.) is the property of Eyeric or licensed to us.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Unauthorized use, reproduction, or distribution of website content is strictly prohibited.</span>
              </li>
            </ul>
          </div>

          {/* External Links */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <ExternalLink className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">5. External Links</h2>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Our website may contain links to third-party websites for additional information.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>We do not control or take responsibility for the content or practices of any external websites.</span>
              </li>
            </ul>
          </div>

          {/* Prohibited Activities */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">6. Prohibited Activities</h2>
            </div>
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Use the website for any unlawful purpose</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Interfere with site functionality or security</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Copy, extract, or misuse any data, content, or user information</span>
              </li>
            </ul>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <Truck className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">7. Shipping</h2>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>We ship across India using logistics partners like Shiprocket.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Shipping times and charges will be shown at checkout.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Delivery delays due to courier issues or force majeure are not our responsibility.</span>
              </li>
            </ul>
          </div>

          {/* Returns & Refunds */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <RotateCcw className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">8. Returns & Refunds</h2>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Returns are accepted within 7 days only for damaged, incorrect, or defective items.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Prescription/customized eyewear is non-returnable.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Visit our Refund & Return Policy page for full details.</span>
              </li>
            </ul>
          </div>

          {/* Payments */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">9. Payments</h2>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>All payments are processed through secure gateways.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>In case of failed or declined transactions, we are not liable for any bank/card limit issues.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Cash on Delivery (COD) is available on selected pin codes and order values.</span>
              </li>
            </ul>
          </div>

          {/* Legal Jurisdiction */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Gavel className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">10. Legal Jurisdiction</h2>
            </div>
            <p className="text-gray-700">
              All disputes related to the use of our website, transactions, or policies are subject to the laws of India, with jurisdiction in Jaipur, Rajasthan.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-100">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">For queries or support</h2>
            </div>
            <div className="text-center">
              <a 
                href="mailto:support@eyeric.in" 
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                support@eyeric.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 