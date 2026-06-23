import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status, isAuthenticated } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-24 text-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Send to the login page, remembering where the user was headed.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
