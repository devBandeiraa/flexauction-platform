import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ChevronLeft, ChevronRight, Gavel, Play, Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuctionCard } from '@/components/auction/AuctionCard';
import { AuctionCardSkeleton } from '@/components/auction/AuctionCardSkeleton';
import { BidCard } from '@/components/auction/BidCard';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { WhyChoose } from '@/components/home/WhyChoose';
import { Newsletter } from '@/components/shared/Newsletter';
import { listAuctions } from '@/services/auctions.api';

const STEPS = [
  { icon: UserPlus, title: 'Cadastre-se', text: 'Crie sua conta gratuitamente em segundos.' },
  { icon: Search, title: 'Escolha um lote', text: 'Explore imóveis, veículos e outros bens.' },
  { icon: Gavel, title: 'Dê seu lance', text: 'Acompanhe em tempo real e arremate.' },
];

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
];

export function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['auctions', { status: 'LIVE', limit: 8 }],
    queryFn: () => listAuctions({ status: 'LIVE', limit: 8 }),
  });

  const featured = data?.items ?? [];
  const heroLot = featured[0];

  const [slide, setSlide] = useState(0);
  const move = (dir: number) =>
    setSlide((s) => (s + dir + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <>
      <section className="bg-bg">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <h1 className="text-balance font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight text-ink">
              Os melhores negócios você{' '}
              <span className="text-brand-pink">encontra aqui</span>
            </h1>
            <p className="mt-5 max-w-md text-pretty text-lg text-muted-foreground">
              Participe de leilões de imóveis, veículos e muito mais com segurança e transparência.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gradient" size="lg" className="gap-2">
                <Link to="/busca">
                  Ver leilões <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/como-funciona">
                  <Play className="size-4" /> Como funciona
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              {HERO_IMAGES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt="Imóvel em destaque no leilão"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
                    i === slide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}

              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Imagem anterior"
                className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-surface/80 text-ink shadow-card backdrop-blur transition hover:bg-surface"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Próxima imagem"
                className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-surface/80 text-ink shadow-card backdrop-blur transition hover:bg-surface"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {heroLot && (
              <BidCard
                auction={heroLot}
                className="absolute -bottom-6 -left-4 hidden sm:block"
              />
            )}
          </div>
        </div>
      </section>

      <CategoriesSection />

      <section className="mx-auto max-w-[1200px] px-6 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-ink">Leilões em destaque</h2>
          <Link
            to="/busca?status=LIVE"
            className="text-sm font-medium text-brand-pink transition-colors hover:text-brand-orange"
          >
            Ver todos
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <AuctionCardSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line py-12 text-center text-muted-foreground">
            Nenhum leilão ao vivo no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.slice(0, 4).map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>

      <WhyChoose />

      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <h2 className="mb-12 text-center text-2xl font-bold text-ink">Como funciona</h2>
          <div className="relative grid gap-10 sm:grid-cols-3">
            {/* Dashed connector behind the steps (desktop only). */}
            <div
              aria-hidden
              className="absolute inset-x-[16%] top-7 hidden border-t-2 border-dashed border-line sm:block"
            />
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                <span className="relative grid size-14 place-items-center rounded-full bg-brand-pink/10 text-brand-pink">
                  <step.icon className="size-6" />
                  <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-gradient-brand text-xs font-bold text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
                <h3 className="mt-4 font-display font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
