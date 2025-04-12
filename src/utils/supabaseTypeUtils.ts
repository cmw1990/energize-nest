
import { PostgrestResponse } from '@supabase/supabase-js';

/**
 * A utility to safely handle the type casting for Supabase queries,
 * avoiding "Type instantiation is excessively deep and possibly infinite" errors
 */
export async function safeQueryExecute<T = any>(
  queryFn: () => Promise<PostgrestResponse<any>>
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
  queryFn: () => Promise<PostgrestResponse<any>>
): Promise<T[]> {
  const { data, error } = await safeQueryExecute<T>(queryFn);
  if (error) throw error;
  return data || [];
}
