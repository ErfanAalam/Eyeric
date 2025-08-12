import React from 'react';
import { Address } from '../types/address';
import { MapPin, Home, Building2, Edit, Trash2, Star, Plus, CheckCircle } from 'lucide-react';

interface AddressListProps {
  addresses: Address[];
  selectedAddressId?: string;
  onSelectAddress: (address: Address) => void;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  onAddNew: () => void;
  isLoading?: boolean;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onEdit,
  onDelete,
  onSetDefault,
  onAddNew,
  isLoading = false,
}) => {
  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'office':
        return <Building2 className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return 'Home';
      case 'office':
        return 'Office';
      default:
        return 'Other';
    }
  };

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
        <p className="text-gray-500 mb-6">Add your first address to continue with checkout</p>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Address
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add New Address Button */}
      <div className="flex justify-end">
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {/* Address Cards */}
      <div className="grid gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`bg-white border-2 rounded-lg p-6 transition-all cursor-pointer ${
              selectedAddressId === address.id
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : address.isDefault
                ? 'border-primary/30 bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectAddress(address)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  address.isDefault ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {getAddressIcon(address.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{address.name}</span>
                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white text-xs rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        Default
                      </span>
                    )}
                    {selectedAddressId === address.id && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        <CheckCircle className="w-3 h-3 fill-current" />
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{getAddressTypeLabel(address.type)}</span>
                    <span>•</span>
                    <span>{address.phone}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {!address.isDefault && (
                  <button
                    onClick={() => onSetDefault(address.id)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
                    title="Set as default"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onEdit(address)}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                  title="Edit address"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(address.id)}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-1 text-gray-700">
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>{address.city}, {address.state} {address.pincode}</p>
              <p>{address.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressList; 