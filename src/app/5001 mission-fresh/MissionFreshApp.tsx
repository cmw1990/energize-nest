import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { MissionFreshLayout } from './components/MissionFreshLayout';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Progress } from './components/Progress';
import { Settings } from './components/Settings';
import { Community } from './components/Community';
import { GuidesHub } from './components/GuidesHub';
import { WebTools } from './components/WebTools';
import { NRTDirectory } from './components/NRTDirectory';
import { AlternativeProducts } from './components/AlternativeProducts';
import { ConsumptionLogger } from './components/ConsumptionLogger';

interface MissionFreshAppProps {
  session: Session | null;
}

export const MissionFreshApp: React.FC<MissionFreshAppProps> = ({ session }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for app initialization
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Mission Fresh...</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Preparing your smoke-free journey</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage session={session} />} />
      <Route
        path="/app/*"
        element={
          <MissionFreshLayout session={session}>
            <Routes>
              <Route path="/" element={<Dashboard session={session} />} />
              <Route path="/progress" element={<Progress session={session} />} />
              <Route path="/settings" element={<Settings session={session} />} />
              <Route path="/community" element={<Community session={session} />} />
              <Route path="/guides" element={<GuidesHub session={session} />} />
              <Route path="/tools" element={<WebTools session={session} />} />
              <Route path="/nrt-directory" element={<NRTDirectory session={session} />} />
              <Route path="/alternative-products" element={<AlternativeProducts session={session} />} />
              <Route path="/consumption-logger" element={<ConsumptionLogger session={session} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MissionFreshLayout>
        }
      />
    </Routes>
  );
};
