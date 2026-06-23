import { Link } from 'react-router-dom';
import { Cpu, Headphones, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/shared/PageHero';

const STATS = [
  { value: '12 mil+', label: 'Leilões realizados' },
  { value: '85 mil+', label: 'Usuários ativos' },
  { value: 'R$ 480 mi', label: 'Valor arrematado' },
  { value: '4,8/5', label: 'Satisfação' },
];

const VALUES = [
  { icon: Sparkles, title: 'Transparência', text: 'Cada lance e cada regra à vista — sem letras miúdas.' },
  { icon: ShieldCheck, title: 'Segurança', text: 'Processos verificados e dados protegidos de ponta a ponta.' },
  { icon: Cpu, title: 'Tecnologia', text: 'Lances em tempo real e uma plataforma rápida e estável.' },
  { icon: Headphones, title: 'Suporte', text: 'Time pronto para ajudar antes, durante e depois do leilão.' },
];

export function Sobre() {
  return (
    <>
      <PageHero
        title="Sobre a FlexAuction"
        subtitle="Conectamos pessoas às melhores oportunidades em leilões, com segurança e transparência."
        breadcrumb={[{ label: 'Início', to: '/' }, { label: 'Sobre nós' }]}
      />

      {/* Missão / Quem somos */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-ink">Quem somos</h2>
          <p className="mt-4 text-muted-foreground">
            A FlexAuction nasceu para descomplicar os leilões online. Reunimos imóveis, veículos e
            outros bens em um só lugar, com informações claras e disputa em tempo real — para que
            qualquer pessoa possa arrematar boas oportunidades com confiança.
          </p>
          <p className="mt-4 text-muted-foreground">
            Nossa missão é simples: dar acesso a negócios melhores, com a transparência e a segurança
            que você espera de um produto sério. Tecnologia a serviço de quem quer arrematar bem.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-card">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
            alt="Equipe FlexAuction colaborando em um escritório"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      {/* Números (ilustrativos) */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-12">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold tabular-nums text-brand-pink">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            * Números ilustrativos, para fins de demonstração.
          </p>
        </div>
      </section>

      {/* Valores */}
      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-ink">Nossos valores</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
              <span className="grid size-12 place-items-center rounded-full bg-brand-pink/10 text-brand-pink">
                <v.icon className="size-6" />
              </span>
              <h3 className="mt-4 font-display font-semibold text-ink">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Segurança */}
      <section className="bg-surface">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 py-12 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-success/10 text-success">
            <Lock className="size-6" />
          </span>
          <h2 className="text-2xl font-bold text-ink">Como garantimos segurança</h2>
          <p className="max-w-2xl text-muted-foreground">
            Conexão criptografada (SSL), verificação dos lotes e regras de lance auditáveis. Seus
            dados e suas disputas ficam protegidos em todas as etapas.
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-gradient-brand text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-5 px-6 py-14 text-center">
          <h2 className="font-display text-3xl font-bold text-white">Comece a arrematar hoje</h2>
          <p className="max-w-xl text-white/85">
            Crie sua conta gratuita e participe dos próximos leilões em tempo real.
          </p>
          <Button asChild size="lg" variant="outline" className="border-white bg-white text-brand-pink hover:bg-white/90 hover:text-brand-pink">
            <Link to="/cadastro">Cadastrar</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
