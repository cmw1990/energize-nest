import { ReactNode } from 'react';

export interface RouteConfig {
  path: string;
  title: string;
  description?: string;
  component: string;
  layout?: string;
  icon?: string;
  permission?: 'public' | 'authenticated' | 'premium' | 'admin';
  children?: RouteConfig[];
  meta?: {
    requiresAuth?: boolean;
    roles?: string[];
    features?: string[];
    platform?: string[];
    minVersion?: string;
    betaAccess?: boolean;
  };
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    title: 'Landing',
    component: 'Landing',
    permission: 'public',
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    component: 'Dashboard',
    permission: 'authenticated',
    layout: 'AppLayout',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/health',
    title: 'Health',
    component: 'Health',
    permission: 'authenticated',
    layout: 'AppLayout',
    children: [
      {
        path: 'activity',
        title: 'Activity Tracking',
        component: 'ActivityTracker'
      },
      {
        path: 'water',
        title: 'Water Intake',
        component: 'WaterIntakeTracker'
      }
    ]
  },
  {
    path: '/quit-plan',
    title: 'Quit Plan',
    component: 'QuitPlan',
    permission: 'authenticated',
    layout: 'AppLayout'
  },
  {
    path: '/support',
    title: 'Support',
    component: 'Support',
    permission: 'authenticated',
    layout: 'AppLayout'
  },
  {
    path: '/professional',
    title: 'Professional',
    component: 'Professional',
    permission: 'premium',
    layout: 'AppLayout',
    children: [
      {
        path: 'dashboard',
        title: 'Professional Dashboard',
        component: 'ProfessionalDashboard'
      },
      {
        path: 'clients',
        title: 'Client Management',
        component: 'ClientManagement'
      }
    ]
  },
  {
    path: '/admin',
    title: 'Admin',
    component: 'Admin',
    permission: 'admin',
    layout: 'AppLayout',
    meta: {
      roles: ['admin']
    }
  }
];
