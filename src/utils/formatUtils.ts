
/**
 * Utility functions for formatting values
 */

// ValueType can be string, number, or null
export type ValueType = string | number | null;

/**
 * Format a value to a fixed number of decimal places
 * Safely handles string values by converting them to numbers first
 */
export const formatValue = (value: ValueType, decimals: number = 2): string => {
  if (value === null || value === undefined) {
    return '0';
  }
  
  // Convert string to number if needed
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return '0';
  }
  
  // Format the number
  return numValue.toFixed(decimals);
};

/**
 * Format a percentage value
 */
export const formatPercentage = (value: ValueType, decimals: number = 1): string => {
  return `${formatValue(value, decimals)}%`;
};

/**
 * Format a currency value
 */
export const formatCurrency = (value: ValueType, currency: string = '$', decimals: number = 2): string => {
  return `${currency}${formatValue(value, decimals)}`;
};
