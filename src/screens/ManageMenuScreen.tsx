/**
 * @file ManageMenuScreen.tsx
 * @description This screen allows the chef to manage menu items (add, edit, delete).
 */

import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { styles } from './ManageMenuScreen.styles';
import { useFocusEffect } from '@react-navigation/native';
import { loadMenuItems, deleteMenuItem } from '../utils/storage';
import MenuItem from '../components/MenuItem';
import { NavigationProps, MenuItem as MenuItemType } from '../types';

const ManageMenuScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Load menu items when the screen is focused
  const loadItems = useCallback(async () => {
    try {
      const items = await loadMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadItems();
  }, [loadItems]);

  // Handle delete confirmation
  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMenuItem(id);
              await loadItems();
            } catch (error) {
              console.error('Error deleting menu item:', error);
            }
          },
        },
      ]
    );
  };

  // Load items when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Menu</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddItem')}
        >
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuItem
            item={item}
            onEdit={() => navigation.navigate('AddItem', { item })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No menu items found</Text>
            <Text style={styles.emptySubtext}>Add your first menu item using the button above</Text>
          </View>
        }
      />
    </View>
  );
};


export default ManageMenuScreen;
