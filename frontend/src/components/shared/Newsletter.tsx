import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setError('Informe seu e-mail para receber as oportunidades.');
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setError('Digite um e-mail válido, como nome@exemplo.com.');
      return;
    }
    setError(null);
    setDone(true);
  }

  return (
    <section className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-ink">Receba oportunidades exclusivas</h2>
          <p className="mt-1 text-muted-foreground">
            Cadastre-se e receba em primeira mão os melhores leilões.
          </p>
        </div>

        {done ? (
          <p className="flex items-center gap-2 font-medium text-success">
            <CheckCircle2 className="size-5" /> Pronto! Você está na lista.
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="w-full max-w-md">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Seu melhor e-mail"
                aria-label="E-mail para newsletter"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'newsletter-error' : undefined}
                className={cn(
                  'h-11 rounded-xl focus-visible:ring-brand-pink',
                  error && 'border-destructive focus-visible:ring-destructive',
                )}
              />
              <Button type="submit" variant="gradient" size="lg" className="shrink-0">
                Cadastrar
              </Button>
            </div>
            {error && (
              <p id="newsletter-error" role="alert" className="mt-2 text-sm text-destructive">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
