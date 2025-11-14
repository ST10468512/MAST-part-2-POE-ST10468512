import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MenuItemProps } from '../types';
import { styles } from './MenuItem.styles';

const MenuItem: React.FC<MenuItemProps> = ({ item, onEdit, onDelete }) => {
  const formatPrice = (price?: number): string => {
    if (!price) return '';
    return `R${price.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          {item.price && <Text style={styles.price}>{formatPrice(item.price)}</Text>}
        </View>
        
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default MenuItem;
