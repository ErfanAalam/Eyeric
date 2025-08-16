"use client";

import React from "react";
import {
  RotateCcw,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  //   Clock,
  //   Package,
  CreditCard,
  //   Shield,
  FileText,
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const RefundPage = () => {
  return (
    <div>
      <Navbar />
      {/* </div> */}
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full">
                  <RotateCcw className="w-12 h-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Cancellation & Refund Policy
              </h1>
              <p className="text-xl text-red-100">
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
                At Eyeric, we are committed to customer satisfaction and follow
                a clear and fair Cancellation and Refund Policy. Please read the
                following terms carefully.
              </p>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  1. Cancellation Policy
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  Orders can be cancelled only before shipping. Once the order
                  has been dispatched, cancellation is not allowed.
                </p>
                <p>
                  For orders involving prescription lenses, our team may call
                  the customer for confirmation.
                </p>
                <p>
                  If the customer provides an incorrect prescription, we may
                  cancel the order with applicable deduction charges, only if it
                  has not yet been processed.
                </p>
                <p>
                  Refunds for cancelled orders will be issued to the original
                  payment method within 48 hours of confirmation, after
                  deductions if applicable.
                </p>
              </div>
            </div>

            {/* Return & Replacement Policy */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <RotateCcw className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  2. Return & Replacement Policy
                </h2>
              </div>
              <p className="text-gray-700 mb-6">
                We accept returns or exchanges only in the following cases:
              </p>

              {/* Eligible for Return */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-green-800">
                    ✅ Eligible for Return:
                  </h3>
                </div>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Product received is damaged, defective, or incorrect.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Customer must raise a request within 2 days of delivery,
                      along with clear images/videos.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Not Eligible */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <XCircle className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-red-800">
                    🚫 Not Eligible:
                  </h3>
                </div>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      If the customer later claims that the prescription was
                      wrong, no return or refund will be allowed.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      If the product is damaged by the customer after delivery.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>If the product is used, scratched, or worn.</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Prescription/customized glasses are non-returnable unless
                      damaged or incorrect at delivery.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Partial Return */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  🔄 Partial Return
                </h2>
              </div>
              <p className="text-gray-700">
                If Eyeric accepts a return and any part of the original
                packaging (case, cloth, box, etc.) is missing, charges will be
                deducted from the refund amount.
              </p>
            </div>

            {/* Refund Process */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  3. Refund Process
                </h2>
              </div>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Refund will be initiated after we receive the returned
                    product at our facility.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    The refund will be processed to the original payment method
                    or via UPI/bank transfer (for COD orders).
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    The refund will be issued within 7 business days after
                    product inspection.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Any applicable deductions (lens cost, packaging loss,
                    shipping, etc.) will be informed in advance.
                  </span>
                </li>
              </ul>
            </div>

            {/* Important Notes */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  4. Important Notes
                </h2>
              </div>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    All return/refund requests are subject to approval after
                    quality inspection by Eyeric&apos;s internal team.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Prescription-based orders are made specifically for the
                    customer, so please double-check your prescription before
                    placing the order.
                  </span>
                </li>
              </ul>
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 border border-red-100">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <Building2 className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  📞 Need Help?
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-red-600 mr-3" />
                  <span>support@eyeric.in</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-red-600 mr-3" />
                  <span>+91-8905344556</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-red-600 mr-3" />
                  <span>Based in Jaipur, Rajasthan</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-red-600 mr-3" />
                  <span>www.eyeric.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPage;
