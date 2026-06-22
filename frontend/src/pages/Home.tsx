import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Gavel, Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuctionCard } from '@/components/auction/AuctionCard';
import { AuctionCardSkeleton } from '@/components/auction/AuctionCardSkeleton';
import { listAuctions } from '@/services/auctions.api';

const STEPS = [
  { icon: UserPlus, title: 'Cadastre-se', text: 'Crie sua conta gratuitamente em segundos.' },
  { icon: Search, title: 'Escolha um lote', text: 'Explore imóveis, veículos e outros bens.' },
  { icon: Gavel, title: 'Dê seu lance', text: 'Acompanhe em tempo real e arremate.' },
];

export function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['auctions', { status: 'LIVE', limit: 8 }],
    queryFn: () => listAuctions({ status: 'LIVE', limit: 8 }),
  });

  const featured = data?.items ?? [];

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:py-28">
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
            Arremate o que importa.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-primary-foreground/70 sm:text-lg">
            Leilões de imóveis, veículos e muito mais com segurança e transparência.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="gap-2 bg-accent hover:bg-accent/90">
              <Link to="/busca">
                Explorar leilões <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-text-primary">Destaques do momento</h2>
          <Link to="/busca?status=LIVE" className="text-sm font-medium text-accent hover:underline">
            Ver todos
          </Link>
        </div>

        {isLoading ? (
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-72 shrink-0">
                <AuctionCardSkeleton />
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
            Nenhum leilão ao vivo no momento.
          </p>
        ) : (
          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:thin]">
            {featured.map((auction) => (
              <div key={auction.id} className="w-72 shrink-0 snap-start">
                <AuctionCard auction={auction} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="mb-10 text-center text-2xl font-bold text-text-primary">Como funciona</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <span className="grid size-14 place-items-center rounded-full bg-accent/10 text-accent">
                  <step.icon className="size-6" />
                </span>
                <h3 className="mt-4 font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
