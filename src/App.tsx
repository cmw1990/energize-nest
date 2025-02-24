import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthProvider } from './components/AuthProvider'; // Import AuthProvider

// Import layouts
import { WebAppLayout } from './layouts/WebAppLayout';
import { MobileAppLayout } from './layouts/MobileAppLayout';
import { PCAppLayout } from './layouts/PCAppLayout';
import { ExtensionLayout } from './layouts/ExtensionLayout';

// Import core app components
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Tools } from './pages/Tools';

// Import webapp components
import { WebappDashboard } from './pages/webapp/WebappDashboard';
import { WebappEnergy } from './pages/webapp/WebappEnergy';
import { WebappEnergyPlans } from './pages/webapp/WebappEnergyPlans';
import { WebappFocus } from './pages/webapp/WebappFocus';
import { WebappSleep } from './pages/webapp/WebappSleep';
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth Route */}
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Tools Routes */}
      <Route path="/tools" element={<Tools />} />

      {/* WebApp Routes */}
      <Route path="/webapp" element={<WebAppLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<WebappDashboard />} />
        <Route path="energy" element={<WebappEnergy />} />
        <Route path="energy-plans" element={<WebappEnergyPlans />} />
        <Route path="focus" element={<WebappFocus />} />
        <Route path="sleep" element={<WebappSleep />} />
        <Route path="performance" element={<WebappPerformance />} />
        <Route path="mental-health" element={<WebappMentalHealth />} />
        <Route path="exercise" element={<WebappExercise />} />
        <Route path="nutrition" element={<WebappNutrition />} />
        <Route path="supplements" element={<WebappSupplements />} />
        <Route path="cycle" element={<WebappCycle />} />
        <Route path="breathing" element={<WebappBreathing />} />
        <Route path="meditation" element={<WebappMeditation />} />
        <Route path="eye-exercises" element={<WebappEyeExercises />} />
        <Route path="caffeine" element={<WebappCaffeine />} />
        <Route path="guides" element={<WebappGuides />} />
        <Route path="consultation" element={<WebappConsultation />} />
        <Route path="settings" element={<WebappSettings />} />
        <Route path="profile" element={<WebappProfile />} />
      </Route>
      
      {/* MobileApp Routes */}
      <Route path="/mobileapp/*" element={<MobileAppLayout />} />
      
      {/* PCApp Routes */}
      <Route path="/pcapp/*" element={<PCAppLayout />} />
      
      {/* Extension Routes */}
      <Route path="/ext/*" element={<ExtensionLayout />} />
      
      {/* Legacy Redirects */}
      <Route path="/admin/*" element={<Navigate to="/tools" replace />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DndContext>
          <AuthProvider>
            <Suspense fallback={<LoadingScreen />}>
              <AppRoutes />
            </Suspense>
            <Toaster />
          </AuthProvider>
        </DndContext>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
