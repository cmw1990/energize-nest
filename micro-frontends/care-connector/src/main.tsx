import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import { CareConnectorApp } from './CareConnectorApp';
import { Toaster } from './components/ui/toast';

// Vite environment type declaration
declare global {
  interface ImportMeta {
    env: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
      DEV: boolean;
    };
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <CareConnectorApp session={null} />
      <Toaster />
    </HashRouter>
  </React.StrictMode>
); 
