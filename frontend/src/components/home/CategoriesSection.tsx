import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Anchor, Building2, Car, Package, Tractor, Warehouse, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/shared/Reveal';
import { listAuctions } from '@/services/auctions.api';
import type { Category } from '@/types';

const IMG = '?auto=format&fit=crop&w=600&q=80';

interface CategoryTile {
  value: Category;
  label: string;
  icon: LucideIcon;
  image: string;
}

const CATEGORIES: CategoryTile[] = [
  {
    value: 'IMOVEL',
    label: 'Imóveis',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994' + IMG,
  },
  {
    value: 'VEICULO',
    label: 'Veículos',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70' + IMG,
  },
  {
    value: 'GALPAO',
    label: 'Galpões',
    icon: Warehouse,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d' + IMG,
  },
  {
    value: 'MAQUINA',
    label: 'Máquinas',
    icon: Tractor,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd' + IMG,
  },
  {
    value: 'EMBARCACAO',
    label: 'Embarcações',
    icon: Anchor,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5' + IMG,
  },
  {
    value: 'OUTROS',
    label: 'Outros',
    icon: Package,
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661' + IMG,
  },
];

function CategoryTileCard({ tile, count }: { tile: CategoryTile; count?: number }) {
  const [broken, setBroken] = useState(false);
  return (
    <Link
      to={`/leiloes?categoria=${tile.value}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-deep">
        {!broken && (
          <img
            src={tile.image}
            alt=""
            loading="lazy"
            onError={() => setBroken(true)}
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        )}
      </div>
      <div className="flex items-center gap-2.5 p-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-pink/10 text-brand-pink">
          <tile.icon className="size-4" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-sm font-semibold text-ink">{tile.label}</h3>
          {count !== undefined && (
            <p className="text-xs text-muted-foreground">
              {count} {count === 1 ? 'lote' : 'lotes'}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function CategoriesSection() {
  // One lightweight query per category just to read the real `total`.
  const counts = useQueries({
    queries: CATEGORIES.map((c) => ({
      queryKey: ['category-count', c.value],
      queryFn: () => listAuctions({ category: c.value, limit: 1 }),
      staleTime: 60_000,
    })),
  });

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <Reveal className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-ink">Categorias</h2>
        <Link
          to="/leiloes"
          className="text-sm font-medium text-brand-pink transition-colors hover:text-brand-orange"
        >
          Ver todas
        </Link>
      </Reveal>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((tile, i) => (
          <CategoryTileCard key={tile.value} tile={tile} count={counts[i].data?.total} />
        ))}
      </div>
    </section>
  );
}
