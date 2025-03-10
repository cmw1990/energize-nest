import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { routes, RouteConfig } from './config';
import RouteGuard from './RouteGuard';

// Layouts
const AppLayout = lazy(() => import('@/components/layout/AppLayout'));
const PublicLayout = lazy(() => import('@/components/layout/PublicLayout'));

// Pages
const Landing = lazy(() => import('@/pages/Landing'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Health = lazy(() => import('@/pages/Health'));
const QuitPlan = lazy(() => import('@/pages/QuitPlan'));
const Support = lazy(() => import('@/pages/Support'));
const Professional = lazy(() => import('@/pages/Professional'));
const Admin = lazy(() => import('@/pages/Admin'));

// Development Pages
const RouteDiagram = lazy(() => import('@/pages/dev/RouteDiagram'));

const componentRegistry: Record<string, React.ComponentType> = {
  Landing,
  Dashboard,
  Health,
  QuitPlan,
  Support,
  Professional,
  Admin,
  RouteDiagram
};

const layoutRegistry: Record<string, React.ComponentType> = {
  AppLayout,
  PublicLayout
};

const processRoute = (route: RouteConfig): RouteObject => {
  const Component = componentRegistry[route.component];
  const Layout = route.layout ? layoutRegistry[route.layout] : undefined;

  const element = (
    <RouteGuard route={route}>
      {Layout ? (
        <Layout>
          <Component />
        </Layout>
      ) : (
        <Component />
      )}
    </RouteGuard>
  );

  return {
    path: route.path,
    element,
    children: route.children?.map(processRoute)
  };
};

export const routeRegistry = routes.map(processRoute);

// Add development routes
if (process.env.NODE_ENV === 'development') {
  routeRegistry.push({
    path: '/_dev',
    children: [
      {
        path: 'routes',
        element: <RouteDiagram />
      }
    ]
  });
}
