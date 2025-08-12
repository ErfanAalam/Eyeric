import { CartItem } from "../contexts/CartContext";
import { Address } from "./address";

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  
  // Customer Information
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  
  // Shipping Address
  shipping_address: Address;
  
  // Order Details
  items: CartItem[];
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  
  // Coupon Information
  applied_coupon?: string;
  coupon_discount_percentage?: number;
  
  // Payment Information
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id?: string;
  
  // Order Meta
  notes?: string;
  estimated_delivery?: string;
  actual_delivery_date?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentMethod = 'cod' | 'online' | 'upi';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface CreateOrderData {
  items: CartItem[];
  shipping_address: Address;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  applied_coupon?: string;
  coupon_discount_percentage?: number;
  payment_method?: PaymentMethod;
  notes?: string;
}

export interface OrderSummary {
  id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  item_count: number;
  first_item_title: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
} 