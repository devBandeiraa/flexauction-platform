import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CreditCard,
  Gavel,
  Headphones,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCog,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/shared/Reveal';
import { Accordion } from '@/components/shared/Accordion';

const STEPS = [
  { icon: UserPlus, title: 'Crie sua conta', text: 'Cadastre-se gratuitamente em menos de um minuto com seus dados básicos.' },
  { icon: UserCog, title: 'Complete seu perfil', text: 'Confirme suas informações e deixe sua conta pronta para dar lances.' },
  { icon: Search, title: 'Explore os lotes', text: 'Navegue por imóveis, veículos e outros bens usando filtros inteligentes.' },
  { icon: Gavel, title: 'Faça seu lance', text: 'Defina seu valor e participe da disputa com total segurança.' },
  { icon: Radio, title: 'Acompanhe em tempo real', text: 'Veja a disputa ao vivo e seja avisado na hora se for superado.' },
  { icon: Trophy, title: 'Vença o leilão', text: 'Seja o maior lance ao encerramento e garanta a sua oportunidade.' },
  { icon: CreditCard, title: 'Finalize a compra', text: 'Receba as instruções de pagamento e retirada do seu lote arrematado.' },
];

const BENEFITS = [
  { icon: ShieldCheck, title: 'Transparência total', text: 'Cada lance e cada regra ficam à vista.' },
  { icon: BadgeCheck, title: 'Processo seguro', text: 'Lotes verificados e conexão criptografada.' },
  { icon: Radio, title: 'Lances em tempo real', text: 'Disputa ao vivo, sem atrasos.' },
  { icon: Bell, title: 'Notificações automáticas', text: 'Avisamos quando você for superado.' },
  { icon: Headphones, title: 'Suporte especializado', text: 'Time pronto para ajudar em cada etapa.' },
];

const FAQ = [
  { q: 'Como participar de um leilão?', a: 'Crie sua conta gratuitamente, complete seu perfil, escolha um lote e dê o seu lance. Tudo acontece online, em tempo real.' },
  { q: 'Preciso pagar para me cadastrar?', a: 'Não. O cadastro na FlexAuction é totalmente gratuito. Você só paga pelo lote caso vença o leilão.' },
  { q: 'Como funciona o pagamento?', a: 'Após o encerramento, você recebe as instruções de pagamento por e-mail. Trabalhamos com meios seguros e auditáveis.' },
  { q: 'Como recebo meu lote?', a: 'Depois da confirmação do pagamento, nossa equipe organiza a retirada ou entrega conforme o tipo de bem arrematado.' },
  { q: 'O que acontece se eu vencer?', a: 'Você é notificado imediatamente e recebe o passo a passo para concluir a compra com segurança e transparência.' },
];

export function ComoFunciona() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-16 text-center lg:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            <Sparkles className="size-3.5 text-brand-pink" /> Como funciona
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.08] text-white">
            Participar de leilões nunca foi tão{' '}
            <span className="bg-gradient-brand bg-clip-text text-transparent">simples</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-white/70">
            Conheça cada etapa do processo e comece a arrematar hoje.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="gradient" size="lg" className="gap-2">
              <Link to="/leiloes">
                Ver Leilões <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/cadastro">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Processo interativo ---- */}
      <section className="mx-auto max-w-[900px] px-6 py-16">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold text-ink">O passo a passo completo</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Do cadastro à finalização da compra — sete etapas claras e seguras.
          </p>
        </Reveal>

        <ol className="relative mt-12 space-y-6 before:absolute before:left-6 before:top-3 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-line">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <li className="relative flex gap-5">
                <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-gradient-brand text-white shadow-card ring-4 ring-bg">
                  <step.icon className="size-5" />
                </span>
                <div className="flex-1 rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-pink/30 hover:shadow-card-hover">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs font-bold text-brand-pink">
                      Etapa {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---- Benefícios ---- */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-bold text-ink">Por que arrematar com a FlexAuction</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Vantagens pensadas para você participar com confiança do começo ao fim.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06}>
                <div className="flex h-full items-start gap-4 rounded-2xl border border-line bg-bg p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-pink/10 text-brand-pink">
                    <b.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-ink">{b.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="mx-auto max-w-[800px] px-6 py-16">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold text-ink">Perguntas frequentes</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Tire suas principais dúvidas antes de dar o primeiro lance.
          </p>
        </Reveal>
        <div className="mt-10">
          <Accordion items={FAQ} defaultOpen={0} />
        </div>
      </section>

      {/* ---- CTA final ---- */}
      <section className="bg-gradient-brand text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-5 px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-bold text-white">Pronto para arrematar?</h2>
          <p className="max-w-xl text-white/85">
            Crie sua conta gratuita e participe dos próximos leilões em tempo real.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="outline" className="border-white bg-white text-brand-pink hover:bg-white/90 hover:text-brand-pink">
              <Link to="/cadastro">Criar Conta</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="border border-white/40 text-white hover:bg-white/10 hover:text-white">
              <Link to="/leiloes">Ver Leilões</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
