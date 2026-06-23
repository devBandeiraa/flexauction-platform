import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Cpu,
  FileCheck2,
  Fingerprint,
  Handshake,
  Headphones,
  Lock,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/shared/Reveal';
import { useCountUp } from '@/hooks/useCountUp';

const STATS: { end: number; prefix: string; suffix: string; label: string; decimal?: boolean }[] = [
  { end: 12, prefix: '+', suffix: ' mil', label: 'Leilões realizados' },
  { end: 85, prefix: '+', suffix: ' mil', label: 'Usuários ativos' },
  { end: 480, prefix: 'R$ ', suffix: ' mi', label: 'Valor negociado' },
  { end: 48, prefix: '', suffix: '', label: 'Satisfação', decimal: true },
];

const TIMELINE = [
  { year: '2023', title: 'Fundação', text: 'Nasce a FlexAuction com a missão de descomplicar os leilões online.' },
  { year: '2024', title: 'Crescimento nacional', text: 'Expandimos para todo o país e ultrapassamos os primeiros milhares de usuários.' },
  { year: '2025', title: 'Expansão da plataforma', text: 'Novas categorias, lances em tempo real e uma experiência totalmente repensada.' },
  { year: '2026', title: 'Referência em leilões', text: 'Consolidação como uma das plataformas de leilão mais confiáveis do Brasil.' },
];

const VALUES = [
  { icon: ShieldCheck, title: 'Segurança', text: 'Processos verificados e dados protegidos de ponta a ponta.' },
  { icon: TrendingUp, title: 'Transparência', text: 'Cada lance e cada regra à vista — sem letras miúdas.' },
  { icon: Cpu, title: 'Tecnologia', text: 'Lances em tempo real e uma plataforma rápida e estável.' },
  { icon: Handshake, title: 'Confiança', text: 'Relações duradouras com compradores e vendedores.' },
  { icon: Target, title: 'Excelência', text: 'Atenção a cada detalhe da sua experiência de arremate.' },
  { icon: Headphones, title: 'Suporte', text: 'Time pronto para ajudar antes, durante e depois do leilão.' },
];

const SECURITY = [
  { icon: Lock, title: 'Conexão SSL', text: 'Tráfego criptografado em todas as páginas.' },
  { icon: FileCheck2, title: 'Conformidade LGPD', text: 'Tratamento de dados conforme a lei.' },
  { icon: Fingerprint, title: 'Criptografia', text: 'Seus dados sensíveis sempre protegidos.' },
  { icon: ScanSearch, title: 'Auditoria', text: 'Regras de lance auditáveis e rastreáveis.' },
  { icon: Award, title: 'Verificação de lotes', text: 'Cada lote é checado antes de ir ao ar.' },
  { icon: ShieldCheck, title: 'Proteção de dados', text: 'Privacidade garantida em todas as etapas.' },
];

const TESTIMONIALS = [
  {
    name: 'Rafael Souza',
    city: 'São Paulo, SP',
    quote: 'Arrematei meu carro por quase 30% abaixo da tabela FIPE. Processo simples e transparente do início ao fim.',
    avatar: 'https://i.pravatar.cc/120?img=12',
  },
  {
    name: 'Camila Andrade',
    city: 'Belo Horizonte, MG',
    quote: 'Comprei meu primeiro imóvel em leilão pela FlexAuction. O acompanhamento em tempo real me deu muita confiança.',
    avatar: 'https://i.pravatar.cc/120?img=45',
  },
  {
    name: 'Eduardo Lima',
    city: 'Curitiba, PR',
    quote: 'Suporte excelente e leilões bem organizados. Já participei de três disputas e arrematei duas.',
    avatar: 'https://i.pravatar.cc/120?img=33',
  },
];

function StatCard({ stat }: { stat: (typeof STATS)[number] }) {
  const { ref, value } = useCountUp<HTMLParagraphElement>(stat.end);
  const display = stat.decimal ? (value / 10).toLocaleString('pt-BR', { minimumFractionDigits: 1 }) : value.toLocaleString('pt-BR');
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 text-center shadow-card">
      <p ref={ref} className="font-display text-3xl font-bold tabular-nums text-brand-pink sm:text-4xl">
        {stat.prefix}
        {display}
        {stat.suffix}
        {stat.decimal && <span className="text-2xl text-muted-foreground">/5</span>}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
    </div>
  );
}

