import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORY_OPTIONS, UFS } from '@/lib/constants';

const selectClass =
  'h-12 rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ring';

/**
 * Floating advanced-search card that straddles the hero → body transition.
 * Submits to the listing page, mapping the inputs to URL query params.
 */
export function SearchBar() {
  const navigate = useNavigate();
  const [termo, setTermo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (termo.trim()) params.set('q', termo.trim());
    if (categoria) params.set('categoria', categoria);
    if (uf) params.set('uf', uf);
    if (cidade.trim()) params.set('cidade', cidade.trim());
    navigate(`/leiloes${params.toString() ? `?${params}` : ''}`);
  }

  return (
    <section className="relative z-10 -mt-10">
      <div className="mx-auto max-w-[1100px] px-6">
        <form
          onSubmit={submit}
          className="grid gap-3 rounded-2xl border border-line bg-surface p-4 shadow-float sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)_auto]"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
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

          <Input
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
            aria-label="Cidade"
            className="h-12 rounded-xl"
          />

          <Button type="submit" variant="gradient" size="lg" className="h-12 gap-2">
            <Search className="size-4" /> Buscar
          </Button>
        </form>
      </div>
    </section>
  );
}
