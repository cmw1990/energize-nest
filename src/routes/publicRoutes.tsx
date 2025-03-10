import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { RootLayout } from '@/components/layouts/RootLayout';

const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));

export const publicRoutes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
          },
          {
            path: 'reset-password',
            element: <ResetPassword />,
          },
        ],
      },
    ],
  },
];
