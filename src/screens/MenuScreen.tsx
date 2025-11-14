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
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { styles } from './MenuScreen.styles';
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
  // State for average prices
  const [averagePrices, setAveragePrices] = useState<{[key: string]: number}>({});

  // Define the categories
  const categories: CategoryOption[] = [
    { key: 'all', label: 'All' },
    { key: 'appetizers', label: 'Appetizers' },
    { key: 'mains', label: 'Main Courses' },
    { key: 'desserts', label: 'Desserts' },
    { key: 'beverages', label: 'Beverages' },
  ];

  // Calculate average prices by category
  const calculateAverages = useCallback((items: MenuItemType[]) => {
    const categoryTotals: {[key: string]: {sum: number, count: number}} = {};
    
    items.forEach(item => {
      if (!item.price) return;
      
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = { sum: 0, count: 0 };
      }
      
      categoryTotals[item.category].sum += item.price;
      categoryTotals[item.category].count++;
    });
    
    const averages: {[key: string]: number} = {};
    Object.entries(categoryTotals).forEach(([category, { sum, count }]) => {
      averages[category] = sum / count;
    });
    
    setAveragePrices(averages);
  }, []);

  // Load the menu items when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  // Filter the menu items when the menu items or the selected category changes
  useEffect(() => {
    filterItems(menuItems, selectedCategory);
  }, [menuItems, selectedCategory]);

  /**
   * @function loadItems
   * @description Loads the menu items from storage.
   */
  const loadItems = useCallback(async () => {
    try {
      const items = await loadMenuItems();
      setMenuItems(items);
      calculateAverages(items);
      filterItems(items, selectedCategory);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setRefreshing(false);
    }
  }, [selectedCategory, calculateAverages]);

  /**
   * @function filterItems
   * @description Filters the menu items based on the selected category.
   * @param {MenuItemType[]} items - The menu items to filter.
   * @param {string} category - The selected category.
   */
  const filterItems = (items: MenuItemType[], category: string) => {
    if (category === 'all') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) => item.category === category);
      setFilteredItems(filtered);
    }
  };

  // Format price for display in South African Rand
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  // Get the display name for a category
  const getCategoryName = (category: string) => {
    const categoryMap: {[key: string]: string} = {
      'appetizers': 'Appetizers',
      'mains': 'Main Courses',
      'desserts': 'Desserts',
      'beverages': 'Beverages'
    };
    return categoryMap[category] || category;
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
      <View style={styles.header}>
        <Text style={styles.title}>Christoffel's Menu</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => navigation.navigate('Filter')}
          >
            <Text style={styles.guestButtonText}>Guest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => navigation.navigate('ManageMenu')}
          >
            <Text style={styles.manageButtonText}>Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Average Prices */}
      <View style={styles.averagePricesContainer}>
        <Text style={styles.averagePricesTitle}>Average Prices</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.averagePricesList}
        >
          {Object.entries(averagePrices).map(([category, avgPrice]) => (
            <View key={category} style={styles.averagePriceItem}>
              <Text style={styles.averagePriceCategory}>
                {getCategoryName(category)}:
              </Text>
              <Text style={styles.averagePriceValue}>
                {formatPrice(avgPrice)}
              </Text>
            </View>
          ))}
          {Object.keys(averagePrices).length === 0 && (
            <Text style={styles.noPricesText}>No price data available</Text>
          )}
        </ScrollView>
      </View>
      
      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryButton,
              selectedCategory === cat.key && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === cat.key && styles.categoryButtonTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
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


export default MenuScreen;