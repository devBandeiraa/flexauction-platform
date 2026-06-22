import { useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/store/ui.store';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status, isAuthenticated } = useAuth();
  const openAuth = useUiStore((s) => s.openAuth);

  useEffect(() => {
    if (status === 'unauthenticated') openAuth('login');
  }, [status, openAuth]);

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-text-primary">Acesso restrito</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Entre na sua conta para acessar o painel.
        </p>
        <Button className="mt-4" onClick={() => openAuth('login')}>
          Entrar
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
