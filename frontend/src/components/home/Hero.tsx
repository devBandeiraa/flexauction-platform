import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CircleDollarSign, Gavel, Heart, MapPin, Package, Play, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuctionImage } from '@/components/auction/AuctionImage';
import { CountdownBoxes } from '@/components/auction/CountdownBoxes';
import { listAuctions } from '@/services/auctions.api';
import { formatCurrency } from '@/lib/format';
import { participantCount } from '@/lib/livePresence';
import type { Auction } from '@/types';

const STATS = [
  { value: '+5.000', label: 'Usuários', icon: Users },
  { value: '+800', label: 'Lotes', icon: Package },
  { value: '+300', label: 'Leilões Ativos', icon: Gavel },
  { value: 'R$ 20 milhões', label: 'Negociados', icon: CircleDollarSign },
  { value: '98%', label: 'Satisfação', icon: Heart },
];

function byMostBids(a: Auction, b: Auction) {
  return (b._count?.bids ?? 0) - (a._count?.bids ?? 0);
}

export function Hero() {
  // Reuses the same cached query as the Featured/Live sections.
  const { data } = useQuery({
    queryKey: ['auctions', { status: 'LIVE', limit: 12 }],
    queryFn: () => listAuctions({ status: 'LIVE', limit: 12 }),
  });
  // Prefer a property for the hero showcase (matches the premium look), else
  // fall back to the most-disputed lot of any kind.
  const sorted = [...(data?.items ?? [])].sort(byMostBids);
  const showcase = sorted.find((a) => a.category === 'IMOVEL') ?? sorted[0];

  return (
    <section data-hero className="relative -mt-16 overflow-hidden bg-hero pt-16">
      <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-14 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* ---- Left: message, CTAs, stats ---- */}
          <div className="animate-fade-up text-center lg:text-left">
            <h1 className="text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              Arremate imóveis, veículos e oportunidades com até{' '}
              <span className="bg-gradient-brand bg-clip-text text-transparent">70% abaixo</span> do
              valor de mercado.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-white/70 lg:mx-0">
              Participe de leilões seguros, transparentes e acompanhe seus lances em tempo real.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button asChild variant="gradient" size="lg" className="gap-2">
                <Link to="/leiloes">
                  Ver Leilões <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="gap-2 border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/como-funciona">
                  <Play className="size-4" /> Como funciona
                </Link>
              </Button>
            </div>

            <dl className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-4 lg:flex-nowrap lg:justify-start">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-brand-pink">
                    <stat.icon className="size-4" />
                  </span>
                  <div className="text-left">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-display text-sm font-bold leading-tight text-white">
                      {stat.value}
                    </dd>
                    <p className="text-[0.7rem] leading-tight text-white/60">{stat.label}</p>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* ---- Right: featured lot with floating countdown card ---- */}
          {showcase && (
            <div className="relative animate-fade-up">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-float">
                <AuctionImage
                  images={showcase.images}
                  alt={showcase.title}
                  category={showcase.category}
                  className="size-full"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-deep/60 to-transparent" />
              </div>

              <ShowcaseCard auction={showcase} />

              {/* Carousel pagination dots (decorative) */}
              <div className="mt-5 flex justify-center gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={
                      i === 0
                        ? 'h-2 w-6 rounded-full bg-brand-pink'
                        : 'size-2 rounded-full bg-white/25'
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({ auction }: { auction: Auction }) {
  const bids = auction._count?.bids ?? 0;
  const participants = participantCount(auction.id, bids);

  return (
    <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/10 bg-ink-deep/85 p-4 text-white shadow-float backdrop-blur-md sm:inset-x-auto sm:right-4 sm:top-4 sm:w-72 sm:bottom-auto">
      <div className="flex items-center gap-1.5 text-xs text-white/70">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-pink opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-brand-pink" />
        </span>
        Encerrando em:
      </div>

      <div className="mt-2">
        <CountdownBoxes target={auction.endsAt} size="sm" variant="dark" calm />
      </div>

      <h3 className="mt-3 line-clamp-1 font-display text-sm font-semibold text-white">
        {auction.title}
      </h3>
      <p className="flex items-center gap-1 text-xs text-white/60">
        <MapPin className="size-3" /> {auction.city}/{auction.state}
      </p>

      <p className="mt-2 text-xs text-white/60">Lance atual</p>
      <p className="font-display text-xl font-bold tabular-nums text-white">
        {formatCurrency(auction.currentBid)}
      </p>

      <div className="mt-1 flex items-center gap-3 text-xs text-white/60">
        <span className="inline-flex items-center gap-1">
          <Gavel className="size-3" /> {bids} lances
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="size-3" /> {participants} participantes
        </span>
      </div>

      <Button asChild variant="gradient" size="sm" className="mt-3 w-full">
        <Link to={`/leilao/${auction.id}`}>Dar Lance</Link>
      </Button>
    </div>
  );
}
