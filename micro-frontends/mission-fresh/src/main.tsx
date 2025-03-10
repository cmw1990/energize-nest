import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { MissionFreshApp } from './MissionFreshApp';

// Add Vite environment type
declare global {
  interface ImportMeta {
    env: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
      DEV: boolean;
    };
  }
}

// For local development only - in production this would come from the host app
const session = null;

// For Module Federation - expose the MissionFreshApp component
export { MissionFreshApp };

// Only render in development mode - in production, MissionFreshApp will be imported by the host
if (import.meta.env.DEV) {
  const root = ReactDOM.createRoot(document.getElementById('_mission-fresh-dev-root')!);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <MissionFreshApp session={session} />
      </BrowserRouter>
    </React.StrictMode>
  );
} 
