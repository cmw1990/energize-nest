import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const DiagramPage = lazy(() => import('@/pages/dev/studio/DiagramPage'));

export const devRoutes: RouteObject[] = [
  {
    path: '/dev',
    children: [
      {
        path: 'studio',
        element: <DiagramPage />,
      }
    ]
  }
];
