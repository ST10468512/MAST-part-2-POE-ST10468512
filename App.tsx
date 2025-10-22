/**
 * @file App.tsx
 * @description This is the main entry point of the application. It sets up the navigation and renders the different screens.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

// Import screens
import MenuScreen from './src/screens/MenuScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

// Create a stack navigator
const Stack = createStackNavigator();

/**
 * @function App
 * @description The main component of the application.
 * @returns {React.JSX.Element} The rendered component.
 */
export default function App(): React.JSX.Element {
  return (
    // Wrap the entire app in a NavigationContainer to handle navigation
    <NavigationContainer>
      {/* Set the status bar style to dark */}
      <StatusBar style="dark" />
      {/* Set up the stack navigator with the different screens */}
      <Stack.Navigator
        initialRouteName="Welcome" // Set the initial screen to the WelcomeScreen
        screenOptions={{
          headerStyle: styles.header, // Set the header style
          headerTintColor: '#000', // Set the header tint color
          headerTitleStyle: styles.headerTitle, // Set the header title style
        }}
      >
        {/* Welcome screen doesn't have a header */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        {/* Menu screen */}
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen}
          options={{
            title: 'Christoffel\'s Menu', // Set the title of the screen
          }}
        />
        {/* Add item screen */}
        <Stack.Screen 
          name="AddItem" 
          component={AddItemScreen}
          options={{
            title: 'Add Menu Item', // Set the title of the screen
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Define the styles for the app
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#000',
  },
});