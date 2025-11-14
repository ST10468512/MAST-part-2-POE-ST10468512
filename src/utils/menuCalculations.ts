/**
 * @file menuCalculations.ts
 * @description Utility functions for menu item calculations and filtering
 */

import { MenuItem } from '../types';

/**
 * Searches menu items based on a query string
 * @param items - Array of menu items to search through
 * @param query - Search query string
 * @returns Filtered array of menu items that match the query
 */
export const searchMenuItems = (items: MenuItem[], query: string): MenuItem[] => {
  if (!query.trim()) return items;
  
  const searchTerm = query.toLowerCase().trim();
  
  return items.filter(item => {
    // Search in name, description, and category
    return (
      item.name.toLowerCase().includes(searchTerm) ||
      (item.description && item.description.toLowerCase().includes(searchTerm)) ||
      item.category.toLowerCase().includes(searchTerm)
    );
  });
};

/**
 * Groups menu items by category
 * @param items - Array of menu items to group
 * @returns Object with categories as keys and arrays of items as values
 */
export const groupByCategory = (items: MenuItem[]): Record<string, MenuItem[]> => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
};

/**
 * Gets unique categories from menu items
 * @param items - Array of menu items
 * @returns Array of unique category names
 */
export const getUniqueCategories = (items: MenuItem[]): string[] => {
  const categories = new Set<string>();
  items.forEach(item => categories.add(item.category));
  return Array.from(categories);
};

/**
 * Filters menu items by category
 * @param items - Array of menu items to filter
 * @param category - Category to filter by (or 'all' for no filtering)
 * @returns Filtered array of menu items
 */
export const filterByCategory = (items: MenuItem[], category: string): MenuItem[] => {
  if (!category || category === 'all') return [...items];
  return items.filter(item => item.category === category);
};

/**
 * Sorts menu items by price
 * @param items - Array of menu items to sort
 * @param order - Sort order ('asc' for ascending, 'desc' for descending)
 * @returns Sorted array of menu items
 */
export const sortByPrice = (items: MenuItem[], order: 'asc' | 'desc' = 'asc'): MenuItem[] => {
  return [...items].sort((a, b) => {
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    return order === 'asc' ? priceA - priceB : priceB - priceA;
  });
};

export default {
  searchMenuItems,
  groupByCategory,
  getUniqueCategories,
  filterByCategory,
  sortByPrice,
};
