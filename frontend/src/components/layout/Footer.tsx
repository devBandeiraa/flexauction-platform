import { Link } from 'react-router-dom';
import { Briefcase, Camera, Clock, Lock, Mail, MessageCircle, Phone, ThumbsUp } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

const COLUMNS = [
  {
    title: 'Institucional',
    links: [
      { to: '/sobre', label: 'Sobre nós' },
      { to: '/como-funciona', label: 'Como funciona' },
      { to: '/como-funciona', label: 'Termos de uso' },
      { to: '/como-funciona', label: 'Política de privacidade' },
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
      { to: '/leiloes?categoria=MAQUINA', label: 'Máquinas' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { to: '/contato', label: 'Central de ajuda' },
      { to: '/contato', label: 'Perguntas frequentes' },
      { to: '/contato', label: 'Contato' },
      { to: '/contato', label: 'Atendimento' },
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
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-white/60">
            A plataforma de leilões online mais completa, segura e transparente do Brasil.
          </p>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            <Lock className="size-3.5" /> Conexão segura SSL
          </p>
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

        {/* Contact column */}
        <div className="flex flex-col gap-2">
          <span className="font-display text-sm font-semibold text-white">Contato</span>
          <a href="tel:+5515993000000" className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand-pink">
            <Phone className="size-3.5 shrink-0" /> (15) 99300-0000
          </a>
          <a href="mailto:contato@flexauction.com.br" className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand-pink">
            <Mail className="size-3.5 shrink-0" /> contato@flexauction.com.br
          </a>
          <a href="https://wa.me/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand-pink">
            <MessageCircle className="size-3.5 shrink-0" /> WhatsApp
          </a>
          <p className="flex items-center gap-2 text-sm text-white/60">
            <Clock className="size-3.5 shrink-0" /> Seg a Sex 09h–18h
          </p>
          <div className="mt-1 flex items-center gap-1">
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

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} FlexAuction. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5" /> Site seguro SSL
            </span>
            <span>Powered by FlexAuction</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
