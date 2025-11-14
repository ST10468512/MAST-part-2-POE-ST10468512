/**
 * @file priceUtils.ts
 * @description Utility functions for price formatting and calculations
 */

/**
 * Formats a price value into a currency string
 * @param price - The price to format (number or string)
 * @returns Formatted price string with currency symbol (e.g., "R 19.99")
 */
export const formatPrice = (price: number | string | undefined): string => {
  if (price === undefined || price === null) return 'R 0.00';
  
  // Convert string price to number if needed
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if the price is a valid number
  if (isNaN(priceNum)) return 'R 0.00';
  
  // Format the price with 2 decimal places and add R symbol
  return `R ${priceNum.toFixed(2)}`;
};

/**
 * Calculates the total price of an array of items
 * @param items - Array of items with price property
 * @returns Total price as a number
 */
export const calculateTotal = <T extends { price: number }>(items: T[]): number => {
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
};

/**
 * Validates if a price string is a valid monetary value
 * @param value - The value to validate
 * @returns Boolean indicating if the value is a valid price
 */
export const isValidPrice = (value: string): boolean => {
  // Allow numbers with optional decimal point and up to 2 decimal places
  return /^\d+(\.\d{1,2})?$/.test(value);
};

/**
 * Converts a price string to a number
 * @param priceString - The price as a string (e.g., "19.99")
 * @returns The price as a number or 0 if invalid
 */
export const parsePrice = (priceString: string): number => {
  const price = parseFloat(priceString);
  return isNaN(price) ? 0 : price;
};

export default {
  formatPrice,
  calculateTotal,
  isValidPrice,
  parsePrice,
};
