/**
 * @file FilterScreen.tsx
 * @description A dedicated screen for guests to filter menu items by course
 * Demonstrates use of FOR loops, WHILE loops, and function organization
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { loadMenuItems } from '../utils/storage';
import { NavigationProps, MenuItem as MenuItemType, MenuCategory } from '../types';
import { Colors, Typography } from '../constants/colors';
import menuUtils from '../utils/menuCalculations';
import priceUtils from '../utils/priceUtils';

const { searchMenuItems } = menuUtils;
const { formatPrice } = priceUtils;

// ========================================
// GLOBAL VARIABLE - Track filter usage
// ========================================
let filterChangeCount: number = 0;

/**
 * FilterScreen Component
 * Dedicated screen for guests to browse and filter menu items by course
 * Features: category filtering, search, and read-only menu display
 * @param navigation - Navigation object
 */
const FilterScreen: React.FC<NavigationProps> = ({ navigation }) => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]); // All items
  const [filteredItems, setFilteredItems] = useState<MenuItemType[]>([]); // Filtered results
  const [selectedCourse, setSelectedCourse] = useState<MenuCategory | 'all'>('all'); // Selected filter
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search text

  // ========================================
  // COURSE CONFIGURATION
  // ========================================
  const courses: Array<{ key: MenuCategory | 'all'; label: string }> = [
    { key: 'all', label: 'All Courses' },
    { key: 'appetizers', label: 'Appetizers' },
    { key: 'mains', label: 'Main Courses' },
    { key: 'desserts', label: 'Desserts' },
    { key: 'beverages', label: 'Beverages' },
  ];

  // Load menu items when component mounts
  useEffect(() => {
    loadMenuData();
  }, []);

  // Reapply filters when data or filter criteria changes
  useEffect(() => {
    applyFilters();
  }, [menuItems, selectedCourse, searchQuery]);

  // ========================================
  // DATA LOADING
  // ========================================
  
  /**
   * Load menu items from storage
   */
  const loadMenuData = async (): Promise<void> => {
    try {
      const items = await loadMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    }
  };

  // ========================================
  // FILTERING LOGIC
  // ========================================
  
  /**
   * Apply course and search filters (demonstrates FOR LOOP)
   * Filters are applied in sequence for optimal performance
   */
  const applyFilters = (): void => {
    filterChangeCount++; // Track filter usage (global variable)

    let results: MenuItemType[] = [...menuItems];

    // Step 1: Filter by course category using FOR LOOP
    if (selectedCourse !== 'all') {
      const courseFiltered: MenuItemType[] = [];
      
      // FOR LOOP: Efficient single-pass filtering
      for (let i = 0; i < results.length; i++) {
        if (results[i].category === selectedCourse) {
          courseFiltered.push(results[i]);
        }
      }
      
      results = courseFiltered;
    }

    // Step 2: Apply search filter if query exists (uses WHILE LOOP internally)
    if (searchQuery.trim()) {
      results = searchMenuItems(results, searchQuery);
    }

    setFilteredItems(results);
  };

  /**
   * Handle course filter selection
   * @param course - Selected course category
   */
  const handleCourseSelection = (course: MenuCategory | 'all'): void => {
    setSelectedCourse(course);
  };

  /**
   * Get count of items for specific course (demonstrates WHILE LOOP)
   * @param course - Course to count
   * @returns Number of items in course
   */
  const getItemCountByCourse = (course: MenuCategory | 'all'): number => {
    if (course === 'all') {
      return menuItems.length;
    }

    let count = 0;
    let index = 0;

    // WHILE LOOP: Count items in category
    while (index < menuItems.length) {
      if (menuItems[index].category === course) {
        count++;
      }
      index++;
    }

    return count;
  };

  // ========================================
  // RENDER FUNCTIONS
  // ========================================

  /**
   * Render course filter button with item count
   */
  const renderCourseButton = ({ item }: { item: { key: MenuCategory | 'all'; label: string } }) => {
    const itemCount = getItemCountByCourse(item.key);
    const isSelected = selectedCourse === item.key;

    return (
      <TouchableOpacity
        style={[
          styles.courseButton,
          isSelected && styles.courseButtonActive,
        ]}
        onPress={() => handleCourseSelection(item.key)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.courseButtonText,
          isSelected && styles.courseButtonTextActive,
        ]}>
          {item.label}
        </Text>
        <Text style={[
          styles.courseCount,
          isSelected && styles.courseCountActive,
        ]}>
          ({itemCount})
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Render menu item (read-only guest view)
   */
  const renderMenuItem = ({ item }: { item: MenuItemType }) => (
    <View style={styles.menuItemContainer}>
      <View style={styles.menuItemHeader}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        {item.price && (
          <Text style={styles.menuItemPrice}>{formatPrice(item.price)}</Text>
        )}
      </View>
      {item.description && (
        <Text style={styles.menuItemDescription}>{item.description}</Text>
      )}
      <View style={styles.menuItemFooter}>
        <Text style={styles.menuItemCategory}>
          {courses.find(c => c.key === item.category)?.label}
        </Text>
      </View>
    </View>
  );

  /**
   * Render empty state when no items match filters
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No items found</Text>
      <Text style={styles.emptyStateSubtext}>
        Try adjusting your filters or search query
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ===== HEADER WITH FILTER INFO ===== */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filter Menu</Text>
        <Text style={styles.headerSubtitle}>
          Showing {filteredItems.length} of {menuItems.length} items
        </Text>
      </View>

      {/* ===== SEARCH BAR ===== */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textTertiary}
        />
      </View>

      {/* ===== COURSE FILTER BUTTONS ===== */}
      <View style={styles.courseFilterContainer}>
        <Text style={styles.courseFilterTitle}>Filter by Course:</Text>
        <FlatList
          data={courses}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={renderCourseButton}
          contentContainerStyle={styles.courseList}
        />
      </View>

      {/* ===== FILTERED MENU ITEMS ===== */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        style={styles.menuList}
        contentContainerStyle={styles.menuListContent}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: Typography.h3,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: Typography.small,
    color: Colors.textTertiary,
    lineHeight: Typography.lineHeightNormal * Typography.small,
  },
  searchContainer: {
    backgroundColor: Colors.surface,
    padding: 16,
    paddingTop: 8,
  },
  searchInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: Typography.body,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  courseFilterContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  courseFilterTitle: {
    fontSize: Typography.small,
    color: Colors.textPrimary,
    fontWeight: '600' as const,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  courseList: {
    paddingHorizontal: 16,
  },
  courseButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  courseButtonText: {
    fontSize: Typography.small,
    color: Colors.textPrimary,
    fontWeight: '500' as const,
    marginRight: 4,
  },
  courseButtonTextActive: {
    color: Colors.textInverse,
  },
  courseCount: {
    fontSize: Typography.xsmall,
    color: Colors.textTertiary,
  },
  courseCountActive: {
    color: Colors.textInverse,
    opacity: 0.8,
  },
  menuList: {
    flex: 1,
  },
  menuListContent: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
  menuItemContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: Typography.h4,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: Typography.lineHeightTight * Typography.h4,
  },
  menuItemPrice: {
    fontSize: Typography.body,
    color: Colors.primary,
    fontWeight: '700' as const,
    marginLeft: 12,
  },
  menuItemDescription: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: Typography.lineHeightNormal * Typography.small,
  },
  menuItemFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 8,
    marginTop: 4,
  },
  menuItemCategory: {
    fontSize: Typography.xsmall,
    color: Colors.primary,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: Typography.h4,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeightNormal * Typography.small,
  },
});

export default FilterScreen;
