import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { LogoMark } from '@/components/shared/Logo';

const BENEFITS = [
  { icon: Radio, text: 'Lances em tempo real' },
  { icon: ShieldCheck, text: 'Processos 100% seguros' },
  { icon: Sparkles, text: 'Melhores oportunidades' },
];

/**
 * Split-screen shell for the auth screens: a gradient brand panel (≈45%) and a
 * clean form panel (≈55%). On mobile the brand panel collapses to a compact top
 * strip.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      <aside className="relative flex flex-col justify-between overflow-hidden bg-gradient-brand px-8 py-8 text-white lg:w-[45%] lg:px-12 lg:py-12">
        <Link to="/" aria-label="FlexAuction — início" className="flex items-center gap-2">
          <LogoMark className="size-8 shrink-0 [&_*]:!fill-white" />
          <span className="font-display text-xl font-bold">FlexAuction</span>
        </Link>

        <div className="hidden lg:block">
          <h2 className="max-w-sm font-display text-3xl font-bold leading-tight">
            Os melhores negócios você encontra aqui.
          </h2>
          <ul className="mt-8 space-y-4">
            {BENEFITS.map((b) => (
              <li key={b.text} className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-white/15">
                  <b.icon className="size-5" />
                </span>
                <span className="font-medium">{b.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="hidden text-sm text-white/80 lg:block">
          © {new Date().getFullYear()} FlexAuction
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
