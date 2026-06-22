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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Meu painel</h1>

      <div className="mb-6 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              tab === t.id
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-text-primary',
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
              to={`/lote/${bid.auction.id}`}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-md"
            >
              <div className="size-16 shrink-0 overflow-hidden rounded-md">
                <AuctionImage
                  images={bid.auction.images}
                  alt={bid.auction.title}
                  category="OUTROS"
                  className="size-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block truncate font-medium text-text-primary">
                  {bid.auction.title}
                </span>
                <span className="text-sm text-muted-foreground">
                  Seu lance: <span className="font-mono">{formatCurrency(bid.value)}</span>
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
    <dl className="max-w-md space-y-4 rounded-lg border border-border bg-card p-5">
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
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Link to="/busca" className="text-sm font-medium text-accent hover:underline">
        Explorar leilões
      </Link>
    </div>
  );
}
