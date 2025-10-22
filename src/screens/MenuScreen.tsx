/**
 * @file MenuScreen.tsx
 * @description This screen displays the menu items, categorized and filterable. It also allows for adding, editing, and deleting items.
 */

import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { loadMenuItems, deleteMenuItem } from '../utils/storage';
import MenuItem from '../components/MenuItem';
import { NavigationProps, MenuItem as MenuItemType, CategoryOption } from '../types';

/**
 * @function MenuScreen
 * @description The main screen of the app, displaying the menu.
 * @param {object} navigation - The navigation object from React Navigation.
 * @returns {React.FC<NavigationProps>} The rendered component.
 */
const MenuScreen: React.FC<NavigationProps> = ({ navigation }) => {
  // State for the menu items
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  // State for the filtered menu items
  const [filteredItems, setFilteredItems] = useState<MenuItemType[]>([]);
  // State for the selected category
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // State for the refresh control
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Define the categories
  const categories: CategoryOption[] = [
    { key: 'all', label: 'All' },
    { key: 'appetizers', label: 'Appetizers' },
    { key: 'mains', label: 'Main Courses' },
    { key: 'desserts', label: 'Desserts' },
    { key: 'beverages', label: 'Beverages' },
  ];

  // Load the menu items when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  // Filter the menu items when the menu items or the selected category changes
  useEffect(() => {
    filterItems();
  }, [menuItems, selectedCategory]);

  /**
   * @function loadItems
   * @description Loads the menu items from storage.
   */
  const loadItems = async (): Promise<void> => {
    try {
      const items = await loadMenuItems();
      setMenuItems(items);
    } catch (error) {
      Alert.alert('Error', 'Failed to load menu items');
    }
  };

  /**
   * @function filterItems
   * @description Filters the menu items based on the selected category.
   */
  const filterItems = (): void => {
    if (selectedCategory === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  };

  /**
   * @function onRefresh
   * @description Refreshes the menu items when the user pulls to refresh.
   */
  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  /**
   * @function handleDeleteItem
   * @description Deletes a menu item.
   * @param {string} id - The id of the item to delete.
   * @param {string} name - The name of the item to delete.
   */
  const handleDeleteItem = (id: string, name: string): void => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMenuItem(id);
              await loadItems(); // Reload the items after deletion
            } catch (error) {
              Alert.alert('Error', 'Failed to delete menu item');
            }
          },
        },
      ]
    );
  };

  /**
   * @function handleEditItem
   * @description Navigates to the AddItemScreen to edit an item.
   * @param {MenuItemType} item - The item to edit.
   */
  const handleEditItem = (item: MenuItemType): void => {
    navigation.navigate('AddItem', { item });
  };

  /**
   * @function renderCategoryButton
   * @description Renders a category button.
   * @param {object} item - The category item to render.
   * @returns {React.JSX.Element}
   */
  const renderCategoryButton = ({ item }: { item: CategoryOption }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.key && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(item.key)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === item.key && styles.categoryButtonTextActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  /**
   * @function renderMenuItem
   * @description Renders a menu item.
   * @param {object} item - The menu item to render.
   * @returns {React.JSX.Element}
   */
  const renderMenuItem = ({ item }: { item: MenuItemType }) => (
    <MenuItem
      item={item}
      onEdit={() => handleEditItem(item)}
      onDelete={() => handleDeleteItem(item.id, item.name)}
    />
  );

  /**
   * @function renderEmptyState
   * @description Renders the empty state component when there are no menu items.
   * @returns {React.JSX.Element}
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
        <View style={styles.emptyStateIcon} />
      <Text style={styles.emptyStateText}>No menu items found</Text>
      <Text style={styles.emptyStateSubtext}>
        {selectedCategory === 'all'
          ? 'Add your first menu item to get started'
          : `No items in the ${categories.find(c => c.key === selectedCategory)?.label} category`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Category list */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={renderCategoryButton}
        style={styles.categoryList}
        contentContainerStyle={styles.categoryListContent}
      />
      
      {/* Menu item list */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        style={styles.menuList}
        contentContainerStyle={styles.menuListContent}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      
      {/* Floating action button to add a new item */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddItem')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Define the styles for the MenuScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d1d0d0ff',
  },
  categoryList: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  categoryButtonActive: {
    backgroundColor: '#00a2ffff',
    borderColor: '#007BFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#cacacaff',
  },
  menuList: {
    flex: 1,
  },
  menuListContent: {
    padding: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#d4d2d2ff',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00c3ffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MenuScreen;