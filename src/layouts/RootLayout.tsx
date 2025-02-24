import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/components/AuthProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default RootLayout;
