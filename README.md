# 🍽️ Christoffel's Private Chef Menu App

A professional menu management application for private chefs, built with React Native, TypeScript, and Expo for seamless cross-platform performance.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Screens](#-screens)
- [Data Management](#-data-management)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Menu Management
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for menu items
- **Categories**: Organize items into intuitive categories (Appetizers, Mains, etc.)
- **Detailed Item View**: Comprehensive dish information including:
  - Name & Description
  - Category & Price
  - Key Ingredients
  - Allergen Information
  - Custom Notes

### User Experience
- **Intuitive Navigation**: Smooth transitions between screens
- **Pull-to-Refresh**: Update menu items with a simple gesture
- **Responsive Design**: Optimized for various screen sizes
- **Offline-First**: Works without internet connection

## 🛠 Tech Stack

### Core Technologies
- **React Native** (v0.72.4+)
- **TypeScript** (v4.9.0+)
- **Expo** (SDK 49+)

### Navigation
- **React Navigation** (v6.x)
  - Stack Navigator
  - Type-safe navigation with TypeScript

### State & Storage
- **AsyncStorage** for local data persistence
- **React Hooks** for state management

### UI Components
- **React Native Paper** (v5.x) for consistent UI elements
- **Custom Styling** with StyleSheet

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm (v8+)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/christoffel-menu.git
   cd christoffel-menu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

## 📁 Project Structure

```
christoffel-menu/
├── assets/               # Static assets (images, fonts, etc.)
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions and helpers
│       └── storage.ts    # Data persistence layer
├── App.tsx              # Root component
├── app.json             # Expo configuration
└── package.json         # Project dependencies
```

For a detailed breakdown of the code structure, see [CODE_STRUCTURE.md](./CODE_STRUCTURE.md).

## 🖥️ Screens

### Welcome Screen
- App introduction
- Quick access to menu management

### Menu Screen
- View all menu items
- Filter by category
- Search functionality
- Pull-to-refresh

### Manage Menu Screen
- List all menu items
- Edit or delete existing items
- Add new items
- Confirmation dialogs for destructive actions

### Add/Edit Item Screen
- Form for adding/editing menu items
- Input validation
- Image upload support
- Category selection

## 💾 Data Management

### Data Model
```typescript
interface MenuItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  price?: number;
  ingredients?: string[];
  allergens?: string[];
  isAvailable: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### Storage
- Uses AsyncStorage for local data persistence
- Data is automatically saved when changes are made
- Implements proper error handling and data validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for Christoffel's Private Chef Services
