import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { HertzBoxLayout } from './components/HertzBoxLayout';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
// import { BinauralBeats } from './components/BinauralBeats'; // Component doesn't exist yet
// import { IsochronicTones } from './components/IsochronicTones'; // Component doesn't exist yet
// import { SolfeggioDeck } from './components/SolfeggioDeck'; // Component doesn't exist yet
// import { Favorites } from './components/Favorites'; // Component doesn't exist yet
// import { Settings } from './components/Settings'; // Component doesn't exist yet

interface HertzBoxAppProps {
  session: Session | null;
}

export const HertzBoxApp: React.FC<HertzBoxAppProps> = ({ session }) => {
  // Check if we're on the landing page route
  const isLandingPage = window.location.pathname === '/hertz-box';
  
  // If we're on the landing page, show it without the app layout
  if (isLandingPage) {
    return <LandingPage session={session} />;
  }
  
  // Track page view (removed - dbClient unavailable)
  
  // Otherwise show the app with its layout
  return (
    <HertzBoxLayout>
      <Routes>
        <Route path="app" element={<Dashboard session={session} />} />
        {/* <Route path="app/binaural" element={<BinauralBeats session={session} />} /> */}
        {/* <Route path="app/isochronic" element={<IsochronicTones session={session} />} /> */}
        {/* <Route path="app/solfeggio" element={<SolfeggioDeck session={session} />} /> */}
        {/* <Route path="app/favorites" element={<Favorites session={session} />} /> */}
        {/* <Route path="app/settings" element={<Settings session={session} />} /> */}
      </Routes>
    </HertzBoxLayout>
  );
};
