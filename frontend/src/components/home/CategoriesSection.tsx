import { Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Building2, Car, Package, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/shared/Reveal';
import { listAuctions } from '@/services/auctions.api';
import type { Category } from '@/types';

const IMG = '?auto=format&fit=crop&w=900&q=80';

const CATEGORIES: { value: Category; label: string; icon: LucideIcon; image: string }[] = [
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
    value: 'OUTROS',
    label: 'Outros',
    icon: Package,
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661' + IMG,
  },
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
      <Reveal className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-ink">Categorias</h2>
        <Link
          to="/leiloes"
          className="text-sm font-medium text-brand-pink transition-colors hover:text-brand-orange"
        >
          Ver todos
        </Link>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <Link
            key={c.value}
            to={`/leiloes?categoria=${c.value}`}
            className="group relative block aspect-[16/10] overflow-hidden rounded-3xl shadow-card transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
          >
            <img
              src={c.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-deep/90 via-ink-deep/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
              <div>
                <span className="grid size-11 place-items-center rounded-full bg-white/15 backdrop-blur-sm">
                  <c.icon className="size-5" />
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{c.label}</h3>
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                {counts[i].data?.total ?? 0} lotes
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
