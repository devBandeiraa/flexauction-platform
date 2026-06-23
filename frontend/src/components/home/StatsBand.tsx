import { CircleDollarSign, Gavel, Heart, Package, Users, type LucideIcon } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

const STATS = [
  { end: 5000, prefix: '+', suffix: '', label: 'Usuários', icon: Users },
  { end: 800, prefix: '+', suffix: '', label: 'Lotes disponíveis', icon: Package },
  { end: 300, prefix: '+', suffix: '', label: 'Leilões ativos', icon: Gavel },
  { end: 20, prefix: 'R$ ', suffix: 'M', label: 'Negociados', icon: CircleDollarSign },
  { end: 98, prefix: '', suffix: '%', label: 'Satisfação', icon: Heart },
] as const;

function StatItem({ stat }: { stat: { end: number; prefix: string; suffix: string; label: string; icon: LucideIcon } }) {
  const { ref, value } = useCountUp<HTMLParagraphElement>(stat.end);
  const Icon = stat.icon;
  return (
    <div className="flex flex-col items-center text-center text-white">
      <div className="flex items-center gap-2">
        <Icon className="size-6 text-white/80" />
        <p ref={ref} className="font-display text-3xl font-bold tabular-nums sm:text-4xl">
          {stat.prefix}
          {value.toLocaleString('pt-BR')}
          {stat.suffix}
        </p>
      </div>
      <p className="mt-2 text-sm text-white/85">{stat.label}</p>
    </div>
  );
}

export function StatsBand() {
  return (
    <section className="bg-gradient-stats">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
