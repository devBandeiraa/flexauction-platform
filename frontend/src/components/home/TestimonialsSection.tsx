import { Star } from 'lucide-react';
import { Reveal } from '@/components/shared/Reveal';

const TESTIMONIALS = [
  {
    name: 'Rafael Souza',
    city: 'São Paulo, SP',
    quote: 'Arrematei meu carro por quase 30% abaixo da tabela FIPE. Processo simples e transparente do início ao fim.',
  },
  {
    name: 'Camila Andrade',
    city: 'Belo Horizonte, MG',
    quote: 'Comprei meu primeiro imóvel em leilão pela FlexAuction. O acompanhamento em tempo real me deu muita confiança.',
  },
  {
    name: 'Eduardo Lima',
    city: 'Curitiba, PR',
    quote: 'Suporte excelente e leilões bem organizados. Já participei de três disputas e arrematei duas.',
  },
  {
    name: 'Patrícia Gomes',
    city: 'Porto Alegre, RS',
    quote: 'A plataforma é muito intuitiva e os valores de avaliação são justos. Recomendo para quem busca boas oportunidades.',
  },
  {
    name: 'Thiago Martins',
    city: 'Salvador, BA',
    quote: 'Encontrei um galpão comercial com um desconto que eu nunca veria no mercado tradicional.',
  },
  {
    name: 'Juliana Costa',
    city: 'Recife, PE',
    quote: 'Lances em tempo real funcionaram perfeitamente, sem travamentos. Fechei negócio em poucos dias.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <Reveal>
        <h2 className="text-center text-2xl font-bold text-ink">
          Milhares de pessoas já encontraram excelentes oportunidades
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card"
          >
            <div className="flex gap-0.5 text-brand-orange" aria-label="5 de 5 estrelas">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <blockquote className="text-sm text-ink">“{t.quote}”</blockquote>
            <figcaption className="mt-auto text-sm font-semibold text-ink">
              {t.name}
              <span className="block text-xs font-normal text-muted-foreground">{t.city}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
