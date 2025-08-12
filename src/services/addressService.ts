    import { supabase } from '../../lib/supabaseClient';
import { Address, AddressFormData } from '../types/address';

export const addressService = {
  // Get all addresses for a user
  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("addresses")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data?.addresses || [];
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return [];
    }
  },

  // Add a new address
  async addAddress(userId: string, addressData: AddressFormData): Promise<Address | null> {
    try {
      // Get current addresses
      const currentAddresses = await this.getUserAddresses(userId);
      
      // Create new address object
      const newAddress: Address = {
        id: crypto.randomUUID(),
        ...addressData,
        isDefault: currentAddresses.length === 0, // First address becomes default
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // If this is the first address, make it default
      if (currentAddresses.length === 0) {
        newAddress.isDefault = true;
      }

      // Add to addresses array
      const updatedAddresses = [...currentAddresses, newAddress];

      // Update user table
      const { error } = await supabase
        .from("user")
        .update({ addresses: updatedAddresses })
        .eq("id", userId);

      if (error) throw error;
      return newAddress;
    } catch (error) {
      console.error("Error adding address:", error);
      return null;
    }
  },

  // Update an existing address
  async updateAddress(userId: string, addressId: string, addressData: Partial<AddressFormData>): Promise<Address | null> {
    try {
      const currentAddresses = await this.getUserAddresses(userId);
      const addressIndex = currentAddresses.findIndex(addr => addr.id === addressId);
      
      if (addressIndex === -1) throw new Error("Address not found");

      // Update address
      const updatedAddress = {
        ...currentAddresses[addressIndex],
        ...addressData,
        updatedAt: new Date().toISOString(),
      };

      currentAddresses[addressIndex] = updatedAddress;

      // Update user table
      const { error } = await supabase
        .from("user")
        .update({ addresses: currentAddresses })
        .eq("id", userId);

      if (error) throw error;
      return updatedAddress;
    } catch (error) {
      console.error("Error updating address:", error);
      return null;
    }
  },

  // Delete an address
  async deleteAddress(userId: string, addressId: string): Promise<boolean> {
    try {
      const currentAddresses = await this.getUserAddresses(userId);
      const addressToDelete = currentAddresses.find(addr => addr.id === addressId);
      
      if (!addressToDelete) throw new Error("Address not found");

      // Remove address
      const updatedAddresses = currentAddresses.filter(addr => addr.id !== addressId);

      // If deleted address was default, make first remaining address default
      if (addressToDelete.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
        updatedAddresses[0].updatedAt = new Date().toISOString();
      }

      // Update user table
      const { error } = await supabase
        .from("user")
        .update({ addresses: updatedAddresses })
        .eq("id", userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting address:", error);
      return false;
    }
  },

  // Set default address
  async setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
    try {
      const currentAddresses = await this.getUserAddresses(userId);
      
      // Update all addresses to not default
      const updatedAddresses = currentAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
        updatedAt: new Date().toISOString(),
      }));

      // Update user table
      const { error } = await supabase
        .from("user")
        .update({ addresses: updatedAddresses })
        .eq("id", userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error setting default address:", error);
      return false;
    }
  },

  // Get default address
  async getDefaultAddress(userId: string): Promise<Address | null> {
    try {
      const addresses = await this.getUserAddresses(userId);
      return addresses.find(addr => addr.isDefault) || null;
    } catch (error) {
      console.error("Error getting default address:", error);
      return null;
    }
  },
}; 