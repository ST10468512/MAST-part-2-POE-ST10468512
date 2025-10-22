import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MenuItemProps } from '../types';

const MenuItem: React.FC<MenuItemProps> = ({ item, onEdit, onDelete }) => {
  const formatPrice = (price?: number): string => {
    if (!price) return '';
    return `$${price.toFixed(2)}`;
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  categoryContainer: {
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  deleteButton: {
    backgroundColor: '#000',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default MenuItem;
