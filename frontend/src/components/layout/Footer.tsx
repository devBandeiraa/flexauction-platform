import { Link } from 'react-router-dom';
import { Gavel, ShieldCheck } from 'lucide-react';

const LINKS = [
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
  { to: '/privacidade', label: 'Política de Privacidade' },
  { to: '/termos', label: 'Termos de Uso' },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Gavel className="size-5" />
            AuctionHub
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Leilões de imóveis, veículos e muito mais com segurança e transparência.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-success" /> Conexão segura SSL
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-text-primary">Institucional</span>
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AuctionHub. Todos os direitos reservados.
      </div>
    </footer>
  );
}
