import { Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Building2, Car, Package } from 'lucide-react';
import { CategoryCard } from '@/components/auction/CategoryCard';
import { listAuctions } from '@/services/auctions.api';
import type { Category } from '@/types';

const CATEGORIES: { value: Category; label: string; icon: typeof Building2 }[] = [
  { value: 'IMOVEL', label: 'Imóveis', icon: Building2 },
  { value: 'VEICULO', label: 'Veículos', icon: Car },
  { value: 'OUTROS', label: 'Outros', icon: Package },
];

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
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-ink">Categorias</h2>
        <Link
          to="/leiloes"
          className="text-sm font-medium text-brand-pink transition-colors hover:text-brand-orange"
        >
          Ver todos
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <CategoryCard
            key={c.value}
            to={`/leiloes?categoria=${c.value}`}
            label={c.label}
            icon={c.icon}
            count={counts[i].data?.total}
          />
        ))}
      </div>
    </section>
  );
}
