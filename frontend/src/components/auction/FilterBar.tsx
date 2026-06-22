import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CATEGORY_OPTIONS, STATUS_OPTIONS, UFS } from '@/lib/constants';
import { CATEGORY_LABELS, STATUS_LABELS, formatCurrency } from '@/lib/format';

const FILTER_KEYS = ['categoria', 'uf', 'status', 'min', 'max', 'q'] as const;

const selectClass =
  'h-10 rounded-md border border-border bg-card px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring';

export function FilterBar() {
  const [params, setParams] = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next, { replace: true });
  }

  function clearAll() {
    setParams(new URLSearchParams(), { replace: true });
  }

  const activeChips = FILTER_KEYS.filter((k) => params.get(k)).map((key) => {
    const value = params.get(key)!;
    return { key, label: chipLabel(key, value) };
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <select
          className={selectClass}
          value={params.get('categoria') ?? ''}
          onChange={(e) => update('categoria', e.target.value)}
          aria-label="Categoria"
        >
          <option value="">Todas categorias</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={params.get('uf') ?? ''}
          onChange={(e) => update('uf', e.target.value)}
          aria-label="Estado"
        >
          <option value="">Todos estados</option>
          {UFS.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={params.get('status') ?? ''}
          onChange={(e) => update('status', e.target.value)}
          aria-label="Situação"
        >
          <option value="">Qualquer situação</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <Input
          type="number"
          inputMode="numeric"
          placeholder="Preço mín."
          className="w-32"
          defaultValue={params.get('min') ?? ''}
          onBlur={(e) => update('min', e.target.value)}
          aria-label="Preço mínimo"
        />
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Preço máx."
          className="w-32"
          defaultValue={params.get('max') ?? ''}
          onBlur={(e) => update('max', e.target.value)}
          aria-label="Preço máximo"
        />
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => update(chip.key, '')}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-text-primary hover:bg-border"
            >
              {chip.label}
              <X className="size-3" />
            </button>
          ))}
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAll}>
            Limpar tudo
          </Button>
        </div>
      )}
    </div>
  );
}

function chipLabel(key: string, value: string): string {
  switch (key) {
    case 'categoria':
      return CATEGORY_LABELS[value] ?? value;
    case 'status':
      return STATUS_LABELS[value] ?? value;
    case 'uf':
      return value;
    case 'min':
      return `≥ ${formatCurrency(value)}`;
    case 'max':
      return `≤ ${formatCurrency(value)}`;
    case 'q':
      return `"${value}"`;
    default:
      return value;
  }
}
