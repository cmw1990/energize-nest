import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
// Import createClient from supabase
import { createClient } from '@supabase/supabase-js';
// Remove Session import and rely on prop types
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
import { ProviderDetail } from './components/ProviderDetail';
import { Toaster } from 'react-hot-toast';
import Auth from './components/Auth';

// Constants for API
const API_URL = import.meta.env.VITE_SUPABASE_URL || 'https://example.com';
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Main app component
export const CareConnectorApp = ({ 
  supabaseClient: externalSupabaseClient,
  session: externalSession 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
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
  const [isLoading, setIsLoading] = useState(false);
  
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
      
      {isLoading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg">Loading Care Connector...</p>
          </div>
        </div>
      ) : (
        <Routes>
          {/* Landing Page Routes */}
          <Route path="/" element={<LandingPage session={session} />} />
          <Route path="/care-connector" element={<LandingPage session={session} />} />
          
          {/* Auth Routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/care-connector/auth" element={<Auth />} />
          
          {/* Dedicated WebApp Routes for Visitor Layout */}
          <Route path="/care-connector/webapp/caregiver-connector" element={
            <VisitorLayout>
              <CaregiverConnector session={session} />
            </VisitorLayout>
          } />
          
          <Route path="/care-connector/webapp/pal-connector" element={
            <VisitorLayout>
              <PalConnector session={session} />
            </VisitorLayout>
          } />
          
          <Route path="/care-connector/webapp/justice-connector" element={
            <VisitorLayout>
              <JusticeConnector session={session} />
            </VisitorLayout>
          } />
          
          <Route path="/care-connector/webapp/facilities-comparer" element={
            <VisitorLayout>
              <CareFacilitiesComparer session={session} />
            </VisitorLayout>
          } />
          
          <Route path="/care-connector/webapp/product-comparer" element={
            <VisitorLayout>
              <CareProductComparer session={session} />
            </VisitorLayout>
          } />

          {/* Redirect from /care-connector/webapp to /care-connector/webapp/dashboard */}
          <Route path="/care-connector/webapp" element={<Navigate to="/care-connector/webapp/dashboard" replace />} />
          
          {/* Dashboard and authenticated routes with CareConnectorLayout */}
          <Route path="/care-connector/webapp/dashboard/*" element={
            <CareConnectorLayout session={session}>
              <Dashboard session={session} />
            </CareConnectorLayout>
          } />
          
          <Route path="/care-connector/webapp/groups" element={
            <CareConnectorLayout session={session}>
              <CareGroups session={session} supabaseClient={supabaseClient} />
            </CareConnectorLayout>
          } />
          
          <Route path="/care-connector/webapp/groups/:groupId" element={
            <CareConnectorLayout session={session}>
              <GroupDetail session={session} />
            </CareConnectorLayout>
          } />
          
          <Route path="/care-connector/webapp/tasks" element={
            <CareConnectorLayout session={session}>
              <TaskManager session={session} supabaseClient={supabaseClient} />
            </CareConnectorLayout>
          } />
          
          <Route path="/care-connector/webapp/settings" element={
            <CareConnectorLayout session={session}>
              <Settings session={session} supabaseClient={supabaseClient} />
            </CareConnectorLayout>
          } />
          
          <Route path="/care-connector/webapp/marketplace" element={
            <CareConnectorLayout session={session}>
              <Marketplace session={session} supabaseClient={supabaseClient} />
            </CareConnectorLayout>
          } />
          
          <Route path="/care-connector/webapp/health" element={
            <CareConnectorLayout session={session}>
              <HealthMonitoring session={session} />
            </CareConnectorLayout>
          } />
          
          <Route path="/care-connector/webapp/providers/:providerId" element={
            <CareConnectorLayout session={session}>
              <ProviderDetail session={session} />
            </CareConnectorLayout>
          } />
          
          <Route path="/care-connector/webapp/create-group" element={
            <CareConnectorLayout session={session}>
              <SimpleCreateGroupPage />
            </CareConnectorLayout>
          } />
          
          <Route path="/care-connector/webapp/test-create-group" element={
            <CareConnectorLayout session={session}>
              <TestCreateGroupPage />
            </CareConnectorLayout>
          } />
          
          {/* Legacy routes without /care-connector prefix for backward compatibility */}
          <Route path="/dashboard" element={
            <CareConnectorLayout session={session}>
              <Dashboard session={session} />
            </CareConnectorLayout>
          } />
          
          <Route path="/groups" element={
            <CareConnectorLayout session={session}>
              <CareGroups session={session} supabaseClient={supabaseClient} />
            </CareConnectorLayout>
          } />
          
          <Route path="/groups/:groupId" element={
            <CareConnectorLayout session={session}>
              <GroupDetail session={session} />
            </CareConnectorLayout>
          } />
          
          <Route path="/marketplace" element={
            <CareConnectorLayout session={session}>
              <Marketplace session={session} supabaseClient={supabaseClient} />
            </CareConnectorLayout>
          } />
          
          <Route path="/tasks" element={
            <CareConnectorLayout session={session}>
              <TaskManager session={session} supabaseClient={supabaseClient} />
            </CareConnectorLayout>
          } />
          
          <Route path="/settings" element={
            <CareConnectorLayout session={session}>
              <Settings session={session} supabaseClient={supabaseClient} />
            </CareConnectorLayout>
          } />
          
          {/* Legacy WebApp Routes without /care-connector prefix */}
          <Route path="/webapp/caregiver-connector" element={
            <VisitorLayout>
              <CaregiverConnector session={session} />
            </VisitorLayout>
          } />
          
          <Route path="/webapp/pal-connector" element={
            <VisitorLayout>
              <PalConnector session={session} />
            </VisitorLayout>
          } />
          
          <Route path="/webapp/justice-connector" element={
            <VisitorLayout>
              <JusticeConnector session={session} />
            </VisitorLayout>
          } />

          {/* Catch-all route for 404 */}
          <Route path="*" element={
            <div className="not-found p-6">
              <h1 className="text-2xl font-bold mb-4">Care Connector - Page Not Found</h1>
              <p className="mb-4">The requested page was not found. Please navigate using the menu.</p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => navigate('/care-connector')}
              >
                Go to Home
              </button>
            </div>
          } />
        </Routes>
      )}
    </div>
  );
};

export default CareConnectorApp; 
