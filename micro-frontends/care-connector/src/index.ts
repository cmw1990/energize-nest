// Public API for Care Connector micro-frontend
// This file defines what other micro-frontends can import

import CareConnectorApp from './CareConnectorApp';
import { bootstrap as mount, unmount } from './bootstrap';

// Re-export specific components that should be available to other micro-frontends
export { default as Dashboard } from './components/Dashboard';
// Additional components would be exported here once implemented
// export { default as GroupDetail } from './components/GroupDetail';
// export { default as Marketplace } from './components/Marketplace';
// export { default as TaskManager } from './components/TaskManager';
// export { default as Settings } from './components/Settings';

// Define basic types that might be needed
export interface CareGroup {
  id: string;
  name: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed';
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
export { mount, unmount, CareConnectorApp };

// Default export for module federation
export default {
  mount,
  unmount,
  CareConnectorApp
}; 