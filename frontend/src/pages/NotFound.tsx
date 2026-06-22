import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="font-mono text-5xl font-extrabold text-primary">404</span>
      <h1 className="mt-4 text-xl font-semibold text-text-primary">Página não encontrada</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        O conteúdo que você procura não existe ou foi removido.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}
