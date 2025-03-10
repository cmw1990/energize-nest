/*
 * This file is temporarily commented out to prevent router conflicts
 * DO NOT DELETE - just disabling for now
 */

/*
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { loadMicroFrontend } from './utils/micro-frontend-loader';
import FocusPage from './app/webapp/focus/page';
import SleepPage from './app/webapp/sleep/page';

// Register available micro-frontends
export const microFrontends = {
  focus: FocusPage,
  sleep: SleepPage,
};

// Function to mount a micro-frontend in a container
export function mountMicroFrontend(name: keyof typeof microFrontends, containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found`);
    return;
  }

  const MicroFrontendComponent = microFrontends[name];
  if (!MicroFrontendComponent) {
    console.error(`Micro-frontend ${name} not found`);
    return;
  }

  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="well-charged-theme">
        <AuthProvider>
          <MicroFrontendComponent />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );

  return () => {
    root.unmount();
  };
}

// Load micro-frontend based on URL or container
export function loadMicroFrontendFromUrl() {
  // Check URL for micro-frontend parameter
  const urlParams = new URLSearchParams(window.location.search);
  const mfName = urlParams.get('mf');
  
  if (mfName && mfName in microFrontends) {
    // Mount in the micro-frontend container
    return mountMicroFrontend(mfName as keyof typeof microFrontends, 'micro-frontend-container');
  }
  
  return null;
}
*/

// Dummy exports to prevent import errors
export const microFrontends = {};
export function mountMicroFrontend() { return () => {}; }
export function loadMicroFrontendFromUrl() { return null; }
