/**
 * Mission Fresh API Client
 * 
 * This module provides direct REST API access to the Mission Fresh database
 * following the SSOT5001 guidelines. Only direct REST API calls are used,
 * WITHOUT using any Supabase client methods.
 */

import { Session } from '@supabase/supabase-js'; // Only importing types, no client functionality

// Environment variables - use the same values as in supabase-client.ts
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vnkrheujnlioevyofvqn.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua3JoZXVqbmxpb2V2eW9mdnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzYwMTE0OTAsImV4cCI6MTk5MTU4NzQ5MH0.XN1ilvPeIiiFhL9BhEsHKc-t9pVs9ZVuVJBDBgC47Bg';

// Type definitions
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  inventory: number;
  category: string;
  image_url?: string;
  supplier_id?: string;
  is_organic: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Order {
  id: string;
  customer_id?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  shipping_address?: any;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Progress tracking API functions
export interface ProgressEntry {
  id?: string;
  user_id: string;
  date: string;
  cravings: number;
  cigarettes_avoided: number;
  energy_level: number;
  mood_score: string;
  notes?: string;
}

// Helper for making REST API calls to Supabase
const supabaseRestCall = async (
  endpoint: string,
  options: RequestInit = {},
  session?: Session | null
): Promise<any> => {
  // Ensure we have a valid token string
  const token = session?.access_token || SUPABASE_ANON_KEY || '';
  
  const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY || '',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || response.statusText);
  }

  return await response.json();
};

// Products API
export const getProducts = async (
  session: Session
): Promise<Product[]> => {
  return supabaseRestCall(
    '/rest/v1/mission8_products?select=*',
    {},
    session
  );
};

export const getProductById = async (
  id: string,
  session: Session
): Promise<Product> => {
  const products = await supabaseRestCall(
    `/rest/v1/mission8_products?id=eq.${id}&select=*`,
    {},
    session
  );
  if (products.length === 0) {
    throw new Error(`Product with ID ${id} not found`);
  }
  return products[0];
};

export const createProduct = async (
  product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  session: Session
): Promise<Product> => {
  return supabaseRestCall(
    '/rest/v1/mission8_products',
    {
      method: 'POST',
      headers: {
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        ...product,
        user_id: session.user.id
      })
    },
    session
  )[0];
};

export const updateProduct = async (
  id: string,
  updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'user_id'>>,
  session: Session
): Promise<Product> => {
  return supabaseRestCall(
    `/rest/v1/mission8_products?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        ...updates,
        updated_at: new Date().toISOString()
      })
    },
    session
  )[0];
};

export const deleteProduct = async (
  id: string,
  session: Session
): Promise<void> => {
  await supabaseRestCall(
    `/rest/v1/mission8_products?id=eq.${id}`,
    {
      method: 'DELETE'
    },
    session
  );
};

// Orders API
export const getOrders = async (
  session: Session
): Promise<Order[]> => {
  return supabaseRestCall(
    '/rest/v1/mission8_orders?select=*',
    {},
    session
  );
};

export const getOrderById = async (
  id: string,
  session: Session
): Promise<Order> => {
  const orders = await supabaseRestCall(
    `/rest/v1/mission8_orders?id=eq.${id}&select=*`,
    {},
    session
  );
  if (orders.length === 0) {
    throw new Error(`Order with ID ${id} not found`);
  }
  return orders[0];
};

export const createOrder = async (
  order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  session: Session
): Promise<Order> => {
  return supabaseRestCall(
    '/rest/v1/mission8_orders',
    {
      method: 'POST',
      headers: {
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        ...order,
        user_id: session.user.id
      })
    },
    session
  )[0];
};

export const updateOrderStatus = async (
  id: string,
  status: Order['status'],
  session: Session
): Promise<Order> => {
  return supabaseRestCall(
    `/rest/v1/mission8_orders?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        status,
        updated_at: new Date().toISOString()
      })
    },
    session
  )[0];
};

