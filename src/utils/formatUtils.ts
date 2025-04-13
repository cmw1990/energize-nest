
/**
 * Safely formats a value to a specified number of decimal places
 * Works with numbers, strings that can be parsed as numbers, and null/undefined
 * 
 * @param value The value to format
 * @param decimals Number of decimal places (default: 2)
 * @param fallback Fallback value if formatting fails (default: '0')
 * @returns Formatted string
 */
export const formatValue = (value: any, decimals: number = 2, fallback: string = '0'): string => {
  if (value === null || value === undefined) return fallback;
  
  if (typeof value === 'number') {
    return value.toFixed(decimals);
  }
  
  if (typeof value === 'string') {
    // Try to parse the string as a number
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed.toFixed(decimals);
    }
    // If it's not a number, return the original string
    return value;
  }
  
  // For any other type, convert to string
  return String(value || '0');
};

/**
 * Type-safe version of formatValue that ensures the value can be formatted with toFixed
 * @param value Number or string that can be parsed as a number
 * @param decimals Number of decimal places
 * @returns Formatted string with fixed decimal places
 */
export const formatNumberValue = (value: number | string, decimals: number = 2): string => {
  if (typeof value === 'number') {
    return value.toFixed(decimals);
  }
  
  const parsed = parseFloat(value);
  if (!isNaN(parsed)) {
    return parsed.toFixed(decimals);
  }
  
  return '0';
};
