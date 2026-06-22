import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { searchAuctions } from '@/services/auctions.api';
import { formatCurrency, CATEGORY_LABELS } from '@/lib/format';

export function SearchBox() {
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounced = useDebounce(term.trim(), 300);

  const { data: results = [] } = useQuery({
    queryKey: ['search', debounced],
    queryFn: () => searchAuctions(debounced),
    enabled: debounced.length >= 2,
  });

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (term.trim()) {
      navigate(`/busca?q=${encodeURIComponent(term.trim())}`);
      setOpen(false);
    }
  }

  const showDropdown = open && debounced.length >= 2 && results.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={submit}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Buscar por lote ou cidade..."
            className="pl-9"
            aria-label="Busca global"
          />
        </div>
      </form>

      {showDropdown && (
        <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-card shadow-lg">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => {
                  navigate(`/lote/${r.id}`);
                  setOpen(false);
                  setTerm('');
                }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-secondary"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{r.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {CATEGORY_LABELS[r.category]} · {r.city}/{r.state}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-xs text-primary">
                  {formatCurrency(r.currentBid)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
