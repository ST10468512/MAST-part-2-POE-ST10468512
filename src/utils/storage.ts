import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuItem } from '../types';

const MENU_ITEMS_KEY = 'menu_items';

export const saveMenuItems = async (items: MenuItem[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(items);
    await AsyncStorage.setItem(MENU_ITEMS_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving menu items:', error);
  }
};

export const loadMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(MENU_ITEMS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading menu items:', error);
    return [];
  }
};

export const addMenuItem = async (item: Omit<MenuItem, 'id' | 'createdAt'>): Promise<MenuItem> => {
  try {
    const existingItems = await loadMenuItems();
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedItems = [...existingItems, newItem];
    await saveMenuItems(updatedItems);
    return newItem;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (id: string, updatedItem: Partial<MenuItem>): Promise<MenuItem | undefined> => {
  try {
    const existingItems = await loadMenuItems();
    const updatedItems = existingItems.map(item =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    await saveMenuItems(updatedItems);
    return updatedItems.find(item => item.id === id);
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    const existingItems = await loadMenuItems();
    const updatedItems = existingItems.filter(item => item.id !== id);
    await saveMenuItems(updatedItems);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

export const saveMenuItem = async (item: Partial<MenuItem> & { name: string; category: MenuItem['category'] }): Promise<void> => {
  try {
    const existingItems = await loadMenuItems();
    
    if (item.id && existingItems.find(existing => existing.id === item.id)) {
      // Update existing item
      const updatedItems = existingItems.map(existing =>
        existing.id === item.id ? { ...existing, ...item } : existing
      );
      await saveMenuItems(updatedItems);
    } else {
      // Add new item
      const newItem: MenuItem = {
        ...item,
        id: item.id || Date.now().toString(),
        createdAt: item.createdAt || new Date().toISOString(),
      } as MenuItem;
      const updatedItems = [...existingItems, newItem];
      await saveMenuItems(updatedItems);
    }
  } catch (error) {
    console.error('Error saving menu item:', error);
    throw error;
  }
};
