import { Link } from 'react-router-dom';
import { Globe, Lock, Mail, MessageCircle, Share2 } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

const COLUMNS = [
  {
    title: 'Institucional',
    links: [
      { to: '/como-funciona', label: 'Como funciona' },
      { to: '/como-funciona', label: 'Sobre nós' },
      { to: '/como-funciona', label: 'Termos de uso' },
      { to: '/como-funciona', label: 'Privacidade' },
    ],
  },
  {
    title: 'Leilões',
    links: [
      { to: '/busca?status=LIVE', label: 'Ao vivo' },
      { to: '/busca?status=UPCOMING', label: 'Em breve' },
      { to: '/busca?categoria=IMOVEL', label: 'Imóveis' },
      { to: '/busca?categoria=VEICULO', label: 'Veículos' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { to: '/como-funciona', label: 'Central de ajuda' },
      { to: '/como-funciona', label: 'Perguntas frequentes' },
    ],
  },
];

const SOCIALS = [
  { icon: Globe, label: 'Site', href: 'https://flexauction.com' },
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/' },
  { icon: Mail, label: 'E-mail', href: 'mailto:contato@flexauction.com' },
  { icon: Share2, label: 'Compartilhar', href: 'https://flexauction.com' },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Leilões de imóveis, veículos e muito mais com segurança e transparência.
          </p>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            <Lock className="size-3.5" /> Conexão segura SSL
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} className="flex flex-col gap-2">
            <span className="font-display text-sm font-semibold text-ink">{col.title}</span>
            {col.links.map((link, i) => (
              <Link
                key={`${link.label}-${i}`}
                to={link.to}
                className="text-sm text-muted-foreground transition-colors hover:text-brand-pink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FlexAuction. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-brand-pink"
              >
                <social.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
