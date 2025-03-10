import { RouteObject } from 'react-router-dom';
import { Platform } from '@/utils/platform';
import { createLazyComponent, COMPONENT_PATHS } from '@/utils/paths';
import React from 'react';

// Lazy load components
const RootLayout = createLazyComponent(COMPONENT_PATHS.RootLayout);
const Landing = createLazyComponent(COMPONENT_PATHS.Landing);
const Login = createLazyComponent(COMPONENT_PATHS.Login);
const Register = createLazyComponent(COMPONENT_PATHS.Register);
const ForgotPassword = createLazyComponent(COMPONENT_PATHS.ForgotPassword);
const AppLayout = createLazyComponent(COMPONENT_PATHS.AppLayout);
const Dashboard = createLazyComponent(COMPONENT_PATHS.Dashboard);
const Profile = createLazyComponent(COMPONENT_PATHS.Profile);
const Settings = createLazyComponent(COMPONENT_PATHS.Settings);
const ErrorBoundary = createLazyComponent(COMPONENT_PATHS.ErrorBoundary);

/**
 * Platform-specific route configuration
 */
export const platformRoutes = {
  webapp: [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/app/*'
  ],
  webtool: [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password'
  ],
  desktop: [
    '/auth/login',
    '/app/*'
  ],
  mobile: [
    '/auth/login',
    '/app/*'
  ]
} as const;

/**
 * React Router configuration
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: React.createElement(RootLayout),
    errorElement: React.createElement(ErrorBoundary),
    children: [
      {
        path: '',
        element: React.createElement(Landing),
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: React.createElement(Login),
          },
          {
            path: 'register',
            element: React.createElement(Register),
          },
          {
            path: 'forgot-password',
            element: React.createElement(ForgotPassword),
          }
        ]
      },
      {
        path: 'app',
        element: React.createElement(AppLayout),
        children: [
          {
            path: 'dashboard',
            element: React.createElement(Dashboard),
          },
          {
            path: 'profile',
            element: React.createElement(Profile),
          },
          {
            path: 'settings',
            element: React.createElement(Settings),
          }
        ]
      }
    ]
  }
];

/**
 * Check if a route is available on the current platform
 */
export function isRouteAvailable(path: string, platform: Platform): boolean {
  const routes = platformRoutes[platform];
  return routes.some(route => {
    if (route.endsWith('*')) {
      const prefix = route.slice(0, -1);
      return path.startsWith(prefix);
    }
    return route === path;
  });
}

/**
 * Get the base path for a platform
 */
export function getBasePath(platform: Platform): string {
  switch (platform) {
    case 'webapp':
      return '/';
    case 'webtool':
      return '/tools';
    case 'desktop':
      return '/desktop';
    case 'mobile':
      return '/mobile';
    default:
      return '/';
  }
}

/**
 * Generate a permalink for a route
 */
export function generatePermalink(path: string, platform: Platform = 'webapp'): string {
  const base = getBasePath(platform);
  return `${base}${path}`;
}