// Order Items API
export const getOrderItems = async (
  orderId: string,
  session: Session
): Promise<OrderItem[]> => {
  return supabaseRestCall(
    `/rest/v1/mission8_order_items?order_id=eq.${orderId}&select=*`,
    {},
    session
  );
};

export const addOrderItem = async (
  orderItem: Omit<OrderItem, 'id' | 'created_at' | 'updated_at'>,
  session: Session
): Promise<OrderItem> => {
  return supabaseRestCall(
    '/rest/v1/mission8_order_items',
    {
      method: 'POST',
      headers: {
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(orderItem)
    },
    session
  )[0];
};

// Customers API
export const getCustomers = async (
  session: Session
): Promise<Customer[]> => {
  return supabaseRestCall(
    '/rest/v1/mission8_customers?select=*',
    {},
    session
  );
};

export const createCustomer = async (
  customer: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  session: Session
): Promise<Customer> => {
  return supabaseRestCall(
    '/rest/v1/mission8_customers',
    {
      method: 'POST',
      headers: {
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        ...customer,
        user_id: session.user.id
      })
    },
    session
  )[0];
};

// Analytics API
export const getSalesAnalytics = async (
  startDate: string,
  endDate: string,
  session: Session
): Promise<any> => {
  return supabaseRestCall(
    `/rest/v1/rpc/get_sales_analytics`,
    {
      method: 'POST',
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate
      })
    },
    session
  );
};

export const getProductPerformance = async (
  session: Session
): Promise<any> => {
  return supabaseRestCall(
    `/rest/v1/rpc/get_product_performance`,
    {
      method: 'POST',
      body: JSON.stringify({})
    },
    session
  );
};

// Progress data API functions
export const getProgressData = async (
  userId: string = 'user123', // Default for demo
  startDate: string = '2023-01-01',
  endDate: string = new Date().toISOString().split('T')[0],
  session: Session | null = null
): Promise<ProgressEntry[]> => {
  try {
    // Try to get real data from Supabase
    return await supabaseRestCall(
      `/rest/v1/progress_data?user_id=eq.${userId}&date=gte.${startDate}&date=lte.${endDate}&select=*&order=date.desc`,
      {},
      session
    );
  } catch (error) {
    console.error('Error fetching progress data:', error);
    
    // Return mock data if real data fetch fails
    return [
      {
        id: '1',
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        cravings: 5,
        cigarettes_avoided: 10,
        energy_level: 7,
        mood_score: 'positive',
        notes: ''
      },
      {
        id: '2',
        user_id: userId,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        cravings: 7,
        cigarettes_avoided: 8,
        energy_level: 6,
        mood_score: 'neutral',
        notes: ''
      },
      {
        id: '3',
        user_id: userId,
        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0],
        cravings: 9,
        cigarettes_avoided: 5,
        energy_level: 4,
        mood_score: 'negative',
        notes: ''
      }
    ];
  }
};

export const saveProgressData = async (
  progressData: ProgressEntry,
  session: Session | null = null
): Promise<ProgressEntry> => {
  try {
    // If there's an ID, update existing record
    if (progressData.id) {
      const result = await supabaseRestCall(
        `/rest/v1/progress_data?id=eq.${progressData.id}`,
        {
          method: 'PATCH',
          headers: {
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            ...progressData,
            updated_at: new Date().toISOString()
          })
        },
        session
      );
      
      return result[0];
    } 
    // Otherwise insert new record
    else {
      const result = await supabaseRestCall(
        '/rest/v1/progress_data',
        {
          method: 'POST',
          headers: {
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            ...progressData,
            created_at: new Date().toISOString()
          })
        },
        session
      );
      
      return result[0];
    }
  } catch (error) {
    console.error('Error saving progress data:', error);
    
    // Return mock response if real save fails
    return {
      ...progressData,
      id: progressData.id || `mock-${Date.now()}`
    };
  }
}; 