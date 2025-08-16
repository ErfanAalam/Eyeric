'use client';

import React from 'react';
import { 
  Shield, 
  Eye, 
  Mail, 
//   CreditCard, 
  MapPin, 
//   Phone, 
  Globe, 
  Cookie, 
  Users, 
  Settings, 
//   AlertTriangle,
  CheckCircle,
  ExternalLink,
  Calendar,
  Building2
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className=" px-4 py-16">
          <div className=" text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Shield className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-green-100">
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
              This Privacy Policy outlines how Eyeric (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects, uses, shares, and protects your personal information when you visit or make a purchase from www.eyeric.in.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
            </div>
            <p className="text-gray-700 mb-4">
              We may collect the following types of personal and technical data:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Full name, phone number, email address</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Shipping and billing address</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Prescription details (if applicable)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Payment details (processed via secure third-party gateways)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Browsing behavior, IP address, device type (via cookies and analytics tools)</span>
              </li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            </div>
            <p className="text-gray-700 mb-4">
              We collect and use your information to:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Process orders and payments</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Deliver your products through our logistics partners</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Communicate order updates via email, SMS, or WhatsApp</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Provide customer support</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Send marketing and promotional offers (only with your consent)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Analyze website performance via analytics tools</span>
              </li>
            </ul>
          </div>

          {/* Promotional Messages */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">3. Promotional Messages</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                We may send promotional emails, SMS, or WhatsApp messages about new offers or product updates.
              </p>
              <p>
                You can opt-out anytime by replying &quot;STOP&quot; or contacting us at{' '}
                <a href="mailto:support@eyeric.in" className="text-blue-600 hover:text-blue-800 font-medium">
                  support@eyeric.in
                </a>.
              </p>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">4. Data Security</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Your personal data is stored securely and protected from unauthorized access.
              </p>
              <p>
                We do not sell, rent, or share your personal information with any third party, except when required to fulfill your order (e.g., courier partners or payment gateways).
              </p>
            </div>
          </div>

          {/* Cookies & Tracking Technologies */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <Cookie className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">5. Cookies & Tracking Technologies</h2>
            </div>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking tools such as:
            </p>
            <ul className="space-y-3 text-gray-700 mb-4">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Google Analytics</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Google Tag Manager</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Facebook Ads Pixel</span>
              </li>
            </ul>
            <p className="text-gray-700">
              These help us understand how users interact with our website and improve user experience. You can disable cookies in your browser settings.
            </p>
          </div>

          {/* Third-Party Services */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <ExternalLink className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">6. Third-Party Services</h2>
            </div>
            <p className="text-gray-700 mb-4">
              We use trusted third-party services for:
            </p>
            <ul className="space-y-3 text-gray-700 mb-4">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Payment processing (e.g., Razorpay, Paytm, etc.)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Order fulfillment and delivery (e.g., Shiprocket)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Marketing tools (e.g., Facebook Ads, WhatsApp Business API)</span>
              </li>
            </ul>
            <p className="text-gray-700">
              These third parties only receive the data necessary to perform their services.
            </p>
          </div>

          {/* User Rights */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">7. User Rights</h2>
            </div>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="space-y-3 text-gray-700 mb-4">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Request access to the personal data we hold about you</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Ask for corrections or deletion of your data</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Withdraw consent for marketing messages</span>
              </li>
            </ul>
            <p className="text-gray-700">
              You can contact us anytime to make such requests.
            </p>
          </div>

          {/* Policy Updates */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">8. Policy Updates</h2>
            </div>
            <p className="text-gray-700">
              We reserve the right to modify or update this Privacy Policy at any time. Updated policies will be posted on our website with the latest &quot;Last Updated&quot; date.
            </p>
          </div>

          {/* Contact Us */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">9. Contact Us</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-gray-700">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-600 mr-3" />
                <span>support@eyeric.in</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-blue-600 mr-3" />
                <span>www.eyeric.in</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                <span>Based in Jaipur, Rajasthan, India</span>
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

export default PrivacyPolicyPage; 