import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <span className="bg-gradient-brand bg-clip-text font-display text-7xl font-bold tabular-nums text-transparent">
        404
      </span>
      <h1 className="mt-4 font-display text-xl font-semibold text-ink">Página não encontrada</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        O conteúdo que você procura não existe ou foi movido. Vamos te levar de volta.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild variant="gradient">
          <Link to="/">Voltar ao início</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/leiloes">Ver leilões</Link>
        </Button>
      </div>
    </div>
  );
}
