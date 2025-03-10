import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { EasierMoodLayout } from './components/EasierMoodLayout';
import { Dashboard } from './components/Dashboard';
import { MoodTracker } from './components/MoodTracker';
import { Journal } from './components/Journal';
import { Community } from './components/Community';
import { Resources } from './components/Resources';
import { Settings } from './components/Settings';
import { LandingPage } from './components/LandingPage';

interface EasierMoodAppProps {
  session: Session | null;
}

export const EasierMoodApp: React.FC<EasierMoodAppProps> = ({ session }) => {
  // Check if we're on the landing page route
  const isLandingPage = window.location.pathname === '/easier-mood';
  
  // If we're on the landing page, show it without the app layout
  if (isLandingPage) {
    return <LandingPage session={session} />;
  }
  
  // Otherwise show the app with its layout
  return (
    <EasierMoodLayout>
      <Routes>
        <Route path="app" element={<Dashboard session={session} />} />
        <Route path="app/tracker" element={<MoodTracker session={session} />} />
        <Route path="app/journal" element={<Journal session={session} />} />
        <Route path="app/community" element={<Community session={session} />} />
        <Route path="app/resources" element={<Resources session={session} />} />
        <Route path="app/settings" element={<Settings session={session} />} />
      </Routes>
    </EasierMoodLayout>
  );
};
