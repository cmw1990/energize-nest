
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { ThemeProvider } from './components/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import NotFound from './components/NotFound';
import { BrowserRouter as Router } from 'react-router-dom';

// Create a client
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="wellness-ui-theme">
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/desktop" element={<Desktop />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/energy-plans" element={<EnergyPlans />} />
              <Route path="/energy-plans/create" element={<CreateEnergyPlanPage />} />
              <Route path="/energy-plans/edit/:id" element={<EditEnergyPlanPage />} />
              <Route path="/energy-plans/:id" element={<EnergyPlanDetailsPage />} />
              <Route path="/health" element={<HealthDashboard />} />
              <Route path="/motivation" element={<Motivation />} />
              <Route path="/supplements" element={<Supplements />} />
              <Route path="/nicotine" element={<Nicotine />} />
              <Route path="/recovery" element={<Recovery />} />
              <Route path="/sobriety" element={<Sobriety />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/brain-games" element={<BrainGames />} />
              <Route path="/productivity" element={<ProductivityDashboard />} />
              <Route path="/web-tools/*" element={<WebTools />} />
              <Route path="/why-us" element={<WhyUs />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
