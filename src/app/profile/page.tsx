"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { User, Mail, Calendar, MapPin, Eye } from "lucide-react";
import Link from "next/link";
import AddressList from "../../components/AddressList";
import AddressForm from "../../components/AddressForm";
import { Address, AddressFormData } from "../../types/address";
import { addressService } from "../../services/addressService";
import toast from "react-hot-toast";
import type { PowerEntry } from "../product/[id]/page";

const Profile = () => {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState({
    addresses: true,
    powers: true,
  });

  // Toggle dropdown sections
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (user?.id) {
        try {
          setAddressLoading(true);
          const userAddresses = await addressService.getUserAddresses(user.id);
          setAddresses(userAddresses);
          
          // Set default address as selected
          const defaultAddress = userAddresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
        } finally {
          setAddressLoading(false);
        }
      }
    };

    fetchAddresses();
  }, [user?.id]);

  const handleAddNewAddress = () => {
    setCurrentAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setCurrentAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user?.id) return;
    
    try {
      setAddressLoading(true);
      const success = await addressService.deleteAddress(user.id, addressId);
      if (success) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        toast.success("Address deleted successfully");
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("An error occurred while deleting the address");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user?.id) return;
    
    try {
      setAddressLoading(true);
      const success = await addressService.setDefaultAddress(user.id, addressId);
      if (success) {
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        })));
        toast.success("Default address updated");
      } else {
        toast.error("Failed to update default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("An error occurred while updating the default address");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleAddressFormSubmit = async (addressData: AddressFormData) => {
    if (!user?.id) return;
    
    try {
      setAddressLoading(true);
      if (currentAddress) {
        // Update existing address
        const updatedAddress = await addressService.updateAddress(user.id, currentAddress.id, addressData);
        if (updatedAddress) {
          setAddresses(prev => prev.map(addr => addr.id === currentAddress.id ? updatedAddress : addr));
          toast.success("Address updated successfully");
        } else {
          toast.error("Failed to update address");
        }
      } else {
        // Add new address
        const newAddress = await addressService.addAddress(user.id, addressData);
        if (newAddress) {
          setAddresses(prev => [...prev, newAddress]);
          toast.success("Address added successfully");
        } else {
          toast.error("Failed to add address");
        }
      }
      setShowAddressForm(false);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("An error occurred while saving the address");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'User Profile'}
            </h1>
            <p className="text-gray-600">Welcome to your EYERIC profile</p>
          </div>

          {/* Profile Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <User size={20} className="text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">First Name</label>
                    <p className="text-gray-800 font-medium">
                      {userProfile?.first_name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Name</label>
                    <p className="text-gray-800 font-medium">
                      {userProfile?.last_name || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Mail size={20} className="text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-gray-800 font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar size={20} className="text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-gray-800 font-medium">
                      {userProfile?.created_at 
                        ? new Date(userProfile.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not available'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                    <p className="text-green-600 font-medium">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-primary text-white py-3 px-6 rounded-2xl font-semibold hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300">
              Edit Profile
            </button>
            <Link 
              href="/orders"
              className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 text-center"
            >
              View Orders
            </Link>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <MapPin size={24} className="text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Addresses</h2>
            </div>
            <button
              onClick={() => toggleSection("addresses")}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              {expandedSections.addresses ? "−" : "+"}
            </button>
          </div>

          {expandedSections.addresses && (
            <div className="transition-all duration-300">
              {addresses.length === 0 && !addressLoading ? (
                <div className="text-center py-6 sm:py-8">
                  <MapPin size={40} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You don&apos;t have any saved addresses yet</p>
                  <button
                    onClick={handleAddNewAddress}
                    className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Add New Address
                  </button>
                </div>
              ) : (
                <div className="overflow-x-hidden">
                  <AddressList
                    addresses={addresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={handleSelectAddress}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                    onSetDefault={handleSetDefaultAddress}
                    onAddNew={handleAddNewAddress}
                    isLoading={addressLoading}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Saved Powers Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Eye size={24} className="text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Saved Powers</h2>
            </div>
            <button
              onClick={() => toggleSection("powers")}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              {expandedSections.powers ? "−" : "+"}
            </button>
          </div>

          {expandedSections.powers && (
            <div className="transition-all duration-300">
              {userProfile && "powers" in userProfile && Array.isArray(userProfile.powers) && userProfile.powers.length > 0 ? (
                <div className="space-y-4">
                  {userProfile.powers.map((power: PowerEntry) => (
                    <div key={power.id} className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{power.name}</h3>
                          <p className="text-gray-600 text-sm">{power.phone}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2 sm:mt-0 inline-block">
                          {power.method === 'manual' ? 'Manual Entry' : 
                           power.method === 'upload' ? 'Uploaded Prescription' : 
                           'Submit Later'}
                        </span>
                      </div>
                      
                      {power.power_details && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-700 mb-2">Power Details:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Left Eye (OS)</p>
                              <div className="space-y-1">
                                {power.power_details.leftSPH && (
                                  <p className="text-sm"><span className="font-medium">SPH:</span> {power.power_details.leftSPH}</p>
                                )}
                                {power.power_details.leftCYL && (
                                  <p className="text-sm"><span className="font-medium">CYL:</span> {power.power_details.leftCYL}</p>
                                )}
                                {power.power_details.leftAxis && (
                                  <p className="text-sm"><span className="font-medium">Axis:</span> {power.power_details.leftAxis}</p>
                                )}
                                {power.power_details.leftAddlPower && (
                                  <p className="text-sm"><span className="font-medium">Add Power:</span> {power.power_details.leftAddlPower}</p>
                                )}
                              </div>
                            </div>
                            {!power.power_details.samePower && (
                              <div className="mt-3 sm:mt-0">
                                <p className="text-sm text-gray-500 mb-1">Right Eye (OD)</p>
                                <div className="space-y-1">
                                  {power.power_details.rightSPH && (
                                    <p className="text-sm"><span className="font-medium">SPH:</span> {power.power_details.rightSPH}</p>
                                  )}
                                  {power.power_details.rightCYL && (
                                    <p className="text-sm"><span className="font-medium">CYL:</span> {power.power_details.rightCYL}</p>
                                  )}
                                  {power.power_details.rightAxis && (
                                    <p className="text-sm"><span className="font-medium">Axis:</span> {power.power_details.rightAxis}</p>
                                  )}
                                  {power.power_details.rightAddlPower && (
                                    <p className="text-sm"><span className="font-medium">Add Power:</span> {power.power_details.rightAddlPower}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {power.prescription_image_url && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Prescription Image:</h4>
                          <a 
                            href={power.prescription_image_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                          >
                            View Prescription
                          </a>                          
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-400 mt-4">
                        Added on {new Date(power.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Eye size={40} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">You don&apos;t have any saved powers yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Your prescription details will appear here when you make a purchase with power
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">My Favorites</h3>
              <p className="text-gray-600 text-sm mb-4">View your saved frames</p>
              <Link 
                href="/favorites"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Favorites →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Order History</h3>
              <p className="text-gray-600 text-sm mb-4">Track your past orders</p>
              <Link 
                href="/orders"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Orders →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Rewards</h3>
              <p className="text-gray-600 text-sm mb-4">Check your points & offers</p>
              <Link 
                href="/rewards"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Rewards →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          address={currentAddress}
          onSubmit={handleAddressFormSubmit}
          onCancel={() => setShowAddressForm(false)}
          isLoading={addressLoading}
        />
      )}

      <Footer />
    </div>
  );
};

export default Profile; 