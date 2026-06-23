import { Link } from 'react-router-dom';
import { Briefcase, Camera, Lock, Mail, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

const COLUMNS = [
  {
    title: 'Institucional',
    links: [
      { to: '/sobre', label: 'Sobre nós' },
      { to: '/como-funciona', label: 'Como funciona' },
      { to: '/como-funciona', label: 'Termos de uso' },
      { to: '/como-funciona', label: 'Privacidade' },
      { to: '/como-funciona', label: 'LGPD' },
    ],
  },
  {
    title: 'Leilões',
    links: [
      { to: '/leiloes?status=LIVE', label: 'Ao vivo' },
      { to: '/leiloes?status=UPCOMING', label: 'Em breve' },
      { to: '/leiloes?categoria=IMOVEL', label: 'Imóveis' },
      { to: '/leiloes?categoria=VEICULO', label: 'Veículos' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { to: '/contato', label: 'Contato' },
      { to: '/contato', label: 'Central de ajuda' },
      { to: '/contato', label: 'Perguntas frequentes' },
    ],
  },
];

const SOCIALS = [
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/' },
  { icon: Mail, label: 'E-mail', href: 'mailto:contato@flexauction.com' },
  { icon: Camera, label: 'Instagram', href: 'https://instagram.com/flexauction' },
  { icon: Briefcase, label: 'LinkedIn', href: 'https://linkedin.com/company/flexauction' },
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
          <p className="text-xs text-muted-foreground">CNPJ 12.345.678/0001-90 (exemplo)</p>
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
