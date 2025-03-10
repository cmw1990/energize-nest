import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { NoiseBoxLayout } from './components/NoiseBoxLayout';
// import { Dashboard } from './components/Dashboard'; // Component doesn't exist yet
import { WhiteNoise } from './components/WhiteNoise';
// import { NatureAmbience } from './components/NatureAmbience'; // Component doesn't exist yet
// import { UrbanScapes } from './components/UrbanScapes'; // Component doesn't exist yet
// import { CustomSounds } from './components/CustomSounds'; // Component doesn't exist yet
// import { Settings } from './components/Settings'; // Component doesn't exist yet
// import { LandingPage } from './components/LandingPage'; // Component doesn't exist yet

interface NoiseBoxAppProps {
  session: Session | null;
}

export const NoiseBoxApp: React.FC<NoiseBoxAppProps> = ({ session }) => {
  // Check if we're on the landing page route
  const isLandingPage = window.location.pathname === '/noise-box';
  
  // If we're on the landing page, show landing page (to be created)
  if (isLandingPage) {
    // For now, redirect to the app since landing page doesn't exist
    window.location.href = '/noise-box/app/white-noise';
    return null;
  }
  
  // Otherwise show the app with its layout
  return (
    <NoiseBoxLayout>
      <Routes>
        {/* <Route path="app" element={<Dashboard session={session} />} /> */}
        <Route path="app/white-noise" element={<WhiteNoise session={session} />} />
        {/* <Route path="app/nature" element={<NatureAmbience session={session} />} /> */}
        {/* <Route path="app/urban" element={<UrbanScapes session={session} />} /> */}
        {/* <Route path="app/custom" element={<CustomSounds session={session} />} /> */}
        {/* <Route path="app/settings" element={<Settings session={session} />} /> */}
      </Routes>
    </NoiseBoxLayout>
  );
};
