/**
 * @file colors.ts
 * @description Centralized color and typography definitions for the application
 */

// Color palette
export const Colors = {
  // Primary colors
  primary: '#007BFF',
  primaryDark: '#0056b3',
  primaryLight: '#4da6ff',
  
  // Background colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  
  // Status colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  // Other
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Typography styles
export const Typography = {
  // Font sizes
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  small: 14,
  xsmall: 12,
  
  // Font weights (using numeric values for better type safety)
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  
  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightLoose: 1.8,
};

export default {
  Colors,
  Typography,
};
