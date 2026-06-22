import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Gavel, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchBox } from './SearchBox';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { to: '/busca?categoria=IMOVEL', label: 'Imóveis' },
  { to: '/busca?categoria=VEICULO', label: 'Veículos' },
  { to: '/busca?categoria=OUTROS', label: 'Outros' },
  { to: '/como-funciona', label: 'Como Funciona' },
];

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const openAuth = useUiStore((s) => s.openAuth);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-bold text-primary">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Gavel className="size-4" />
          </span>
          <span className="hidden text-lg sm:inline">AuctionHub</span>
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBox />
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-text-primary/80 transition-colors hover:bg-secondary',
                  isActive && 'text-accent',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-secondary">
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
            <>
              <Button variant="ghost" size="sm" onClick={() => openAuth('login')}>
                Entrar
              </Button>
              <Button size="sm" onClick={() => openAuth('register')}>
                Cadastrar
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-border px-4 py-2 md:hidden">
        <SearchBox />
      </div>
    </header>
  );
}
