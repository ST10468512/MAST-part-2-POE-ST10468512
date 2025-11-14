# 📂 Code Structure & Architecture

This document provides a detailed overview of the codebase structure and architectural decisions for the Christoffel's Private Chef Menu App.

## 🏗️ Project Architecture

The application follows a modular architecture with clear separation of concerns:

```
src/
├── components/     # Reusable UI components
├── screens/       # Screen components (views)
├── types/         # TypeScript type definitions
└── utils/         # Utility functions and services
```

## 📁 Directory Structure

### `src/components/`
Reusable UI components that are used across multiple screens.

- **`MenuItem.tsx`** - Component for displaying a single menu item in a list
  - Handles display of item details
  - Manages edit/delete actions
  - Implements touch feedback

### `src/screens/`
Screen components that represent different views in the app.

- **`WelcomeScreen.tsx`** - Initial screen with app introduction
- **`MenuScreen.tsx`** - Displays all menu items with filtering
- **`ManageMenuScreen.tsx`** - Interface for managing menu items
- **`AddItemScreen.tsx`** - Form for adding/editing menu items

### `src/types/`
TypeScript type definitions.

- **`index.ts`** - Exports all type definitions
  - `MenuItem` - Core data structure for menu items
  - `NavigationProps` - Type-safe navigation props
  - `RootStackParamList` - Navigation route types

### `src/utils/`
Utility functions and services.

- **`storage.ts`** - Handles data persistence
  - `loadMenuItems()` - Loads all menu items
  - `saveMenuItem()` - Saves a single menu item
  - `deleteMenuItem()` - Removes a menu item
  - `clearAllData()` - Clears all stored data (for debugging)

## 🔄 Data Flow

1. **Data Loading**
   - Screens use `useEffect` or `useFocusEffect` to load data when mounted
   - Data is fetched from AsyncStorage via the storage service
   - Loading states are managed with React's `useState`

2. **Data Mutation**
   - User actions trigger state updates
   - Changes are saved to AsyncStorage
   - UI updates are reflected immediately through React's state management

3. **Navigation**
   - Uses React Navigation with TypeScript for type safety
   - Navigation parameters are strictly typed
   - Deep linking support is available but not yet implemented

## 🛠️ Key Implementation Details

### State Management
- Local component state with `useState` for UI state
- Context API could be added for global state if needed
- AsyncStorage for persistent data storage

### Performance Considerations
- FlatList for efficient rendering of menu items
- Memoized callbacks with `useCallback`
- Optimized re-renders with `React.memo` where applicable

### Error Handling
- Try/catch blocks around async operations
- User-friendly error messages
- Loading states for better UX

## 🧪 Testing Strategy

### Unit Tests
- Test utility functions and business logic
- Mock AsyncStorage for storage tests

### Component Tests
- Test rendering of components
- Test user interactions
- Snapshot testing for UI components

### Integration Tests
- Test navigation flows
- Test data flow between components

## 🔜 Future Improvements

1. **State Management**
   - Consider using Redux or Context API for global state
   - Implement proper state persistence

2. **Offline Support**
   - Add proper offline queue for mutations
   - Implement conflict resolution

3. **Accessibility**
   - Add proper accessibility labels
   - Improve keyboard navigation
   - Support for screen readers

4. **Internationalization**
   - Add support for multiple languages
   - Localize dates and currencies

## 📚 Additional Documentation

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Expo Documentation](https://docs.expo.dev/)

---

This document is a living document and should be updated as the codebase evolves.
