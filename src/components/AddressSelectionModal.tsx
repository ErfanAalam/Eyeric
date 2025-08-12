import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addressService } from '../services/addressService';
import { Address, AddressFormData } from '../types/address';
import AddressForm from './AddressForm';
import AddressList from './AddressList';
import { MapPin, X, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelected: (address: Address) => void;
  onContinueToCheckout: (address: Address) => void;
}

const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({
  isOpen,
  onClose,
  onAddressSelected,
  onContinueToCheckout,
}) => {
  const { userProfile } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);



  const loadAddresses = useCallback(async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    try {
      const userAddresses = await addressService.getUserAddresses(userProfile.id);
      setAddresses(userAddresses);
      
      // Auto-select default address if available
      const defaultAddress = userAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        onAddressSelected(defaultAddress);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, onAddressSelected]);

  useEffect(() => {
    if (isOpen && userProfile) {
      loadAddresses();
    }
  }, [isOpen, userProfile, loadAddresses]);

  const handleAddAddress = async (addressData: AddressFormData) => {
    if (!userProfile) return;

    setIsFormLoading(true);
    try {
      const newAddress = await addressService.addAddress(userProfile.id, addressData);
      if (newAddress) {
        toast.success('Address added successfully!');
        setShowForm(false);
        loadAddresses();
        
        // Auto-select new address if it's the first one
        if (addresses.length === 0) {
          setSelectedAddress(newAddress);
          onAddressSelected(newAddress);
        }
      } else {
        toast.error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleEditAddress = async (addressData: AddressFormData) => {
    if (!userProfile || !editingAddress) return;

    setIsFormLoading(true);
    try {
      const updatedAddress = await addressService.updateAddress(
        userProfile.id,
        editingAddress.id,
        addressData
      );
      if (updatedAddress) {
        toast.success('Address updated successfully!');
        setEditingAddress(null);
        setShowForm(false);
        loadAddresses();
        
        // Update selected address if it was the one being edited
        if (selectedAddress?.id === editingAddress.id) {
          setSelectedAddress(updatedAddress);
          onAddressSelected(updatedAddress);
        }
      } else {
        toast.error('Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!userProfile) return;

    if (!confirm('Are you sure you want to delete this address?')) return;

    setIsLoading(true);
    try {
      const success = await addressService.deleteAddress(userProfile.id, addressId);
      if (success) {
        toast.success('Address deleted successfully!');
        loadAddresses();
        
        // Clear selection if deleted address was selected
        if (selectedAddress?.id === addressId) {
          setSelectedAddress(null);
          onAddressSelected(null);
        }
      } else {
        toast.error('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!userProfile) return;

    setIsLoading(true);
    try {
      const success = await addressService.setDefaultAddress(userProfile.id, addressId);
      if (success) {
        toast.success('Default address updated!');
        loadAddresses();
      } else {
        toast.error('Failed to update default address');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (addressData: AddressFormData) => {
    if (editingAddress) {
      handleEditAddress(addressData);
    } else {
      handleAddAddress(addressData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    onAddressSelected(address);
  };

  const handleContinueToCheckout = () => {
    if (!selectedAddress) {
      toast.error('Please select an address to continue');
      return;
    }
    onContinueToCheckout(selectedAddress);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center z-50 ">
      <div className="bg-white rounded-lg shadow-xl w-full  overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select Delivery Address</h2>
              <p className="text-sm text-gray-600">Choose where you want your order delivered</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {showForm ? (
            <AddressForm
              address={editingAddress}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isFormLoading}
            />
          ) : (
            <div className="space-y-6">
              <AddressList
                addresses={addresses}
                selectedAddressId={selectedAddress?.id}
                onSelectAddress={handleAddressSelect}
                onEdit={handleEdit}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefault}
                onAddNew={handleAddNew}
                isLoading={isLoading}
              />

              {/* Continue to Checkout Button */}
              {selectedAddress && (
                <div className="flex justify-center pt-6 border-t border-gray-200">
                  <button
                    onClick={handleContinueToCheckout}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    Continue to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSelectionModal; 