import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { MissionFreshLayout } from './components/MissionFreshLayout.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { Progress } from './components/Progress.tsx';
import { Settings } from './components/Settings.tsx';
import { Community } from './components/Community.tsx';
import { GuidesHub } from './components/GuidesHub.tsx';
import { WebTools } from './components/WebTools.tsx';
import { NRTDirectory } from './components/NRTDirectory.tsx';
import { AlternativeProducts } from './components/AlternativeProducts.tsx';
import { ConsumptionLogger } from './components/ConsumptionLogger.tsx';
import { AuthProvider } from './components/AuthProvider.tsx';
import TaskManager from './components/TaskManager.tsx';

interface MissionFreshAppProps {
  session: Session | null;
}

// Auth component that renders a simple login form
const Auth: React.FC<{ session: Session | null }> = ({ session }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (session) {
      navigate('/app');
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, this would connect to a real auth service
      console.log('Logging in with', email);
      // Simulate successful login after 1 second
      setTimeout(() => {
        setIsLoading(false);
        // For demo, just navigate to app
        navigate('/app');
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                start your 14-day free trial
              </a>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-green-600 hover:text-green-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex-1 hidden w-0 lg:block">
        <img
          className="absolute inset-0 object-cover w-full h-full"
          src="https://images.unsplash.com/photo-1505816014357-96b5ff457e9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1691&q=80"
          alt="Fresh air in nature"
        />
      </div>
    </div>
  );
};

export const MissionFreshApp: React.FC<MissionFreshAppProps> = ({ session }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for app initialization
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Log the current location to help with debugging
  useEffect(() => {
    console.log("Current location:", location.pathname);
  }, [location]);

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
    <AuthProvider>
      <Routes>
        {/* Landing page route */}
        <Route path="/" element={<LandingPage session={session} />} />

        {/* Auth route */}
        <Route path="auth" element={<Auth session={session} />} />

        {/* App routes - all handled by MissionFreshLayout */}
        <Route path="app" element={<MissionFreshLayout session={session}>
          <Dashboard session={session} />
        </MissionFreshLayout>} />
        
        <Route path="app/progress" element={<MissionFreshLayout session={session}>
          <Progress session={session} />
        </MissionFreshLayout>} />
        
        <Route path="app/settings" element={<MissionFreshLayout session={session}>
          <Settings session={session} />
        </MissionFreshLayout>} />
        
        <Route path="app/community" element={<MissionFreshLayout session={session}>
          <Community session={session} />
        </MissionFreshLayout>} />
        
        <Route path="app/guides" element={<MissionFreshLayout session={session}>
          <GuidesHub session={session} />
        </MissionFreshLayout>} />
        
        <Route path="app/tools" element={<MissionFreshLayout session={session}>
          <WebTools session={session} />
        </MissionFreshLayout>} />
        
        <Route path="app/nrt-directory" element={<MissionFreshLayout session={session}>
          <NRTDirectory session={session} />
        </MissionFreshLayout>} />
        
        <Route path="app/alternative-products" element={<MissionFreshLayout session={session}>
          <AlternativeProducts session={session} />
        </MissionFreshLayout>} />
        
        <Route path="app/consumption-logger" element={<MissionFreshLayout session={session}>
          <ConsumptionLogger session={session} />
        </MissionFreshLayout>} />

        <Route path="app/tasks" element={<MissionFreshLayout session={session}>
          <TaskManager session={session} />
        </MissionFreshLayout>} />

        {/* Catch-all route to redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};
