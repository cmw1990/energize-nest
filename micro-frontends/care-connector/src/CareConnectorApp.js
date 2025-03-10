import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { CareConnectorLayout } from './components/CareConnectorLayout';
import { VisitorLayout } from './components/VisitorLayout';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { GroupDetail } from './components/GroupDetail';
import CareGroups from './components/CareGroups';
import { Settings } from './components/Settings';
import { Marketplace } from './components/Marketplace';
import { TaskManager } from './components/TaskManager';
import { HealthMonitoring } from './components/HealthMonitoring';
import SimpleCreateGroupPage from './pages/SimpleCreateGroupPage';
import TestCreateGroupPage from './pages/TestCreateGroupPage';
import CaregiverConnector from './components/CaregiverConnector';
import PalConnector from './components/PalConnector';
import JusticeConnector from './components/JusticeConnector';
import CareFacilitiesComparer from './components/CareFacilitiesComparer';
import CareProductComparer from './components/CareProductComparer';
import { Toaster } from 'react-hot-toast';

// Constants for API
const API_URL = import.meta.env.VITE_SUPABASE_URL || 'https://example.com';
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Main app component
const CareConnectorApp = ({ 
  supabaseClient: externalSupabaseClient,
  session: externalSession 
}) => {
  // Create internal supabase client if not provided
  const [supabaseClient] = useState(() => {
    if (externalSupabaseClient) return externalSupabaseClient;
    
    // Use environment variables or fallback to defaults
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
    
    return createClient(supabaseUrl, supabaseKey);
  });
  
  // Manage session state
  const [session, setSession] = useState(externalSession || null);
  
  // Listen for auth changes if using internal session management
  useEffect(() => {
    if (!externalSession) {
      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
        }
      );
      
      return () => subscription.unsubscribe();
    }
  }, [supabaseClient, externalSession]);
  
  // Private route component to ensure users are redirected to auth if not logged in
  const PrivateRoute = ({ element }) => {
    // For development, always allow access
    return <>{element}</>;
  };
  
  return (
    <div className="care-connector-app">
      <Toaster position="top-right" />
      
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage session={session} />} />
        
        {/* App Routes */}
        <Route element={<CareConnectorLayout session={session}>
          <Outlet />
        </CareConnectorLayout>}>
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard session={session} supabaseClient={supabaseClient} />} />} />
          <Route path="/groups" element={<PrivateRoute element={<CareGroups session={session} supabaseClient={supabaseClient} />} />} />
          <Route path="/groups/:groupId" element={<PrivateRoute element={<GroupDetail session={session} />} />} />
          <Route path="/marketplace" element={<PrivateRoute element={<Marketplace session={session} supabaseClient={supabaseClient} />} />} />
          <Route path="/tasks" element={<PrivateRoute element={<TaskManager session={session} supabaseClient={supabaseClient} />} />} />
          <Route path="/settings" element={<PrivateRoute element={<Settings session={session} supabaseClient={supabaseClient} />} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default CareConnectorApp; 
