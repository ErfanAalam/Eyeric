'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Order, CreateOrderData, OrderSummary } from '../types/order';
// import { CartItem } from './CartContext';

interface OrderContextType {
  orders: Order[];
  orderSummaries: OrderSummary[];
  loading: boolean;
  createOrder: (orderData: CreateOrderData) => Promise<Order | null>;
  fetchOrders: () => Promise<void>;
  fetchOrderSummaries: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<boolean>;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSummaries, setOrderSummaries] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();



  const createOrder = async (orderData: CreateOrderData): Promise<Order | null> => {
    if (!userProfile) {
      console.error('User not authenticated');
      return null;
    }

    try {
      setLoading(true);

      // Generate order number using the database function
      const { data: orderNumberData, error: orderNumberError } = await supabase
        .rpc('generate_order_number');

      if (orderNumberError) {
        console.error('Error generating order number:', orderNumberError);
        return null;
      }

      const orderNumber = orderNumberData;

      // Create the order
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: userProfile.id,
          order_number: orderNumber,
          customer_name: orderData.shipping_address.name,
          customer_phone: orderData.shipping_address.phone,
          customer_email: userProfile.email,
          shipping_address: orderData.shipping_address,
          items: orderData.items,
          subtotal: orderData.subtotal,
          shipping_cost: orderData.shipping_cost,
          tax_amount: orderData.tax_amount,
          discount_amount: orderData.discount_amount,
          total_amount: orderData.total_amount,
          applied_coupon: orderData.applied_coupon,
          coupon_discount_percentage: orderData.coupon_discount_percentage,
          payment_method: orderData.payment_method || 'cod',
          notes: orderData.notes,
          estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        return null;
      }

      // Add the new order to the local state
      setOrders(prev => [order, ...prev]);
      setOrderSummaries(prev => [{
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        total_amount: order.total_amount,
        created_at: order.created_at,
        item_count: order.items.length,
        first_item_title: order.items[0]?.product?.title || 'Product'
      }, ...prev]);

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = useCallback(async (): Promise<void> => {
    if (!userProfile) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const fetchOrderSummaries = useCallback(async (): Promise<void> => {
    if (!userProfile) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, created_at, items')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching order summaries:', error);
        return;
      }

      const summaries: OrderSummary[] = (data || []).map(order => ({
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        total_amount: order.total_amount,
        created_at: order.created_at,
        item_count: order.items.length,
        first_item_title: order.items[0]?.product?.title || 'Product'
      }));

      setOrderSummaries(summaries);
    } catch (error) {
      console.error('Error fetching order summaries:', error);
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

    // Fetch orders when user profile changes
    useEffect(() => {
        if (userProfile) {
          fetchOrders();
          fetchOrderSummaries();
        } else {
          setOrders([]);
          setOrderSummaries([]);
        }
      }, [userProfile, fetchOrders, fetchOrderSummaries]);

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        return false;
      }

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      setOrderSummaries(prev => prev.map(summary => 
        summary.id === orderId ? { ...summary, status } : summary
      ));

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const value: OrderContextType = {
    orders,
    orderSummaries,
    loading,
    createOrder,
    fetchOrders,
    fetchOrderSummaries,
    updateOrderStatus,
    getOrderById,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}; 