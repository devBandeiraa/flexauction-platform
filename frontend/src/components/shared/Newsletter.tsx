import { useState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
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
    <section className="bg-gradient-brand text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex max-w-md items-start gap-4">
          <span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-white/15 sm:grid">
            <Mail className="size-6" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Receba oportunidades exclusivas antes de todos
            </h2>
            <p className="mt-1 text-white/80">
              Cadastre-se e receba novos leilões em primeira mão.
            </p>
          </div>
        </div>

        {done ? (
          <p className="flex items-center gap-2 font-medium text-white">
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
                placeholder="Digite seu melhor e-mail"
                aria-label="E-mail para newsletter"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'newsletter-error' : undefined}
                className={cn(
                  'h-11 rounded-xl border-transparent bg-white text-ink focus-visible:ring-white',
                  error && 'ring-2 ring-destructive',
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="shrink-0 bg-white text-brand-pink hover:bg-white/90"
              >
                Receber Oportunidades
              </Button>
            </div>
            {error && (
              <p id="newsletter-error" role="alert" className="mt-2 text-sm text-white">
                {error}
              </p>
            )}
            <p className="mt-2 text-xs text-white/70">
              Não enviamos spam. Cancelar inscrição a qualquer momento.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
