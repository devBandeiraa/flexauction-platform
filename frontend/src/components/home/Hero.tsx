import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  CircleDollarSign,
  Gavel,
  Heart,
  MapPin,
  Package,
  Play,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuctionImage } from '@/components/auction/AuctionImage';
import { CountdownBoxes } from '@/components/auction/CountdownBoxes';
import { listAuctions } from '@/services/auctions.api';
import { formatCurrency } from '@/lib/format';
import { participantCount } from '@/lib/livePresence';
import { CATEGORY_OPTIONS, UFS } from '@/lib/constants';
import type { Auction } from '@/types';

const STATS = [
  { value: '+5.000', label: 'Usuários', icon: Users },
  { value: '+800', label: 'Lotes', icon: Package },
  { value: '+300', label: 'Leilões Ativos', icon: Gavel },
  { value: 'R$ 20 Milhões', label: 'Negociados', icon: CircleDollarSign },
  { value: '98%', label: 'Satisfação', icon: Heart },
];

const selectClass =
  'h-12 rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ring';

function byMostBids(a: Auction, b: Auction) {
  return (b._count?.bids ?? 0) - (a._count?.bids ?? 0);
}

export function Hero() {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState('');
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');

  // Reuses the same cached query as the Featured/Live sections.
  const { data } = useQuery({
    queryKey: ['auctions', { status: 'LIVE', limit: 8 }],
    queryFn: () => listAuctions({ status: 'LIVE', limit: 8 }),
  });
  // Prefer a property for the hero showcase (matches the premium look), else
  // fall back to the most-disputed lot of any kind.
  const sorted = [...(data?.items ?? [])].sort(byMostBids);
  const showcase = sorted.find((a) => a.category === 'IMOVEL') ?? sorted[0];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (categoria) params.set('categoria', categoria);
    if (uf) params.set('uf', uf);
    if (cidade.trim()) params.set('cidade', cidade.trim());
    navigate(`/leiloes${params.toString() ? `?${params}` : ''}`);
  }

  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="mx-auto max-w-[1200px] px-6 pb-28 pt-16 lg:pb-32 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* ---- Left: message, CTAs, stats ---- */}
          <div className="animate-fade-up text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              <ShieldCheck className="size-3.5 text-brand-pink" /> Ambiente 100% seguro e transparente
            </span>

            <h1 className="mt-5 text-balance font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-white">
              Arremate imóveis, veículos e oportunidades com até{' '}
              <span className="bg-gradient-brand bg-clip-text text-transparent">70% abaixo</span> do
              valor de mercado
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
                  <Play className="size-4" /> Como Funciona
                </Link>
              </Button>
            </div>

            <dl className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-4 lg:justify-start">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-brand-pink">
                    <stat.icon className="size-4" />
                  </span>
                  <div className="text-left">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-display text-lg font-bold leading-tight text-white">
                      {stat.value}
                    </dd>
                    <p className="text-xs text-white/60">{stat.label}</p>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* ---- Right: featured lot with floating glass card ---- */}
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
            </div>
          )}
        </div>
      </div>

      {/* ---- Floating advanced search, overlapping into the next section ---- */}
      <div className="relative mx-auto -mb-20 max-w-[1100px] px-6">
        <form
          onSubmit={submit}
          className="grid gap-3 rounded-2xl border border-line bg-surface p-4 shadow-float sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(2,1fr)_auto]"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Buscar imóvel, veículo ou lote"
              aria-label="Buscar"
              className="h-12 rounded-xl pl-9"
            />
          </div>

          <select
            className={selectClass}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            aria-label="Categoria"
          >
            <option value="">Categoria</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            aria-label="Estado"
          >
            <option value="">Estado</option>
            {UFS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <Button type="submit" variant="gradient" size="lg" className="h-12 gap-2">
            <Search className="size-4" /> Buscar
          </Button>
        </form>
      </div>
    </section>
  );
}

function ShowcaseCard({ auction }: { auction: Auction }) {
  const bids = auction._count?.bids ?? 0;
  const participants = participantCount(auction.id, bids);

  return (
    <div className="glass-panel absolute inset-x-3 bottom-3 rounded-2xl p-4 text-white sm:inset-x-auto sm:right-4 sm:top-4 sm:w-72 sm:bottom-auto">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-pink opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-pink" />
          </span>
          Encerrando em
        </span>
      </div>

      <div className="mt-2">
        <CountdownBoxes target={auction.endsAt} size="sm" variant="dark" />
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
