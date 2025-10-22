export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category: MenuCategory;
  createdAt: string;
}

export type MenuCategory = 'appetizers' | 'mains' | 'desserts' | 'beverages';

export interface CategoryOption {
  key: MenuCategory | 'all';
  label: string;
}

export interface NavigationProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
    dispatch: (action: any) => void;
  };
  route?: {
    params?: {
      item?: MenuItem;
    };
  };
}

export interface MenuItemProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
}
