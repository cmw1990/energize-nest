import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { EasierSleepLayout } from './components/EasierSleepLayout';
import { Dashboard } from './components/Dashboard';
import { SleepTracker } from './components/SleepTracker';
import { SoundScapes } from './components/SoundScapes';
// import { SleepAnalytics } from './components/SleepAnalytics'; // Component doesn't exist yet
import { LandingPage } from './components/LandingPage';

interface EasierSleepAppProps {
  session: Session | null;
}

export const EasierSleepApp: React.FC<EasierSleepAppProps> = ({ session }) => {
  // No need to re-initialize authentication - using the shared auth context
  
  // Check if we're on the landing page route
  const isLandingPage = window.location.pathname === '/easier-sleep';
  
  // If we're on the landing page, show it without the app layout
  if (isLandingPage) {
    return <LandingPage session={session} />;
  }
  
  // Otherwise show the app with its layout
  return (
    <EasierSleepLayout>
      <Routes>
        <Route path="app" element={<Dashboard session={session} />} />
        <Route path="app/sleep-tracker" element={<SleepTracker session={session} />} />
        <Route path="app/sound-scapes" element={<SoundScapes session={session} />} />
        {/* <Route path="app/analytics" element={<SleepAnalytics session={session} />} /> */}
      </Routes>
    </EasierSleepLayout>
  );
};
