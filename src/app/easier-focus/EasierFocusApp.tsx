import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { EasierFocusLayout } from './components/EasierFocusLayout';
// import { Dashboard } from './components/Dashboard'; // Component doesn't exist yet
import { Pomodoro } from './components/Pomodoro';
// import { TaskManager } from './components/TaskManager'; // Component doesn't exist yet
// import { FocusMusic } from './components/FocusMusic'; // Component doesn't exist yet
// import { Analytics } from './components/Analytics'; // Component doesn't exist yet
// import { Settings } from './components/Settings'; // Component doesn't exist yet
// import { LandingPage } from './components/LandingPage'; // Component doesn't exist yet

interface EasierFocusAppProps {
  session: Session | null;
}

export const EasierFocusApp: React.FC<EasierFocusAppProps> = ({ session }) => {
  // Check if we're on the landing page route
  const isLandingPage = window.location.pathname === '/easier-focus';
  
  // If we're on the landing page, show landing page (to be created)
  if (isLandingPage) {
    // For now, redirect to the app since landing page doesn't exist
    window.location.href = '/easier-focus/app/pomodoro';
    return null;
  }
  
  // Otherwise show the app with its layout
  return (
    <EasierFocusLayout>
      <Routes>
        {/* <Route path="app" element={<Dashboard session={session} />} /> */}
        <Route path="app/pomodoro" element={<Pomodoro session={session} />} />
        {/* <Route path="app/tasks" element={<TaskManager session={session} />} /> */}
        {/* <Route path="app/music" element={<FocusMusic session={session} />} /> */}
        {/* <Route path="app/analytics" element={<Analytics session={session} />} /> */}
        {/* <Route path="app/settings" element={<Settings session={session} />} /> */}
      </Routes>
    </EasierFocusLayout>
  );
};
