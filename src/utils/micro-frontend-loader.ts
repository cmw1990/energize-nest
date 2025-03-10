import { supabase } from '../integrations/supabase/client';

// Types of sharable resources
export interface SharedResources {
  auth: {
    supabase: typeof supabase;
    user: any | null;
    session: any | null;
  };
  services: {
    [key: string]: any;
  };
  utils: {
    [key: string]: any;
  };
}

// Global store for shared resources
let sharedResources: SharedResources | null = null;

// Initialize shared resources
export function initializeSharedResources(): SharedResources {
  if (sharedResources) {
    return sharedResources;
  }

  // Create shared resources only once
  sharedResources = {
    auth: {
      supabase, // Use the singleton supabase client
      user: null,
      session: null,
    },
    services: {},
    utils: {},
  };

  // Synchronize authentication state
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session && sharedResources) {
      sharedResources.auth.session = session;
      sharedResources.auth.user = session.user;
    }
  });

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (sharedResources) {
      sharedResources.auth.session = session;
      sharedResources.auth.user = session?.user || null;
    }
  });

  return sharedResources;
}

// Load micro-frontend and provide shared resources
export function loadMicroFrontend(name: string): { resources: SharedResources } {
  const resources = initializeSharedResources();
  console.log(`Loading micro-frontend: ${name} with shared resources`, resources);
  return { resources };
}
