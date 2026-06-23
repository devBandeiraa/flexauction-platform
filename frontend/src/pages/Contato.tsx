import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  Clock,
  Headset,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Timer,
} from 'lucide-react';
import { Reveal } from '@/components/shared/Reveal';
import { Accordion } from '@/components/shared/Accordion';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contactService } from '@/services/contact.api';
import { cn } from '@/lib/utils';

const WHATSAPP_URL = 'https://wa.me/5511400000000';

const SUBJECTS = ['Dúvida sobre um lote', 'Pagamento', 'Cadastro e conta', 'Parcerias', 'Outro assunto'];

const CONTACT_CARDS = [
  { icon: Phone, label: 'Telefone', value: '(11) 4000-0000', href: 'tel:+551140000000' },
  { icon: Mail, label: 'E-mail', value: 'contato@flexauction.com', href: 'mailto:contato@flexauction.com' },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Fale agora', href: WHATSAPP_URL },
  { icon: MapPin, label: 'Endereço', value: 'Av. Paulista, 1000 — São Paulo/SP', href: 'https://maps.google.com/?q=Av.+Paulista,+1000,+São+Paulo' },
];

const SERVICE = [
  { icon: Clock, title: 'Horários', text: 'Seg a sex, das 9h às 18h' },
  { icon: Timer, title: 'Tempo médio de resposta', text: 'Até 2 horas úteis' },
  { icon: Headset, title: 'Canais disponíveis', text: 'Telefone, e-mail, WhatsApp e chat' },
];

const FAQ = [
  { q: 'Como dou um lance?', a: 'Crie sua conta, abra o lote desejado e informe um valor acima do lance atual. Você é avisado em tempo real se for superado.' },
  { q: 'Os leilões são seguros?', a: 'Sim. Usamos conexão criptografada (SSL), verificamos os lotes e mantemos regras de lance auditáveis.' },
  { q: 'Como recebo o bem arrematado?', a: 'Após o encerramento, nossa equipe entra em contato com as instruções de pagamento e retirada/entrega.' },
];

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome.'),
  email: z.string().email('Digite um e-mail válido.'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Selecione um assunto.'),
  message: z.string().min(10, 'Escreva pelo menos 10 caracteres.'),
});

type Values = z.infer<typeof schema>;

const inputClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export function Contato() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { subject: '' } });

  const submit = handleSubmit(async (values) => {
    try {
      await contactService.send({
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message,
      });
      toast.success('Mensagem enviada! Retornaremos em breve.');
      reset();
    } catch {
      toast.error('Não foi possível enviar agora. Tente novamente em instantes.');
    }
  });

  return (
    <>
      {/* ---- Hero ---- */}
      <section data-hero className="relative -mt-16 overflow-hidden bg-hero pt-16">
        <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-16 text-center lg:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            <Sparkles className="size-3.5 text-brand-pink" /> Atendimento
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.08] text-white">
            Estamos prontos para{' '}
            <span className="bg-gradient-brand bg-clip-text text-transparent">ajudar</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-white/70">
            Entre em contato com nossa equipe e tire suas dúvidas.
          </p>
        </div>
      </section>

      {/* ---- Cards de contato ---- */}
      <section className="relative z-10 mx-auto -mt-10 max-w-[1200px] px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:border-brand-pink/30 hover:shadow-card-hover"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-brand-pink/10 text-brand-pink transition-colors group-hover:bg-gradient-brand group-hover:text-white">
                  <c.icon className="size-6" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="font-display font-semibold text-ink">{c.value}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Formulário + Atendimento/Mapa ---- */}
      <section className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-bold text-ink">Envie uma mensagem</h2>
            <p className="mt-1 text-sm text-muted-foreground">Preencha o formulário e nossa equipe responde rapidinho.</p>
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="name" label="Nome" error={errors.name?.message} required>
                  <Input placeholder="Seu nome" {...register('name')} />
                </FormField>
                <FormField id="email" label="E-mail" error={errors.email?.message} required>
                  <Input type="email" placeholder="voce@exemplo.com" {...register('email')} />
                </FormField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="phone" label="Telefone" error={errors.phone?.message}>
                  <Input type="tel" inputMode="tel" placeholder="(11) 99999-9999" {...register('phone')} />
                </FormField>
                <FormField id="subject" label="Assunto" error={errors.subject?.message} required>
                  <select className={inputClass} defaultValue="" {...register('subject')}>
                    <option value="" disabled>
                      Selecione um assunto
                    </option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField id="message" label="Mensagem" error={errors.message?.message} required>
                <textarea
                  rows={5}
                  placeholder="Como podemos ajudar?"
                  className={cn(inputClass, 'h-auto resize-y')}
                  {...register('message')}
                />
              </FormField>

              <Button type="submit" variant="gradient" size="lg" className="w-full gap-2 sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : (<>Enviar mensagem <Send className="size-4" /></>)}
              </Button>
            </form>
          </div>
        </Reveal>

        <div className="space-y-6">
          <Reveal>
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
              <h2 className="font-display text-lg font-bold text-ink">Atendimento</h2>
              <ul className="mt-4 space-y-4">
                {SERVICE.map((s) => (
                  <li key={s.title} className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-pink/10 text-brand-pink">
                      <s.icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs text-muted-foreground">{s.title}</p>
                      <p className="font-medium text-ink">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-line shadow-card">
              <iframe
                title="Mapa do endereço da FlexAuction"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-46.658%2C-23.566%2C-46.648%2C-23.560&layer=mapnik"
                className="h-64 w-full"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[800px] px-6 py-16">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-bold text-ink">Perguntas frequentes</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              As dúvidas mais comuns de quem participa dos nossos leilões.
            </p>
          </Reveal>
          <div className="mt-10">
            <Accordion items={FAQ} defaultOpen={0} />
          </div>
        </div>
      </section>

      {/* ---- CTA final ---- */}
      <section className="bg-gradient-brand text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-5 px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-bold text-white">Ainda precisa de ajuda?</h2>
          <p className="max-w-xl text-white/85">Nossa equipe está a um clique de distância.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="outline" className="gap-2 border-white bg-white text-brand-pink hover:bg-white/90 hover:text-brand-pink">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" /> Falar no WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost" className="border border-white/40 text-white hover:bg-white/10 hover:text-white">
              <Link to="/login">Abrir chamado</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
