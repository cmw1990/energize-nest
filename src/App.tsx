import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import LoadingScreen from './components/LoadingScreen';
import { AuthProvider } from './components/AuthProvider';
import { DatabaseService } from './services/DatabaseService';
import { Button } from './components/ui/button';
import { ShieldAlert, LogIn, RefreshCw, Info, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { SUPABASE_URL, SUPABASE_KEY } from './integrations/supabase/db-client';
import { getSession } from './integrations/supabase/auth-client';
import { AuthDebugPanel } from './components/debug/AuthDebugPanel';
import { Session } from '@supabase/supabase-js';

// Import layouts
import { WebAppLayout } from './layouts/WebAppLayout';
import { MobileAppLayout } from './layouts/MobileAppLayout';
import { PCAppLayout } from './layouts/PCAppLayout';
import { ExtensionLayout } from './layouts/ExtensionLayout';

// Import core app components
import { LandingPage } from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import { Tools } from './pages/Tools';
import DistractionBlocker from './pages/DistractionBlocker';

// Import webapp components
import { WebappDashboard } from './pages/webapp/WebappDashboard';
import { WebappEnergy } from './pages/webapp/WebappEnergy';
import { WebappEnergyPlans } from './pages/webapp/WebappEnergyPlans';
import { WebappFocus } from './pages/webapp/WebappFocus';
import { WebappSleep } from './pages/webapp/WebappSleepOld';
import { WebappPerformance } from './pages/webapp/WebappPerformance';
import { WebappMentalHealth } from './pages/webapp/WebappMentalHealth';
import { WebappGuides } from './pages/webapp/WebappGuides';
import { WebappProfile } from './pages/webapp/WebappProfile';
import { WebappSettings } from './pages/webapp/WebappSettings';
import { WebappBreathing } from './pages/webapp/tools/WebappBreathing';
import { WebappMeditation } from './pages/webapp/tools/WebappMeditation';
import { WebappEyeExercises } from './pages/webapp/tools/WebappEyeExercises';
import { WebappCaffeine } from './pages/webapp/tools/WebappCaffeine';
import { WebappConsultation } from './pages/webapp/support/WebappConsultation';
import { WebappCycle } from './pages/webapp/wellness/WebappCycle';
import { WebappExercise } from './pages/webapp/wellness/WebappExercise';
import { WebappNutrition } from './pages/webapp/wellness/WebappNutrition';
import { WebappSupplements } from './pages/webapp/wellness/WebappSupplements';
import WebappNRTDirectory from './pages/webapp/WebappNRTDirectory';
import WebappAlternativeProducts from './pages/webapp/WebappAlternativeProducts';
import WebappQuittingGuides from './pages/webapp/WebappQuittingGuides';

// Import micro-frontend pages
// Comment out imports that don't exist yet
// import FocusPage from './app/webapp/focus/page';
// import SleepPage from './app/webapp/sleep/page';
import MissionFreshPage from './app/5001 mission-fresh/page';
import HertzBoxPage from './app/hertz-box/page';
import NoiseBoxPage from './app/noise-box/page';
import EasierManagePage from './app/easier-manage/page';
import EasierMoodPage from './app/easier-mood/page';
// import EasierSleepPage from './app/easier-sleep/page';
// import EasierFocusPage from './app/easier-focus/page';
import CareConnectorPage from './app/care-connector-4001/page';

// Import feature components
import { WhiteNoiseComponent } from './components/focus/WhiteNoiseComponent';
import { FocusTimerComponent } from './components/focus/FocusTimerComponent';

// Since we can't use useNavigate outside of Router context, we'll create a component that provides auth navigation
const AuthButton = () => {
  const navigate = useNavigate();
  return (
    <Button 
      onClick={() => navigate('/auth')}
      className="flex items-center gap-2"
    >
      <LogIn className="h-4 w-4" />
      Login / Sign Up
    </Button>
  );
};

// Private route component to ensure users are redirected to Mission Fresh if logged in
const PrivateRoute = ({ element }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage directly
        const token = localStorage.getItem('supabase.auth.token');
        if (token) {
          try {
            const parsedToken = JSON.parse(token);
            const accessToken = parsedToken?.currentSession?.access_token;
            
            if (accessToken) {
              // We have a token, now verify it's valid
              const sessionData = await getSession();
              setSession(sessionData);
            } else {
              // Only call setSession if it exists as a function
              if (typeof setSession === 'function') {
                setSession(null);
              } else {
                console.log('Session cleared (setSession not available)');
              }
            }
          } catch (e) {
            console.error('Error parsing token:', e);
            localStorage.removeItem('supabase.auth.token');
          }
        } else {
          // No token found, nothing to clear
          console.log('No session token found in localStorage');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Don't block the UI even if there's an error
        
        // Clean up any invalid session data
        localStorage.removeItem('supabase.auth.token');
        
        // Also clean up cookies for legacy reasons
        try {
          document.cookie.split(";").forEach(c => {
            const cookieName = c.split("=")[0].trim();
            if (cookieName.startsWith('sb-')) {
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              console.log(`Reset auth cookie: ${cookieName}`);
            }
          });
        } catch (e) {
          console.warn('Failed to reset auth cookies:', e);
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  if (loading) return <LoadingScreen message="Loading..." />;
  
  return session ? element : <Navigate to="/auth" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Landing Page - NO REDIRECTS */}
      <Route path="/" element={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Welcome to Well-Charged</h1>
          <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
            <Link to="/care-connector" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Care Connector
            </Link>
            <Link to="/mission-fresh" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
              Mission Fresh
            </Link>
            <Link to="/hertz-box" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg">
              Hertz Box
            </Link>
            <Link to="/noise-box" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg">
              Noise Box
            </Link>
            <Link to="/easier-manage" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg">
              Easier Manage
            </Link>
            <Link to="/easier-mood" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg">
              Easier Mood
            </Link>
            <Link to="/webapp" className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg">
              Well-Charged App
            </Link>
          </div>
        </div>
      } />
      
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/mission-fresh/auth" element={<AuthPage redirect="/mission-fresh/app" />} />
      <Route path="/care-connector/auth" element={<AuthPage redirect="/care-connector/webapp/dashboard" />} />
      <Route path="/easier-mood/auth" element={<AuthPage redirect="/easier-mood/app" />} />
      <Route path="/hertz-box/auth" element={<AuthPage redirect="/hertz-box/app" />} />
      <Route path="/noise-box/auth" element={<AuthPage redirect="/noise-box/app" />} />
      <Route path="/easier-manage/auth" element={<AuthPage redirect="/easier-manage/app" />} />
      
      {/* Tools Routes */}
      <Route path="/tools" element={<Tools />} />

      {/* Mission Fresh Routes */}
      <Route path="/mission-fresh/*" element={<MissionFreshPage />} />

      {/* Hertz Box Routes */}
      <Route path="/hertz-box/*" element={<HertzBoxPage />} />

      {/* Noise Box Routes */}
      <Route path="/noise-box/*" element={<NoiseBoxPage />} />
      
      {/* Easier Manage Routes */}
      <Route path="/easier-manage/*" element={<EasierManagePage />} />

      {/* Easier Mood Routes */}
      <Route path="/easier-mood/*" element={<EasierMoodPage />} />

      {/* SPECIAL DIRECT DASHBOARD ROUTE */}
      <Route path="/care-connector/webapp/dashboard" element={
        <React.Suspense fallback={<LoadingScreen message="Loading Dashboard..." />}>
          {/* Import the direct dashboard component */}
          {React.createElement(React.lazy(() => import('./app/care-connector-4001/dashboard')))}
        </React.Suspense>
      } />

      {/* SPECIAL DIRECT GROUPS ROUTE */}
      <Route path="/care-connector/webapp/groups" element={
        <React.Suspense fallback={<LoadingScreen message="Loading Groups..." />}>
          {/* Import the direct groups component */}
          {React.createElement(React.lazy(() => import('./app/care-connector-4001/groups')))}
        </React.Suspense>
      } />

      {/* SPECIAL DIRECT MARKETPLACE ROUTE */}
      <Route path="/care-connector/webapp/marketplace" element={
        <React.Suspense fallback={<LoadingScreen message="Loading Marketplace..." />}>
          {/* Import the direct marketplace component */}
          {React.createElement(React.lazy(() => import('./app/care-connector-4001/marketplace')))}
        </React.Suspense>
      } />

      {/* SPECIAL DIRECT TASKS ROUTE */}
      <Route path="/care-connector/webapp/tasks" element={
        <React.Suspense fallback={<LoadingScreen message="Loading Tasks..." />}>
          {/* Import the direct tasks component */}
          {React.createElement(React.lazy(() => import('./app/care-connector-4001/tasks')))}
        </React.Suspense>
      } />

      {/* SPECIAL DIRECT SETTINGS ROUTE */}
      <Route path="/care-connector/webapp/settings" element={
        <React.Suspense fallback={<LoadingScreen message="Loading Settings..." />}>
          {/* Import the direct settings component */}
          {React.createElement(React.lazy(() => import('./app/care-connector-4001/settings')))}
        </React.Suspense>
      } />

      {/* SPECIAL DIRECT GROUP DETAIL ROUTE */}
      <Route path="/care-connector/app/groups/:groupId" element={
        <React.Suspense fallback={<LoadingScreen message="Loading Group Details..." />}>
          {/* Import the direct group detail component */}
          {React.createElement(React.lazy(() => import('./app/care-connector-4001/group-detail')))}
        </React.Suspense>
      } />

      {/* Care Connector Routes */}
      <Route path="/care-connector/*" element={<CareConnectorPage />} />

      {/* WebApp Routes - Point to Well-Charged webapp, not Mission Fresh */}
      <Route path="/webapp" element={<WebAppLayout><WebappDashboard /></WebAppLayout>} />
      
      {/* Public Pages */}
      <Route path="/webapp/nrt-directory" element={<React.Suspense fallback={<LoadingScreen message="Loading NRT Directory..." />}><WebappNRTDirectory /></React.Suspense>} />
      <Route path="/webapp/alternative-products" element={<React.Suspense fallback={<LoadingScreen message="Loading Alternative Products..." />}><WebappAlternativeProducts /></React.Suspense>} />
      <Route path="/webapp/quitting-guides" element={<React.Suspense fallback={<LoadingScreen message="Loading Quitting Guides..." />}><WebappQuittingGuides /></React.Suspense>} />
      <Route path="/webapp/quitting-guides/:slug" element={<React.Suspense fallback={<LoadingScreen message="Loading Article..." />}><WebappQuittingGuides /></React.Suspense>} />
      <Route path="/webapp/caregivers" element={<React.Suspense fallback={<LoadingScreen message="Loading Caregivers..." />}><div>Caregivers Directory</div></React.Suspense>} />
      <Route path="/webapp/companions" element={<React.Suspense fallback={<LoadingScreen message="Loading Companions..." />}><div>Companions Directory</div></React.Suspense>} />
      <Route path="/webapp/facilities" element={<React.Suspense fallback={<LoadingScreen message="Loading Facilities..." />}><div>Care Facilities Directory</div></React.Suspense>} />
      <Route path="/webapp/resources" element={<React.Suspense fallback={<LoadingScreen message="Loading Resources..." />}><div>Caregiving Resources</div></React.Suspense>} />
      
      {/* WebApp main routes - Well-Charged specific */}
      <Route path="/webapp/dashboard" element={<PrivateRoute element={<WebAppLayout><WebappDashboard /></WebAppLayout>} />} />
      <Route path="/webapp/energy" element={<PrivateRoute element={<WebAppLayout><WebappEnergy /></WebAppLayout>} />} />
      <Route path="/webapp/energy/plans" element={<PrivateRoute element={<WebAppLayout><WebappEnergyPlans /></WebAppLayout>} />} />
      <Route path="/webapp/focus" element={<PrivateRoute element={<WebAppLayout><WebappFocus /></WebAppLayout>} />} />
      <Route path="/webapp/sleep" element={<PrivateRoute element={<WebAppLayout><WebappSleep /></WebAppLayout>} />} />
      <Route path="/webapp/performance" element={<PrivateRoute element={<WebAppLayout><WebappPerformance /></WebAppLayout>} />} />
      <Route path="/webapp/mental-health" element={<PrivateRoute element={<WebAppLayout><WebappMentalHealth /></WebAppLayout>} />} />
      <Route path="/webapp/guides" element={<PrivateRoute element={<WebAppLayout><WebappGuides /></WebAppLayout>} />} />
      <Route path="/webapp/profile" element={<PrivateRoute element={<WebAppLayout><WebappProfile /></WebAppLayout>} />} />
      <Route path="/webapp/settings" element={<PrivateRoute element={<WebAppLayout><WebappSettings /></WebAppLayout>} />} />
      
      {/* Catch all for webapp, redirect to dashboard */}
      <Route path="/webapp/*" element={<Navigate to="/webapp/dashboard" replace />} />
      
      {/* MobileApp Routes */}
      <Route path="/mobileapp/*" element={<MobileAppLayout />} />
      
      {/* PCApp Routes */}
      <Route path="/pcapp/*" element={<PCAppLayout />} />
      
      {/* Extension Routes */}
      <Route path="/ext/*" element={<ExtensionLayout />} />
      
      {/* Empty catch-all route - NO AUTO REDIRECTS */}
      <Route path="*" element={<div style={{padding: "20px"}}>
        <h1>Page Not Found</h1>
        <p>The requested page was not found. Please check the URL or navigate using the menu.</p>
      </div>} />
    </Routes>
  );
};

// Standalone component for error screen to use before Router context
const ErrorWithAuth = ({ 
  error,
  errorDetails,
  retry
}: { 
  error: string;
  errorDetails?: string;
  retry: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Alert variant="destructive" className="mb-4 max-w-md">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>{error}</AlertTitle>
        {errorDetails && <AlertDescription>{errorDetails}</AlertDescription>}
      </Alert>
      
      <div className="flex gap-4">
        <Button onClick={retry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
        
        <Link to="/auth">
          <Button variant="default" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Login / Sign Up
          </Button>
        </Link>
      </div>
      
      {SUPABASE_URL && (
        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-1">
            <Info className="h-3 w-3" />
            Connected to Supabase at {SUPABASE_URL.replace('https://', '')}
          </p>
        </div>
      )}
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [errorDetails, setErrorDetails] = useState<undefined | string>(undefined);
  
  // Initialize app but with minimal checks for faster loading
  useEffect(() => {
    const initApp = async () => {
      try {
        // Check if we have a valid token in localStorage
        const token = localStorage.getItem('supabase.auth.token');
        if (token) {
          try {
            const parsedToken = JSON.parse(token);
            
            // Check for different token formats
            const accessToken = parsedToken?.currentSession?.access_token;
            
            // Log token structure for debugging
            console.log('Token structure:', JSON.stringify({
              hasCurrentSession: !!parsedToken?.currentSession,
              hasAccessToken: !!accessToken
            }));
            
            // If we have an accessToken, consider it valid
            if (accessToken) {
              // We have a valid token
              console.log('Auth status check: Found session token');
              
              // Force reload auth state after validating token
              const sessionData = await getSession();
              if (sessionData) {
                console.log('User session validated successfully');
              }
              
              return; // Valid token, exit early
            }
          } catch (e) {
            console.error('Error parsing token:', e);
            localStorage.removeItem('supabase.auth.token');
          }
        } else {
          // No token found, nothing to clear
          console.log('No session token found in localStorage');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Don't block the UI even if there's an error
        
        // Clean up any invalid session data
        localStorage.removeItem('supabase.auth.token');
        
        // Also clean up cookies for legacy reasons
        try {
          document.cookie.split(";").forEach(c => {
            const cookieName = c.split("=")[0].trim();
            if (cookieName.startsWith('sb-')) {
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              console.log(`Reset auth cookie: ${cookieName}`);
            }
          });
        } catch (e) {
          console.warn('Failed to reset auth cookies:', e);
        }
      }
    };
    
    // Run the auth check in the background
    initApp();
  }, []);
  
  const retry = () => {
    setError(null);
    setErrorDetails(undefined);
    window.location.reload();
  };
  
  // Skip loading screen and go straight to app
  // When error, show error screen
  if (error) {
    return <ErrorWithAuth error={error} errorDetails={errorDetails} retry={retry} />;
  }
  
  // Main app render without a BrowserRouter - assuming parent has already created one
  return (
    <DndContext>
      <Suspense fallback={<LoadingScreen message="Loading Mission Fresh..." />}>
        <AppRoutes />
      </Suspense>
      <Toaster />
      {process.env.NODE_ENV === 'development' && <AuthDebugPanel />}
    </DndContext>
  );
}

export default App;
