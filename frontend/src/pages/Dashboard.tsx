import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Gavel, User as UserIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AuctionCard } from '@/components/auction/AuctionCard';
import { AuctionImage } from '@/components/auction/AuctionImage';
import { getMyBids } from '@/services/me.api';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { UserBid } from '@/types';

type Tab = 'bids' | 'favorites' | 'profile';

const TABS: { id: Tab; label: string; icon: typeof Gavel }[] = [
  { id: 'bids', label: 'Meus lances', icon: Gavel },
  { id: 'favorites', label: 'Favoritos', icon: Heart },
  { id: 'profile', label: 'Meus dados', icon: UserIcon },
];

function bidStatus(bid: UserBid): { label: string; className: string } {
  const leading = Number(bid.auction.currentBid) === Number(bid.value);
  if (bid.auction.status === 'LIVE') {
    return leading
      ? { label: 'Ganhando', className: 'bg-success/15 text-success' }
      : { label: 'Superado', className: 'bg-accent/15 text-accent' };
  }
  if (bid.auction.status === 'CLOSED') {
    return leading
      ? { label: 'Arrematado', className: 'bg-success/15 text-success' }
      : { label: 'Não arrematado', className: 'bg-secondary text-muted-foreground' };
  }
  return { label: 'Em breve', className: 'bg-secondary text-muted-foreground' };
}

export function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('bids');

  // Deduped by react-query (same keys the tabs use) — just for the summary stats.
  const { data: bids } = useQuery({ queryKey: ['me', 'bids'], queryFn: getMyBids });
  const { data: favorites } = useFavorites();

  const activeBids =
    bids?.filter((b) => b.auction.status === 'LIVE').length ?? 0;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-ink">Meu painel</h1>
      <p className="mt-1 text-muted-foreground">
        Olá, {user?.name?.split(' ')[0] ?? 'visitante'} 👋 Acompanhe seus leilões.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Lances dados" value={bids?.length ?? 0} icon={Gavel} />
        <StatCard label="Lances ativos" value={activeBids} icon={Gavel} />
        <StatCard label="Favoritos" value={favorites?.length ?? 0} icon={Heart} />
      </div>

      <div className="mb-6 mt-8 flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              tab === t.id
                ? 'border-brand-pink text-brand-pink'
                : 'border-transparent text-muted-foreground hover:text-ink',
            )}
          >
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'bids' && <BidsTab />}
      {tab === 'favorites' && <FavoritesTab />}
      {tab === 'profile' && user && (
        <ProfileTab name={user.name} email={user.email} role={user.role} />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Gavel;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
      <span className="grid size-10 place-items-center rounded-full bg-brand-pink/10 text-brand-pink">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-display text-2xl font-bold tabular-nums text-ink">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function BidsTab() {
  const { data: bids, isLoading } = useQuery({ queryKey: ['me', 'bids'], queryFn: getMyBids });

  if (isLoading) return <ListSkeleton />;
  if (!bids || bids.length === 0) return <Empty message="Você ainda não deu lances." />;

  return (
    <ul className="space-y-3">
      {bids.map((bid) => {
        const status = bidStatus(bid);
        return (
          <li key={bid.id}>
            <Link
              to={`/leilao/${bid.auction.id}`}
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="size-16 shrink-0 overflow-hidden rounded-xl">
                <AuctionImage
                  images={bid.auction.images}
                  alt={bid.auction.title}
                  category="OUTROS"
                  className="size-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block truncate font-medium text-ink">
                  {bid.auction.title}
                </span>
                <span className="text-sm text-muted-foreground">
                  Seu lance:{' '}
                  <span className="font-semibold tabular-nums text-ink">
                    {formatCurrency(bid.value)}
                  </span>
                </span>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                  status.className,
                )}
              >
                {status.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function FavoritesTab() {
  const { data: favorites, isLoading } = useFavorites();

  if (isLoading) return <ListSkeleton />;
  if (!favorites || favorites.length === 0)
    return <Empty message="Você ainda não favoritou nenhum lote." />;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {favorites.map((fav) => (
        <AuctionCard key={fav.id} auction={fav.auction} />
      ))}
    </div>
  );
}

function ProfileTab({ name, email, role }: { name: string; email: string; role: string }) {
  return (
    <dl className="max-w-md space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-card">
      <Field label="Nome" value={name} />
      <Field label="E-mail" value={email} />
      <Field label="Perfil" value={role === 'AUCTIONEER' ? 'Leiloeiro' : 'Participante'} />
    </dl>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-text-primary">{value}</dd>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Link to="/leiloes" className="text-sm font-medium text-brand-pink hover:underline">
        Explorar leilões
      </Link>
    </div>
  );
}
