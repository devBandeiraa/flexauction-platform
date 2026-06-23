import { useCountUp } from '@/hooks/useCountUp';

const STATS = [
  { end: 5000, prefix: '+', suffix: '', label: 'Usuários' },
  { end: 800, prefix: '+', suffix: '', label: 'Lotes' },
  { end: 300, prefix: '+', suffix: '', label: 'Leilões Ativos' },
  { end: 20, prefix: 'R$ ', suffix: ' Milhões', label: 'Negociados' },
] as const;

function StatItem({ stat }: { stat: (typeof STATS)[number] }) {
  const { ref, value } = useCountUp<HTMLParagraphElement>(stat.end);
  return (
    <div className="text-center text-white">
      <p ref={ref} className="font-display text-4xl font-bold tabular-nums sm:text-5xl">
        {stat.prefix}
        {value.toLocaleString('pt-BR')}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm text-white/85">{stat.label}</p>
    </div>
  );
}

export function StatsBand() {
  return (
    <section className="bg-gradient-brand">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-8 px-6 py-16 sm:grid-cols-4">
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
