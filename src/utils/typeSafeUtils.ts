
/**
 * Type assertion utility for TypeScript
 * Safely casts a value to a specified type
 * 
 * @param value - The value to cast
 * @returns The value cast to the specified type
 */
export function assertType<T>(value: unknown): T {
  return value as T;
}

/**
 * Safely access a nested property of an object
 * Returns undefined if any part of the path is undefined
 * 
 * @param obj - The object to access
 * @param path - The path to follow, separated by dots
 * @returns The value at the end of the path, or undefined
 */
export function safeGet<T>(obj: any, path: string): T | undefined {
  if (!obj) return undefined;
  
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }
  
  return current as T;
}

/**
 * Check if a value is defined (not null or undefined)
 * 
 * @param value - The value to check
 * @returns True if the value is defined, false otherwise
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
