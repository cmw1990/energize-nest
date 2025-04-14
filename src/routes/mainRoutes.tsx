
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

// Lazy load pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Sleep = lazy(() => import('@/pages/Sleep'));
const BeveragesPage = lazy(() => import('@/pages/Beverages'));
const Weight = lazy(() => import('@/pages/Weight'));
const Food = lazy(() => import('@/pages/Food'));
const Exercise = lazy(() => import('@/pages/Exercise'));
const Nutrition = lazy(() => import('@/pages/Nutrition'));
const MentalHealth = lazy(() => import('@/pages/MentalHealth'));
const Motivation = lazy(() => import('@/pages/Motivation'));
const Focus = lazy(() => import('@/pages/Focus'));
const CBT = lazy(() => import('@/pages/CBT'));
const Breathing = lazy(() => import('@/pages/Breathing'));
const BrainGames = lazy(() => import('@/pages/BrainGames'));
const DistractionManager = lazy(() => import('@/pages/DistractionManager'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const WebTools = lazy(() => import('@/pages/WebTools')); 
const Relax = lazy(() => import('@/pages/Relax'));
const Auth = lazy(() => import('@/pages/Auth'));
const Test = lazy(() => import('@/pages/Test'));
const Sobriety = lazy(() => import('@/pages/Sobriety'));
const NicotineProducts = lazy(() => import('@/pages/NicotineProducts'));
const Vendors = lazy(() => import('@/pages/Vendors'));
const TaperingGuide = lazy(() => import('@/pages/TaperingGuide'));

// Tools
const SmokingCostCalculator = lazy(() => import('@/pages/tools/SmokingCostCalculator'));

export const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'sleep', element: <Sleep /> },
      { path: 'beverages', element: <BeveragesPage /> },
      { path: 'weight', element: <Weight /> },
      { path: 'food', element: <Food /> },
      { path: 'exercise', element: <Exercise /> },
      { path: 'nutrition', element: <Nutrition /> },
      { path: 'mental-health', element: <MentalHealth /> },
      { path: 'motivation', element: <Motivation /> },
      { path: 'focus', element: <Focus /> },
      { path: 'cbt', element: <CBT /> },
      { path: 'breathing', element: <Breathing /> },
      { path: 'brain-games', element: <BrainGames /> },
      { path: 'distraction-manager', element: <DistractionManager /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'web-tools', element: <WebTools /> },
      { path: 'relax', element: <Relax /> },
      { path: 'test', element: <Test /> },
      { path: 'sobriety', element: <Sobriety /> },
      { path: 'nicotine-products', element: <NicotineProducts /> },
      { path: 'vendors', element: <Vendors /> },
      { path: 'tapering-guide', element: <TaperingGuide /> },
    ],
  },
  { path: '/auth', element: <Auth /> },
  { path: '/tools/smoking-cost-calculator', element: <SmokingCostCalculator /> },
];

export default mainRoutes;
