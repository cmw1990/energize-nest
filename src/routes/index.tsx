import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AppLayout from '@/layouts/AppLayout';
import LandingLayout from '@/layouts/LandingLayout';

// Lazy load pages
const Landing = lazy(() => import('@/pages/Landing'));
const Dashboard = lazy(() => import('@/pages/app/Dashboard'));
const Focus = lazy(() => import('@/pages/Focus'));
const Sleep = lazy(() => import('@/pages/app/Sleep'));
const Exercise = lazy(() => import('@/pages/app/Exercise'));
const MentalHealth = lazy(() => import('@/pages/app/MentalHealth'));
const EnergyPlans = lazy(() => import('@/pages/app/EnergyPlans'));
const DevStudio = lazy(() => import('@/components/dev-studio/DevStudio'));

// Route metadata types
export interface RouteMetadata {
  title: string;
  description?: string;
  requiresAuth?: boolean;
  isPublic?: boolean;
}

// Extended route type with metadata
export interface AppRoute extends RouteObject {
  metadata?: RouteMetadata;
  children?: AppRoute[];
}

// Route configuration
export const routes: AppRoute[] = [
  {
    path: '/',
    element: <LandingLayout />,
    metadata: {
      title: 'Welcome',
      isPublic: true
    },
    children: [
      {
        index: true,
        element: <Landing />,
        metadata: {
          title: 'Home',
          description: 'Welcome to EnergyNest',
          isPublic: true
        }
      }
    ]
  },
  {
    path: '/app',
    element: <AppLayout />,
    metadata: {
      title: 'App',
      requiresAuth: false // Following memory rule about no auth
    },
    children: [
      {
        index: true,
        element: <Dashboard />,
        metadata: {
          title: 'Dashboard',
          description: 'Your energy management dashboard'
        }
      },
      {
        path: 'focus',
        element: <Focus />,
        metadata: {
          title: 'Focus',
          description: 'Improve your focus and productivity'
        }
      },
      {
        path: 'sleep',
        element: <Sleep />,
        metadata: {
          title: 'Sleep',
          description: 'Track and improve your sleep quality'
        }
      },
      {
        path: 'exercise',
        element: <Exercise />,
        metadata: {
          title: 'Exercise',
          description: 'Track your physical activities'
        }
      },
      {
        path: 'mental-health',
        element: <MentalHealth />,
        metadata: {
          title: 'Mental Health',
          description: 'Monitor and improve your mental wellbeing'
        }
      },
      {
        path: 'energy-plans',
        element: <EnergyPlans />,
        metadata: {
          title: 'Energy Plans',
          description: 'Manage your energy optimization plans'
        }
      }
    ]
  },
  {
    path: '/dev/studio',
    element: <MainLayout />,
    metadata: {
      title: 'Dev Studio',
      description: 'Visual development environment'
    },
    children: [
      {
        index: true,
        element: <DevStudio />,
        metadata: {
          title: 'Visual Editor'
        }
      }
    ]
  }
];

// Helper functions for route management
export const findRouteByPath = (path: string): AppRoute | undefined => {
  const findRoute = (routes: AppRoute[], targetPath: string): AppRoute | undefined => {
    for (const route of routes) {
      if (route.path === targetPath) return route;
      if (route.children) {
        const found = findRoute(route.children, targetPath);
        if (found) return found;
      }
    }
    return undefined;
  };
  
  return findRoute(routes, path);
};

export const getBreadcrumbs = (path: string): { title: string; path: string }[] => {
  const parts = path.split('/').filter(Boolean);
  const breadcrumbs: { title: string; path: string }[] = [];
  let currentPath = '';

  parts.forEach((part) => {
    currentPath += `/${part}`;
    const route = findRouteByPath(currentPath);
    if (route?.metadata?.title) {
      breadcrumbs.push({
        title: route.metadata.title,
        path: currentPath
      });
    }
  });

  return breadcrumbs;
};