export function Sobre() {
  return (
    <>
      {/* ---- Hero premium ---- */}
      <section data-hero className="relative -mt-16 overflow-hidden bg-hero pt-16">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pt-20">
          <div className="animate-fade-up text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              <Sparkles className="size-3.5 text-brand-pink" /> Sobre a FlexAuction
            </span>
            <h1 className="mt-5 text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.08] text-white">
              Transformando oportunidades em{' '}
              <span className="bg-gradient-brand bg-clip-text text-transparent">grandes negócios</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-white/70 lg:mx-0">
              Conectamos compradores e vendedores através de uma plataforma moderna, segura e transparente.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button asChild variant="gradient" size="lg" className="gap-2">
                <Link to="/leiloes">
                  Explorar Leilões <ArrowRight className="size-4" />
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

          <div className="relative animate-fade-up">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-float">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
                alt="Equipe FlexAuction colaborando em um escritório moderno"
                loading="lazy"
                className="size-full object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink-deep/70 to-transparent" />
            </div>
            <div className="glass-panel absolute -bottom-5 left-4 right-4 flex items-center justify-between gap-4 rounded-2xl p-4 text-white sm:left-auto sm:right-6 sm:w-64">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-brand-pink/20 text-brand-pink">
                  <Users className="size-5" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold leading-tight">+85 mil</p>
                  <p className="text-xs text-white/70">usuários confiam</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Estatísticas (CountUp) ---- */}
      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <StatCard stat={s} />
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">* Números ilustrativos, para fins de demonstração.</p>
      </section>

      {/* ---- Nossa história (timeline) ---- */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-bold text-ink">Nossa história</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Uma trajetória construída com tecnologia, transparência e a confiança de milhares de pessoas.
            </p>
          </Reveal>

          <div className="relative mt-12">
            <span aria-hidden className="absolute left-0 right-0 top-6 hidden h-0.5 bg-line lg:block" />
            <div className="grid gap-8 lg:grid-cols-4">
              {TIMELINE.map((item, i) => (
                <Reveal key={item.year} delay={i * 0.1} className="relative">
                  <span className="relative z-10 grid size-12 place-items-center rounded-full bg-gradient-brand font-display text-sm font-bold text-white shadow-card">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-4 font-display text-2xl font-bold text-brand-pink">{item.year}</p>
                  <h3 className="mt-1 font-display font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Valores ---- */}
      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold text-ink">Nossos valores</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Princípios que guiam cada decisão e cada leilão na FlexAuction.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-line bg-surface p-6 shadow-card transition-all hover:-translate-y-1 hover:border-brand-pink/30 hover:shadow-card-hover">
                <span className="grid size-12 place-items-center rounded-xl bg-brand-pink/10 text-brand-pink transition-colors group-hover:bg-gradient-brand group-hover:text-white">
                  <v.icon className="size-6" />
                </span>
                <h3 className="mt-4 font-display font-semibold text-ink">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Segurança ---- */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <Reveal className="text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
              <ShieldCheck className="size-6" />
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-ink">Segurança em primeiro lugar</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Protegemos seus dados e suas disputas em todas as etapas, com tecnologia de ponta e conformidade total.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SECURITY.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="flex h-full items-start gap-4 rounded-2xl border border-line bg-bg p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                    <s.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Depoimentos ---- */}
      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold text-ink">O que dizem sobre nós</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Histórias reais de quem já arrematou grandes oportunidades.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-card">
                <div className="flex gap-0.5 text-brand-orange" aria-label="5 de 5 estrelas">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  <img src={t.avatar} alt="" loading="lazy" className="size-11 rounded-full object-cover" />
                  <span className="text-sm font-semibold text-ink">
                    {t.name}
                    <span className="block text-xs font-normal text-muted-foreground">{t.city}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- CTA final ---- */}
      <section className="bg-gradient-brand text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-5 px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-bold text-white">Comece a arrematar hoje</h2>
          <p className="max-w-xl text-white/85">
            Crie sua conta gratuita e participe dos próximos leilões em tempo real.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="outline" className="border-white bg-white text-brand-pink hover:bg-white/90 hover:text-brand-pink">
              <Link to="/cadastro">Criar Conta</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="border border-white/40 text-white hover:bg-white/10 hover:text-white">
              <Link to="/leiloes">Explorar Leilões</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
