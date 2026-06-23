import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contactService } from '@/services/contact.api';
import { cn } from '@/lib/utils';

const SUBJECTS = ['Dúvida sobre um lote', 'Pagamento', 'Cadastro e conta', 'Parcerias', 'Outro assunto'];

const FAQ = [
  { q: 'Como dou um lance?', a: 'Crie sua conta, abra o lote desejado e informe um valor acima do lance atual. Você é avisado em tempo real se for superado.' },
  { q: 'Os leilões são seguros?', a: 'Sim. Usamos conexão criptografada (SSL), verificamos os lotes e mantemos regras de lance auditáveis.' },
  { q: 'Como recebo o bem arrematado?', a: 'Após o encerramento, nossa equipe entra em contato com as instruções de pagamento e retirada/entrega.' },
];

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome.'),
  email: z.string().email('Digite um e-mail válido.'),
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
      await contactService.send(values);
      toast.success('Mensagem enviada! Retornaremos em breve.');
      reset();
    } catch {
      toast.error('Não foi possível enviar agora. Tente novamente em instantes.');
    }
  });

  return (
    <>
      <PageHero
        title="Fale com a gente"
        subtitle="Tem uma dúvida ou proposta? Envie sua mensagem e nossa equipe responde rapidinho."
        breadcrumb={[{ label: 'Início', to: '/' }, { label: 'Contato' }]}
      />

      <section className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[1.3fr_1fr]">
        {/* Formulário */}
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="text-xl font-bold text-ink">Envie uma mensagem</h2>
          <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="name" label="Nome" error={errors.name?.message} required>
                <Input placeholder="Seu nome" {...register('name')} />
              </FormField>
              <FormField id="email" label="E-mail" error={errors.email?.message} required>
                <Input type="email" placeholder="voce@exemplo.com" {...register('email')} />
              </FormField>
            </div>

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

            <FormField id="message" label="Mensagem" error={errors.message?.message} required>
              <textarea
                rows={5}
                placeholder="Como podemos ajudar?"
                className={cn(inputClass, 'h-auto resize-y')}
                {...register('message')}
              />
            </FormField>

            <Button type="submit" variant="gradient" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
            </Button>
          </form>
        </div>

        {/* Informações */}
        <div className="space-y-6">
          <ul className="space-y-4">
            <InfoRow icon={Mail} label="E-mail" value="contato@flexauction.com" />
            <InfoRow icon={Phone} label="Telefone" value="(11) 4000-0000" />
            <InfoRow icon={MapPin} label="Endereço" value="Av. Paulista, 1000 — São Paulo/SP" />
            <InfoRow icon={Clock} label="Atendimento" value="Seg a sex, das 9h às 18h" />
          </ul>

          <div className="overflow-hidden rounded-2xl border border-line shadow-card">
            <iframe
              title="Mapa do endereço da FlexAuction"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-46.658%2C-23.566%2C-46.648%2C-23.560&layer=mapnik"
              className="h-56 w-full"
              loading="lazy"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink">Perguntas frequentes</h2>
            <div className="mt-3 space-y-2">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-line bg-surface px-4 py-3 shadow-card"
                >
                  <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
                    {item.q}
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-pink/10 text-brand-pink">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-ink">{value}</p>
      </div>
    </li>
  );
}
