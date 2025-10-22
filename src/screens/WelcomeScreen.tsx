/**
 * @file WelcomeScreen.tsx
 * @description This screen is the first screen the user sees. It provides a brief introduction to the app and a button to get started.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { NavigationProps } from '../types';

/**
 * @function WelcomeScreen
 * @description The welcome screen component.
 * @param {NavigationProps} { navigation } - The navigation object from React Navigation.
 * @returns {React.JSX.Element} The rendered component.
 */
const WelcomeScreen: React.FC<NavigationProps> = ({ navigation }) => {
  return (
    // Use SafeAreaView to avoid rendering content under the status bar
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo placeholder */}
        <View style={styles.logoContainer}>
          <View style={styles.logo} />
        </View>
        {/* App title */}
        <Text style={styles.title}>Welcome to Christoffel</Text>
        {/* App subtitle */}
        <Text style={styles.subtitle}>Your ultimate menu solution</Text>
        {/* Button to navigate to the Menu screen */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.dispatch(StackActions.replace('Menu'))} // Replace the WelcomeScreen with the MenuScreen in the stack
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Define the styles for the WelcomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: '#007BFF',
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
