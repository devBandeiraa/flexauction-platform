import { Link } from 'react-router-dom';
import { Briefcase, Camera, Lock, Mail, MessageCircle, ShieldCheck, ThumbsUp } from 'lucide-react';
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
      { to: '/como-funciona', label: 'Política de Privacidade' },
    ],
  },
];

const SOCIALS = [
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/' },
  { icon: Camera, label: 'Instagram', href: 'https://instagram.com/flexauction' },
  { icon: Briefcase, label: 'LinkedIn', href: 'https://linkedin.com/company/flexauction' },
  { icon: ThumbsUp, label: 'Facebook', href: 'https://facebook.com/flexauction' },
  { icon: Mail, label: 'E-mail', href: 'mailto:contato@flexauction.com' },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-ink-deep text-white/70">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-white/60">
            Leilões de imóveis, veículos e muito mais com segurança e transparência.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
              <Lock className="size-3.5" /> SSL
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
              <ShieldCheck className="size-3.5" /> LGPD
            </span>
          </div>
          <p className="text-xs text-white/50">CNPJ 12.345.678/0001-90 (exemplo)</p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} className="flex flex-col gap-2">
            <span className="font-display text-sm font-semibold text-white">{col.title}</span>
            {col.links.map((link, i) => (
              <Link
                key={`${link.label}-${i}`}
                to={link.to}
                className="text-sm text-white/60 transition-colors hover:text-brand-pink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
          <p className="text-xs text-white/50">
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
                className="grid size-9 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
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
