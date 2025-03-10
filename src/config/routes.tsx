import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { LandingLayout } from '@/layouts/LandingLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load components
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const Dashboard = lazy(() => import('@/pages/app/Dashboard'));
const Focus = lazy(() => import('@/pages/app/Focus'));
const Sleep = lazy(() => import('@/pages/app/Sleep'));
const Exercise = lazy(() => import('@/pages/app/Exercise'));
const MentalHealth = lazy(() => import('@/pages/app/MentalHealth'));
const EnergyPlans = lazy(() => import('@/pages/app/EnergyPlans'));
const Recovery = lazy(() => import('@/pages/app/Recovery'));
const Consultation = lazy(() => import('@/pages/app/Consultation'));
const Recipes = lazy(() => import('@/pages/app/Recipes'));
const Analytics = lazy(() => import('@/pages/app/Analytics'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  );
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: withSuspense(Landing),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: withSuspense(Login),
      },
      {
        path: 'register',
        element: withSuspense(Register),
      },
    ],
  },
  {
    path: '/app',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      {
        path: 'dashboard',
        element: withSuspense(Dashboard),
      },
      {
        path: 'focus',
        element: withSuspense(Focus),
      },
      {
        path: 'sleep',
        element: withSuspense(Sleep),
      },
      {
        path: 'exercise',
        element: withSuspense(Exercise),
      },
      {
        path: 'mental-health',
        element: withSuspense(MentalHealth),
      },
      {
        path: 'energy-plans',
        element: withSuspense(EnergyPlans),
      },
      {
        path: 'recovery',
        element: withSuspense(Recovery),
      },
      {
        path: 'consultation',
        element: withSuspense(Consultation),
      },
      {
        path: 'recipes',
        element: withSuspense(Recipes),
      },
      {
        path: 'analytics',
        element: withSuspense(Analytics),
      },
    ],
  },
  {
    path: '*',
    element: withSuspense(NotFound),
  },
];
