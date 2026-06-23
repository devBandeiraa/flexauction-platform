import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Search as SearchIcon,
  User as UserIcon,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/shared/Logo';
import { SearchBox } from './SearchBox';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const LEILOES = [
  { to: '/leiloes', label: 'Todos os leilões' },
  { to: '/leiloes?status=LIVE', label: 'Ao vivo' },
  { to: '/leiloes?status=UPCOMING', label: 'Em breve' },
  { to: '/leiloes?status=CLOSED', label: 'Encerrados' },
];

const CATEGORIAS = [
  { to: '/leiloes?categoria=IMOVEL', label: 'Imóveis' },
  { to: '/leiloes?categoria=VEICULO', label: 'Veículos' },
  { to: '/leiloes?categoria=GALPAO', label: 'Galpões' },
  { to: '/leiloes?categoria=MAQUINA', label: 'Máquinas' },
  { to: '/leiloes?categoria=EMBARCACAO', label: 'Embarcações' },
  { to: '/leiloes?categoria=OUTROS', label: 'Outros' },
];

const SIMPLE_LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/como-funciona', label: 'Como funciona' },
  { to: '/sobre', label: 'Sobre nós' },
  { to: '/contato', label: 'Contato' },
];

const HEADER_HEIGHT = 64; // h-16

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [scrolled, setScrolled] = useState(false);
  // True while the bar overlaps a dark hero section: render it transparent with
  // light text so it blends into the background.
  const [overHero, setOverHero] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Re-measure on navigation, scroll and resize. Robust to any hero height and
  // self-corrects once a lazy-loaded page mounts its hero.
  useEffect(() => {
    const update = () => {
      const hero = document.querySelector<HTMLElement>('[data-hero]');
      setOverHero(!!hero && hero.getBoundingClientRect().bottom > HEADER_HEIGHT);
      setScrolled(window.scrollY > 8);
    };
    update();
    const raf = requestAnimationFrame(update);
    const timer = setTimeout(update, 200);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'nav-underline px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'text-brand-pink'
        : overHero
          ? 'text-white/85 hover:text-white'
          : 'text-ink-soft hover:text-brand-pink',
    );

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors',
        overHero
          ? 'bg-transparent'
          : cn(
              'border-b bg-surface/80 backdrop-blur-md',
              scrolled ? 'border-line shadow-card' : 'border-transparent',
            ),
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-6">
        <Link
          to="/"
          aria-label="FlexAuction — início"
          className="shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Logo onDark={overHero} />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            Início
          </NavLink>
          <NavDropdown label="Leilões" items={LEILOES} onDark={overHero} />
          <NavDropdown label="Categorias" items={CATEGORIAS} onDark={overHero} />
          <NavLink to="/como-funciona" className={navLinkClass}>
            Como funciona
          </NavLink>
          <NavLink to="/sobre" className={navLinkClass}>
            Sobre nós
          </NavLink>
          <NavLink to="/contato" className={navLinkClass}>
            Contato
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={searchOpen ? 'Fechar busca' : 'Abrir busca'}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className={cn(
              overHero ? 'text-white/85 hover:bg-white/10 hover:text-white' : 'text-ink-soft hover:text-brand-pink',
            )}
          >
            {searchOpen ? <X /> : <SearchIcon />}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn('gap-2', overHero && 'text-white hover:bg-white/10 hover:text-white')}
                >
                  <span
                    className={cn(
                      'grid size-7 place-items-center rounded-full',
                      overHero ? 'bg-white/15' : 'bg-secondary',
                    )}
                  >
                    <UserIcon className="size-4" />
                  </span>
                  <span className="hidden max-w-24 truncate sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/painel')}>
                  <LayoutDashboard className="mr-2 size-4" /> Meu painel
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 size-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                asChild
                variant="outline"
                size="sm"
                className={cn(
                  overHero &&
                    'border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10 hover:text-white',
                )}
              >
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild variant="gradient" size="sm">
                <Link to="/cadastro">Cadastrar</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(true)}
            className={cn('lg:hidden', overHero ? 'text-white/85 hover:bg-white/10 hover:text-white' : 'text-ink-soft')}
          >
            <Menu />
          </Button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-line bg-surface px-6 py-3">
          <div className="mx-auto max-w-[1200px]">
            <SearchBox />
          </div>
        </div>
      )}

      {menuOpen && <MobileDrawer onClose={() => setMenuOpen(false)} />}
    </header>
  );
}

function NavDropdown({
  label,
  items,
  onDark = false,
}: {
  label: string;
  items: { to: string; label: string }[];
  onDark?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'nav-underline flex items-center gap-1 px-3 py-2 text-sm font-medium outline-none transition-colors data-[state=open]:text-brand-pink',
          onDark ? 'text-white/85 hover:text-white' : 'text-ink-soft hover:text-brand-pink',
        )}
      >
        {label}
        <ChevronDown className="size-3.5 transition-transform" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {items.map((item) => (
          <DropdownMenuItem key={item.label} asChild>
            <Link to={item.to}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />
      <div className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-surface shadow-float animate-fade-up">
        <div className="flex h-16 items-center justify-between border-b border-line px-6">
          <Logo />
          <Button variant="ghost" size="icon" aria-label="Fechar menu" onClick={onClose}>
            <X />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {SIMPLE_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'block rounded-lg px-3 py-3 text-sm font-medium text-ink-soft hover:bg-secondary hover:text-brand-pink',
                  isActive && 'text-brand-pink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          <DrawerGroup title="Leilões" items={LEILOES} onNavigate={onClose} />
          <DrawerGroup title="Categorias" items={CATEGORIAS} onNavigate={onClose} />
        </nav>

        <div className="border-t border-line p-4">
          {isAuthenticated ? (
            <Button variant="outline" className="w-full" onClick={() => { logout(); onClose(); }}>
              <LogOut className="mr-2 size-4" /> Sair
            </Button>
          ) : (
            <div className="grid gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/login" onClick={onClose}>
                  Entrar
                </Link>
              </Button>
              <Button asChild variant="gradient" className="w-full">
                <Link to="/cadastro" onClick={onClose}>
                  Cadastrar
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DrawerGroup({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: { to: string; label: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className="mt-2">
      <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-secondary hover:text-brand-pink"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
