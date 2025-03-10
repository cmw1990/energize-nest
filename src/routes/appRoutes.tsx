import { Navigate, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { AppLayout } from "@/components/AppLayout";
import { RouteGuard } from "@/routes/RouteGuard";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const Dashboard = lazy(() => import("@/pages/app/Dashboard"));
const Focus = lazy(() => import("@/pages/Focus"));
const Sleep = lazy(() => import("@/pages/Sleep"));
const Exercise = lazy(() => import("@/pages/Exercise"));
const MentalHealth = lazy(() => import("@/pages/MentalHealth"));
const EnergyPlans = lazy(() => import("@/pages/EnergyPlans"));
const Recovery = lazy(() => import("@/pages/Recovery"));
const Consultation = lazy(() => import("@/pages/Consultation"));
const Recipes = lazy(() => import("@/pages/Recipes"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const MentalEnergy = lazy(() => import("@/pages/energy/MentalEnergy"));
const PhysicalEnergy = lazy(() => import("@/pages/energy/PhysicalEnergy"));
const EnergyRecipes = lazy(() => import("@/pages/energy/Recipes"));
const DistractionBlocker = lazy(() => import("@/pages/DistractionBlocker"));
const DiagramPage = lazy(() => 
  import("@/pages/dev/studio/DiagramPage").then(module => ({
    default: module.DiagramPage
  }))
);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="focus" element={<Focus />} />
        <Route path="sleep" element={<Sleep />} />
        <Route path="exercise" element={<Exercise />} />
        <Route path="mental-health" element={<MentalHealth />} />
        <Route path="energy-plans" element={<EnergyPlans />} />
        <Route path="recovery" element={<Recovery />} />
        <Route path="consultation" element={<Consultation />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="energy">
          <Route path="mental" element={<MentalEnergy />} />
          <Route path="physical" element={<PhysicalEnergy />} />
          <Route path="recipes" element={<EnergyRecipes />} />
        </Route>
        <Route path="distractions" element={<DistractionBlocker />} />
      </Route>

      <Route path="/dev">
        <Route path="studio" element={
          <RouteGuard route={{ path: '/dev/studio', permission: 'public' }}>
            <DiagramPage />
          </RouteGuard>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
