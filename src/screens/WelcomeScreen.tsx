/**
 * @file WelcomeScreen.tsx
 * @description This screen is the first screen the user sees. It provides a brief introduction to the app and a button to get started.
 */

import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { styles } from './WelcomeScreen.styles';
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


export default WelcomeScreen;
