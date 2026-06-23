import { Headphones, Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/shared/Reveal';

const ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Segurança garantida',
    text: 'Processos seguros e 100% transparentes do lance ao arremate.',
  },
  {
    icon: Sparkles,
    title: 'Melhores oportunidades',
    text: 'Bens com preços abaixo do mercado, avaliados e verificados.',
  },
  {
    icon: Radio,
    title: 'Lances em tempo real',
    text: 'Acompanhe a disputa ao vivo e seja avisado se for superado.',
  },
  {
    icon: Headphones,
    title: 'Suporte especializado',
    text: 'Equipe pronta para ajudar em todas as etapas do leilão.',
  },
];

export function WhyChoose() {
  return (
    <section className="bg-gradient-brand text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-14">
        <Reveal>
          <h2 className="text-2xl font-bold text-white">Por que escolher a FlexAuction?</h2>
        </Reveal>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-white/15">
                <item.icon className="size-6" />
              </span>
              <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-white/85">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
