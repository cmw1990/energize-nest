
import { PostgrestResponse } from '@supabase/supabase-js';

/**
 * A utility to safely handle the type casting for Supabase queries,
 * avoiding "Type instantiation is excessively deep and possibly infinite" errors
 */
export async function safeQueryExecute<T = any>(
  queryFn: () => Promise<PostgrestResponse<any>>,
  errorHandler?: (error: any) => void
): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    const response = await queryFn();
    
    if (response.error) {
      throw response.error;
    }
    
    return { 
      data: response.data as T[],
      error: null 
    };
  } catch (error) {
    console.error('Database query error:', error);
    if (errorHandler) {
      errorHandler(error);
    }
    return { 
      data: null, 
      error: error as Error 
    };
  }
}

/**
 * Type-safe cast for database results to application models
 */
export function safeCast<T>(value: any): T {
  return value as unknown as T;
}

/**
 * Safely cast an array to the desired type
 */
export function safeArrayCast<T>(array: any[]): T[] {
  if (!Array.isArray(array)) return [] as T[];
  return array.map(item => safeCast<T>(item));
}

/**
 * Utility to handle callback-based React Query queryFn with proper typing
 */
export async function typeSafeQueryFn<T>(
  queryFn: () => Promise<PostgrestResponse<any>>,
  errorHandler?: (error: any) => void
): Promise<T[]> {
  const { data, error } = await safeQueryExecute<T>(queryFn, errorHandler);
  if (error) throw error;
  return data || [];
}

/**
 * Utility to handle single row queries with proper typing
 */
export async function typeSafeSingleQueryFn<T>(
  queryFn: () => Promise<PostgrestResponse<any>>,
  errorHandler?: (error: any) => void
): Promise<T | null> {
  const { data, error } = await safeQueryExecute<T>(queryFn, errorHandler);
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

/**
 * Safely run a mutation and return typed results
 */
export async function safeDbMutation<T = any>(
  mutationFn: () => Promise<PostgrestResponse<any>>,
  errorHandler?: (error: any) => void
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const response = await mutationFn();
    
    if (response.error) {
      throw response.error;
    }
    
    return { 
      data: response.data as unknown as T,
      error: null 
    };
  } catch (error) {
    console.error('Database mutation error:', error);
    if (errorHandler) {
      errorHandler(error);
    }
    return { 
      data: null, 
      error: error as Error 
    };
  }
}

/**
 * Perform a safe upsert operation with proper error handling
 */
export async function safeUpsertOperation<T = any>(
  table: string,
  data: any,
  matchingColumn: string,
  errorHandler?: (error: any) => void
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const response = await supabase
      .from(table)
      .upsert(data, { 
        onConflict: matchingColumn,
        ignoreDuplicates: false
      })
      .select();
    
    if (response.error) {
      throw response.error;
    }
    
    return { 
      data: response.data[0] as unknown as T,
      error: null 
    };
  } catch (error) {
    console.error(`Database upsert error on ${table}:`, error);
    if (errorHandler) {
      errorHandler(error);
    }
    return { 
      data: null, 
      error: error as Error 
    };
  }
}

/**
 * Batch insert data with proper error handling
 */
export async function safeBatchInsert<T = any>(
  table: string,
  data: any[],
  errorHandler?: (error: any) => void
): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    if (!data.length) return { data: [], error: null };
    
    const { supabase } = await import('@/integrations/supabase/client');
    const response = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (response.error) {
      throw response.error;
    }
    
    return { 
      data: response.data as unknown as T[],
      error: null 
    };
  } catch (error) {
    console.error(`Database batch insert error on ${table}:`, error);
    if (errorHandler) {
      errorHandler(error);
    }
    return { 
      data: null, 
      error: error as Error 
    };
  }
}

/**
 * Safe delete operation with proper error handling
 */
export async function safeDeleteOperation(
  table: string,
  column: string,
  value: any,
  errorHandler?: (error: any) => void
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const response = await supabase
      .from(table)
      .delete()
      .eq(column, value);
    
    if (response.error) {
      throw response.error;
    }
    
    return { 
      success: true,
      error: null 
    };
  } catch (error) {
    console.error(`Database delete error on ${table}:`, error);
    if (errorHandler) {
      errorHandler(error);
    }
    return { 
      success: false, 
      error: error as Error 
    };
  }
}
