/**
 * @file AddItemScreen.tsx
 * @description This screen allows the user to add a new menu item or edit an existing one.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { styles } from './AddItemScreen.styles';
import { saveMenuItem } from '../utils/storage';
import { NavigationProps, MenuCategory, CategoryOption } from '../types';

/**
 * @function AddItemScreen
 * @description The screen for adding or editing a menu item.
 * @param {object} navigation - The navigation object from React Navigation.
 * @param {object} route - The route object from React Navigation.
 * @returns {React.FC<NavigationProps>} The rendered component.
 */
const AddItemScreen: React.FC<NavigationProps> = ({ navigation, route = {} }) => {
  // State for the form fields
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [category, setCategory] = useState<MenuCategory>('appetizers');
  // State to check if the user is editing an item
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Define the categories
  const categories: CategoryOption[] = [
    { key: 'appetizers', label: 'Appetizers' },
    { key: 'mains', label: 'Main Courses' },
    { key: 'desserts', label: 'Desserts' },
    { key: 'beverages', label: 'Beverages' },
  ];

  // Check if the user is editing an item and pre-fill the form fields
  useEffect(() => {
    if (route.params && route.params.item) {
      const item = route.params.item;
      setName(item.name ?? '');
      setDescription(item.description ?? '');
      setPrice((item.price ?? 0).toString());
      setCategory(item.category);
      setIsEditing(true);
      setEditingId(item.id);
    }
  }, [route.params]);

  /**
   * @function handleSave
   * @description Handles the save button press. Validates the form fields and saves the item to storage.
   */
  const handleSave = async (): Promise<void> => {
    // Validate the form fields
    if (!name.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    try {
      // Create the menu item object
      const menuItem = {
        id: isEditing ? (editingId as string) : Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        price: priceNumber,
        category,
      };

      // Save the menu item to storage
      await saveMenuItem(menuItem);
      Alert.alert('Success', `Menu item ${isEditing ? 'updated' : 'added'} successfully`);
      navigation.goBack(); // Go back to the MenuScreen
    } catch (error) {
      Alert.alert('Error', 'Failed to save menu item');
    }
  };

  /**
   * @function renderCategoryButton
   * @description Renders a category button.
   * @param {CategoryOption} cat - The category to render.
   * @returns {React.JSX.Element}
   */
  const renderCategoryButton = (cat: CategoryOption) => (
    <TouchableOpacity
      key={cat.key}
      style={[
        styles.categoryButton,
        category === cat.key && styles.categoryButtonActive,
      ]}
      onPress={() => setCategory(cat.key as MenuCategory)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryButtonText,
          category === cat.key && styles.categoryButtonTextActive,
        ]}
      >
        {cat.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
    >
      <View style={styles.form}>
        {/* Name input */}
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Classic Burger"
        />

        {/* Description input */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. A juicy beef patty with fresh vegetables"
          multiline
          numberOfLines={3}
        />

        {/* Price input */}
        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />

        {/* Category selection */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {categories.map(renderCategoryButton)}
        </View>

        {/* Save button */}
         <TouchableOpacity 
           style={styles.saveButton} 
           onPress={handleSave}
           activeOpacity={0.8}
         >
           <Text style={styles.saveButtonText}>
             {isEditing ? 'Update Item' : 'Add Item'}
           </Text>
         </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddItemScreen;
