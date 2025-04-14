import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider";
import { queryClient } from "./lib/query-client";

import { AuthProvider } from "./components/AuthProvider";
import { Layout } from "./components/Layout";
import { LandingPage } from "./LandingPage";

import Weight from "./pages/Weight";
import { BeveragesPage } from "./pages/Beverages";

import Dashboard from './pages/Dashboard';
import Desktop from './pages/Desktop';
import Tasks from './pages/Tasks';
import EnergyPlans from './pages/EnergyPlans';
import CreateEnergyPlanPage from './pages/CreateEnergyPlanPage';
import { EditEnergyPlanPage } from './pages/EditEnergyPlanPage';
import { EnergyPlanDetailsPage } from './pages/EnergyPlanDetailsPage';
import HealthDashboard from './pages/HealthDashboard';
import Motivation from './pages/Motivation';
import Supplements from './pages/Supplements';
import Nicotine from './pages/Nicotine';
import Recovery from './pages/Recovery';
import Sobriety from './pages/Sobriety';
import Nutrition from './pages/Nutrition';
import BrainGames from './pages/BrainGames';
import ProductivityDashboard from './pages/ProductivityDashboard';
import WebTools from './pages/WebTools';
import LandingPage from './pages/LandingPage';
import WhyUs from './pages/WhyUs';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';
import Focus from './pages/Focus';
import Meditation from './pages/Meditation';
import Sleep from './pages/Sleep';
import Relax from './pages/Relax';
import DistractionManager from './pages/DistractionManager';
import SleepTracking from './pages/SleepTracking';
import Breathing from './pages/Breathing';
import CBT from './pages/CBT';
import Cycle from './pages/Cycle';
import Caffeine from './pages/Caffeine';
import SleepCalculator from './pages/tools/SleepCalculator';
import SleepGoals from './pages/tools/SleepGoals';
import WithdrawalTracker from './pages/tools/WithdrawalTracker';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Help from './pages/Help';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (replaced cacheTime which is deprecated)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="wellness-ui-theme">
          <AuthProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/why-us" element={<WhyUs />} />
              
              <Route path="/app" element={<Layout />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="desktop" element={<Desktop />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="energy-plans" element={<EnergyPlans />} />
                <Route path="energy-plans/create" element={<CreateEnergyPlanPage />} />
                <Route path="energy-plans/edit/:id" element={<EditEnergyPlanPage />} />
                <Route path="energy-plans/:id" element={<EnergyPlanDetailsPage />} />
                <Route path="health" element={<HealthDashboard />} />
                <Route path="motivation" element={<Motivation />} />
                <Route path="supplements" element={<Supplements />} />
                <Route path="nicotine" element={<Nicotine />} />
                <Route path="recovery" element={<Recovery />} />
                <Route path="sobriety" element={<Sobriety />} />
                <Route path="nutrition" element={<Nutrition />} />
                <Route path="brain-games" element={<BrainGames />} />
                <Route path="productivity" element={<ProductivityDashboard />} />
                <Route path="web-tools/*" element={<WebTools />} />
                <Route path="focus" element={<Focus />} />
                <Route path="distraction-manager" element={<DistractionManager />} />
                <Route path="sleep" element={<Sleep />} />
                <Route path="sleep-tracking" element={<SleepTracking />} />
                <Route path="meditation" element={<Meditation />} />
                <Route path="breathing" element={<Breathing />} />
                <Route path="relax" element={<Relax />} />
                <Route path="cbt" element={<CBT />} />
                <Route path="cycle" element={<Cycle />} />
                <Route path="caffeine" element={<Caffeine />} />
                <Route path="community" element={<Community />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<Help />} />
                
                <Route path="web-tools/sleep-calculator" element={<SleepCalculator />} />
                <Route path="web-tools/sleep-goals" element={<SleepGoals />} />
                <Route path="web-tools/withdrawal-tracker" element={<WithdrawalTracker />} />
                <Route path="/app/breathing" element={<Breathing />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/error" element={<ErrorPage />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
