import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, ShieldCheck, Sparkles, Star, TrendingUp } from 'lucide-react';
import { LogoMark } from '@/components/shared/Logo';

const BENEFITS = [
  { icon: Radio, text: 'Lances em tempo real' },
  { icon: ShieldCheck, text: 'Segurança e processos confiáveis' },
  { icon: TrendingUp, text: 'As melhores oportunidades do mercado' },
];

const STATS = [
  { value: '+85 mil', label: 'usuários' },
  { value: '+12 mil', label: 'leilões' },
  { value: '4,8', label: 'estrelas', icon: Star },
];

interface AuthLayoutProps {
  children: ReactNode;
  /** Headline shown on the brand panel. */
  headline?: string;
}

/**
 * Split-screen shell for the auth screens: a premium dark brand panel (≈45%)
 * with imagery, benefits and social proof, and a clean form panel (≈55%). On
 * mobile the brand panel collapses to a compact top strip.
 */
export function AuthLayout({ children, headline = 'Arremate oportunidades únicas.' }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      <aside className="relative flex flex-col justify-between overflow-hidden bg-hero px-8 py-8 text-white lg:w-[45%] lg:px-12 lg:py-12">
        {/* Premium photo wash behind the dark gradient */}
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.12]"
        />

        <Link
          to="/"
          aria-label="FlexAuction — início"
          className="relative z-10 flex items-center gap-2"
        >
          <LogoMark className="size-8 shrink-0 [&_*]:!fill-white" />
          <span className="font-display text-xl font-bold">FlexAuction</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 hidden lg:block"
        >
          <h2 className="max-w-sm font-display text-[2rem] font-bold leading-tight">
            {headline}
          </h2>
          <ul className="mt-8 space-y-4">
            {BENEFITS.map((b, i) => (
              <motion.li
                key={b.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1, ease: 'easeOut' }}
                className="flex items-center gap-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-brand-pink ring-1 ring-white/15">
                  <b.icon className="size-5" />
                </span>
                <span className="font-medium text-white/90">{b.text}</span>
              </motion.li>
            ))}
          </ul>

          <dl className="mt-10 flex gap-8 border-t border-white/10 pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="flex items-center gap-1 font-display text-2xl font-bold">
                  {s.value}
                  {s.icon && <s.icon className="size-5 fill-brand-orange text-brand-orange" />}
                </dd>
                <p className="text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </dl>
        </motion.div>

        <p className="relative z-10 hidden items-center gap-2 text-sm text-white/70 lg:flex">
          <Sparkles className="size-4 text-brand-pink" />© {new Date().getFullYear()} FlexAuction
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
