import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PlatformRoute } from '@/components/PlatformRoute';

type Platform = 'webapp' | 'webtool' | 'desktop' | 'mobile' | 'extension';

export function createProtectedRoute(route: RouteObject): RouteObject {
  const { element, ...rest } = route;
  return {
    ...rest,
    element: <ProtectedRoute>{element}</ProtectedRoute>,
  };
}

export function createPlatformRoute(route: RouteObject, platform: Platform): RouteObject {
  const { element, ...rest } = route;
  return {
    ...rest,
    element: <PlatformRoute platform={platform}>{element}</PlatformRoute>,
  };
}

export function validateRouteConfig(routes: RouteObject[]): boolean {
  const validateRoute = (route: RouteObject): boolean => {
    // Check required properties
    if (!route.path && !route.index) {
      console.error('Route must have either path or index property');
      return false;
    }

    if (route.element === undefined) {
      console.error(`Route ${route.path || 'index'} must have an element`);
      return false;
    }

    // Validate children recursively
    if (route.children) {
      return route.children.every(validateRoute);
    }

    return true;
  };

  return routes.every(validateRoute);
}

export const platformPaths = {
  webapp: '/',
  webtool: '/tool',
  desktop: '/desktop',
  mobile: '/mobile',
  extension: '/ext',
} as const;

export function getPlatformFromPath(path: string): Platform | null {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const platform = Object.entries(platformPaths).find(([_, basePath]) =>
    normalizedPath.startsWith(basePath)
  );
  return platform ? (platform[0] as Platform) : null;
}

export function stripPlatformPath(path: string): string {
  const platform = getPlatformFromPath(path);
  if (!platform) return path;
  
  const basePath = platformPaths[platform];
  return path.replace(new RegExp(`^${basePath}`), '') || '/';
}
