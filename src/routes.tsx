import type { RouteObject } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import WebAppLayout from '@/layouts/WebAppLayout';
import PCAppLayout from '@/layouts/PCAppLayout';
import ExtensionLayout from '@/layouts/ExtensionLayout';
import MobileLayout from '@/layouts/MobileLayout';
import LandingPage from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import EnergyPlans from '@/pages/EnergyPlans';
import Analytics from '@/pages/Analytics';
import Focus from '@/pages/Focus';
import CMSLanding from './components/cms/CMSLanding';
import TinaCMSTest from './components/cms/TinaCMSTest';
import SanityTest from './components/cms/SanityTest';
import PayloadTest from './components/cms/PayloadTest';
import BuilderTest from './components/cms/BuilderTest';
import DecapTest from './components/cms/DecapTest';
import StoryblokTest from './components/cms/StoryblokTest';
import KeystoneTest from './components/cms/KeystoneTest';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth/*',
    element: <Auth />,
  },
  {
    path: '/tools',
    element: <AppLayout />,
    children: [
      {
        path: 'cms',
        element: <CMSLanding />,
      },
      {
        path: 'cms/tina',
        element: <TinaCMSTest />,
      },
      {
        path: 'cms/sanity',
        element: <SanityTest />,
      },
      {
        path: 'cms/payload',
        element: <PayloadTest />,
      },
      {
        path: 'cms/builder',
        element: <BuilderTest />,
      },
      {
        path: 'cms/decap',
        element: <DecapTest />,
      },
      {
        path: 'cms/storyblok',
        element: <StoryblokTest />,
      },
      {
        path: 'cms/keystone',
        element: <KeystoneTest />,
      },
      {
        path: 'energy-calculator',
        element: <EnergyPlans />,
      },
      {
        path: 'focus-timer',
        element: <Focus />,
      },
    ],
  },
  {
    path: '/webapp',
    element: <WebAppLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
    ],
  },
];
