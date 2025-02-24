import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { RouteConfig } from './config';

interface RouteGuardProps {
  children: ReactNode;
  route: RouteConfig;
}

export const RouteGuard = ({ children, route }: RouteGuardProps) => {
  const { session, user } = useAuth();
  const location = useLocation();

  const checkPermission = () => {
    if (!route.permission || route.permission === 'public') {
      return true;
    }

    if (!session || !user) {
      return false;
    }

    if (route.permission === 'authenticated') {
      return true;
    }

    if (route.permission === 'premium' && user.subscription_tier === 'premium') {
      return true;
    }

    if (route.permission === 'admin' && user.role === 'admin') {
      return true;
    }

    return false;
  };

  const checkMeta = () => {
    if (!route.meta) {
      return true;
    }

    const { roles, features, platform, minVersion, betaAccess } = route.meta;

    if (roles && !roles.includes(user?.role || '')) {
      return false;
    }

    // Add additional meta checks here as needed
    // For example: feature flags, platform compatibility, version requirements

    return true;
  };

  if (!checkPermission()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!checkMeta()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
