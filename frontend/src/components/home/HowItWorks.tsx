import { Gavel, Radio, Search, Trophy, UserPlus } from 'lucide-react';
import { Reveal } from '@/components/shared/Reveal';

const STEPS = [
  { icon: UserPlus, title: 'Cadastre-se', text: 'Crie sua conta gratuitamente em segundos.' },
  { icon: Search, title: 'Escolha um lote', text: 'Explore imóveis, veículos e outros bens.' },
  { icon: Gavel, title: 'Envie seu lance', text: 'Dê seu lance com segurança e transparência.' },
  { icon: Radio, title: 'Acompanhe em tempo real', text: 'Veja a disputa ao vivo e seja avisado se for superado.' },
  { icon: Trophy, title: 'Arremate', text: 'Vença o leilão e finalize a aquisição do seu lote.' },
] as const;

export function HowItWorks() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <h2 className="mb-12 text-center text-2xl font-bold text-ink">Como funciona</h2>
        <div className="relative grid gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div
            aria-hidden
            className="absolute inset-x-[8%] top-7 hidden border-t-2 border-dashed border-line lg:block"
          />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1} className="relative flex flex-col items-center text-center">
              <span className="relative grid size-14 place-items-center rounded-full bg-brand-pink/10 text-brand-pink">
                <step.icon className="size-6" />
                <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-gradient-brand text-xs font-bold text-white">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>
              <h3 className="mt-4 font-display font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 max-w-[12rem] text-sm text-muted-foreground">{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
