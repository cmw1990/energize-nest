import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { CareConnectorApp } from './CareConnectorApp';

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
    <BrowserRouter>
      <CareConnectorApp session={null} />
    </BrowserRouter>
  </React.StrictMode>
); 
