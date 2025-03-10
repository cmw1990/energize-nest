// Public API for Mission Fresh micro-frontend
// This file defines what other micro-frontends can import

import MissionFreshApp from './MissionFreshApp';
import { bootstrap as mount, unmount } from './bootstrap';

// Re-export specific components that should be available to other micro-frontends
export { default as MissionFreshLayout } from './components/MissionFreshLayout';
// Additional components would be exported here once implemented
// export { default as Dashboard } from './components/Dashboard';
// export { default as ProductList } from './components/ProductList';
// export { default as OrderManager } from './components/OrderManager';
// export { default as Analytics } from './components/Analytics';

// Define basic types that might be needed
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  inventory: number;
  category: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  createdAt: Date;
}

// Define configuration types
export interface MountConfig {
  basePath?: string;
  supabaseClient?: any;
  session?: any;
  onError?: (error: Error) => void;
  onNavigate?: (path: string) => void;
}

// Export the main mounting function and app
export { mount, unmount, MissionFreshApp };

// Default export for module federation
export default {
  mount,
  unmount,
  MissionFreshApp
};

// For standalone development
if (import.meta.env.DEV) {
  const root = document.getElementById('root');
  if (root) {
    import('./main').then(({ default: renderApp }) => {
      renderApp(root);
    });
  }
} 