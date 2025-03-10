/**
 * Mission Fresh API Client
 * 
 * This module provides direct REST API access to the Mission Fresh database
 * following the SSOT5001 guidelines. Only direct REST API calls are used,
 * WITHOUT using any Supabase client methods.
 */

import { Session } from '@supabase/supabase-js'; // Only importing types, no client functionality

// Environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  notes: string;
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
    const error = await response.json();
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

// Progress tracking API functions
export const getProgressData = async (
  userId: string,
  startDate: string,
  endDate: string,
  session: Session | null
): Promise<ProgressEntry[]> => {
  if (!session) {
    return [];
  }
  
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/quit_smoking_progress?user_id=eq.${userId}&date=gte.${startDate}&date=lte.${endDate}&order=date.asc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching progress data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching progress data:', error);
    throw error;
  }
};

export const saveProgressData = async (
  progressData: ProgressEntry,
  session: Session | null
): Promise<ProgressEntry> => {
  if (!session) {
    throw new Error('No active session');
  }
  
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/quit_smoking_progress`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(progressData)
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error saving progress data: ${response.statusText}`);
    }
    
    return progressData;
  } catch (error) {
    console.error('Error saving progress data:', error);
    throw error;
  }
}; 