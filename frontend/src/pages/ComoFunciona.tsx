import { Link } from 'react-router-dom';
import { Gavel, Search, ShieldCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    icon: UserPlus,
    title: '1. Cadastre-se',
    text: 'Crie sua conta gratuitamente informando nome, CPF e e-mail. Leva menos de um minuto.',
  },
  {
    icon: Search,
    title: '2. Escolha um lote',
    text: 'Navegue por imóveis, veículos e outros bens. Use os filtros para encontrar o que procura.',
  },
  {
    icon: Gavel,
    title: '3. Dê seu lance',
    text: 'Acompanhe o leilão em tempo real e dê lances. Você é avisado se for superado.',
  },
];

export function ComoFunciona() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">Como funciona</h1>
        <p className="mt-2 text-muted-foreground">
          Participar dos leilões da FlexAuction é simples, rápido e seguro.
        </p>
      </header>

      <ol className="mt-10 space-y-6">
        {STEPS.map((step) => (
          <li key={step.title} className="flex gap-4 rounded-lg border border-border bg-card p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
              <step.icon className="size-6" />
            </span>
            <div>
              <h2 className="font-semibold text-text-primary">{step.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex items-center gap-3 rounded-lg bg-secondary p-5">
        <ShieldCheck className="size-6 shrink-0 text-success" />
        <p className="text-sm text-text-primary/80">
          Todas as transações são protegidas e os lances atualizados em tempo real, garantindo
          transparência total durante o leilão.
        </p>
      </div>

      <div className="mt-8 text-center">
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
          <Link to="/busca">Ver leilões disponíveis</Link>
        </Button>
      </div>
    </div>
  );
}
