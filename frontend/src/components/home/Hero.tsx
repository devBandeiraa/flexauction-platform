import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORY_OPTIONS, UFS } from '@/lib/constants';

const STATS = [
  { value: '+5.000', label: 'Usuários' },
  { value: '+800', label: 'Lotes' },
  { value: '+300', label: 'Leilões Ativos' },
  { value: 'R$ 20 Milhões', label: 'Negociados' },
];

const selectClass =
  'h-11 rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ring';

export function Hero() {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState('');
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (categoria) params.set('categoria', categoria);
    if (uf) params.set('uf', uf);
    if (cidade.trim()) params.set('cidade', cidade.trim());
    navigate(`/leiloes${params.toString() ? `?${params}` : ''}`);
  }

  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <h1 className="text-balance font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-ink">
            Arremate imóveis, veículos e oportunidades com até{' '}
            <span className="text-brand-pink">70% abaixo</span> do valor de mercado
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
            Participe de leilões com lances em tempo real, segurança e transparência do início ao
            arremate.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="gradient" size="lg" className="gap-2">
              <Link to="/leiloes">
                Ver Leilões <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/como-funciona">
                <Play className="size-4" /> Como Funciona
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-xl font-bold text-ink">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card sm:flex-row sm:items-center"
        >
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

          <Input
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
            aria-label="Cidade"
            className="h-11 flex-1 rounded-xl"
          />

          <Button type="submit" variant="gradient" size="lg" className="gap-2">
            <Search className="size-4" /> Buscar
          </Button>
        </form>
      </div>
    </section>
  );
}
