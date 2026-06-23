import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, KeyRound, Lock, ShieldCheck, UserRound } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { FormField } from '@/components/shared/FormField';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { PasswordStrength } from '@/components/shared/PasswordStrength';
import { SocialAuthButtons } from '@/components/shared/SocialAuthButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/services/api';
import { cn } from '@/lib/utils';

const schema = z
  .object({
    name: z.string().min(2, 'Informe seu nome completo.'),
    email: z.string().email('Digite um e-mail válido.'),
    phone: z.string().min(10, 'Informe um telefone válido com DDD.'),
    cpf: z.string().regex(/^\d{11}$/, 'O CPF deve ter 11 dígitos (somente números).'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: 'Você precisa aceitar os termos.' }) }),
    lgpd: z.literal(true, { errorMap: () => ({ message: 'Você precisa autorizar o tratamento dos dados.' }) }),
  })
  .refine((d) => d.password === d.confirm, {
    path: ['confirm'],
    message: 'As senhas não coincidem.',
  });

type Values = z.infer<typeof schema>;

const STEPS = [
  { label: 'Dados pessoais', icon: UserRound },
  { label: 'Segurança', icon: KeyRound },
  { label: 'Conta criada', icon: CheckCircle2 },
];

const TRUST = [
  { icon: Lock, text: 'SSL seguro' },
  { icon: ShieldCheck, text: 'LGPD' },
  { icon: KeyRound, text: 'Dados criptografados' },
];

export function Cadastro() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched' });

  const password = watch('password') ?? '';

  const goToSecurity = async () => {
    const ok = await trigger(['name', 'email', 'phone', 'cpf']);
    if (ok) setStep(1);
  };

  const submit = handleSubmit(async (values) => {
    try {
      await registerUser({ name: values.name, email: values.email, cpf: values.cpf, password: values.password });
      setStep(2);
      toast.success('Conta criada com sucesso!');
      setTimeout(() => navigate('/painel', { replace: true }), 2000);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        for (const [field, messages] of Object.entries(err.fieldErrors)) {
          setError(field as keyof Values, { message: messages[0] });
        }
      }
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível criar a conta.');
    }
  });

  return (
    <AuthLayout headline="Onboarding rápido. Comece a arrematar hoje.">
      <h1 className="font-display text-3xl font-bold text-ink">Criar conta</h1>
      <p className="mt-1 text-muted-foreground">Cadastre-se gratuitamente para participar dos leilões.</p>

      <Stepper step={step} />

      <AnimatePresence mode="wait">
        {step === 2 ? (
          <SuccessState key="success" onContinue={() => navigate('/painel', { replace: true })} />
        ) : (
          <motion.form
            key={step}
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0, x: step === 1 ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 1 ? -24 : 24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mt-6 space-y-4"
          >
            {step === 0 && (
              <>
                <FormField id="name" label="Nome completo" error={errors.name?.message} required>
                  <Input autoComplete="name" placeholder="Seu nome" {...register('name')} />
                </FormField>
                <FormField id="email" label="E-mail" error={errors.email?.message} required>
                  <Input type="email" autoComplete="email" placeholder="voce@exemplo.com" {...register('email')} />
                </FormField>
                <FormField id="phone" label="Telefone" error={errors.phone?.message} required>
                  <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 99999-9999" {...register('phone')} />
                </FormField>
                <FormField id="cpf" label="CPF" error={errors.cpf?.message} hint="Somente números" required>
                  <Input inputMode="numeric" placeholder="00000000000" {...register('cpf')} />
                </FormField>

                <Button type="button" variant="gradient" size="lg" className="w-full gap-2" onClick={goToSecurity}>
                  Continuar <ArrowRight className="size-4" />
                </Button>

                <div className="my-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-line" /> ou cadastre-se com <span className="h-px flex-1 bg-line" />
                </div>
                <SocialAuthButtons />
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <FormField id="password" label="Senha" error={errors.password?.message} required>
                    <PasswordInput autoComplete="new-password" placeholder="Mínimo de 8 caracteres" {...register('password')} />
                  </FormField>
                  <PasswordStrength value={password} />
                </div>

                <FormField id="confirm" label="Confirmar senha" error={errors.confirm?.message} required>
                  <PasswordInput autoComplete="new-password" placeholder="Repita a senha" {...register('confirm')} />
                </FormField>

                <Consent error={errors.terms?.message} register={register('terms')}>
                  Li e aceito os{' '}
                  <Link to="/como-funciona" className="font-medium text-brand-pink hover:underline">
                    Termos de uso
                  </Link>
                  .
                </Consent>

                <Consent error={errors.lgpd?.message} register={register('lgpd')}>
                  Autorizo o tratamento dos meus dados conforme a{' '}
                  <Link to="/como-funciona" className="font-medium text-brand-pink hover:underline">
                    Política de Privacidade (LGPD)
                  </Link>
                  .
                </Consent>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" size="lg" className="gap-2" onClick={() => setStep(0)}>
                    <ArrowLeft className="size-4" /> Voltar
                  </Button>
                  <Button type="submit" variant="gradient" size="lg" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'Criando...' : 'Criar conta'}
                  </Button>
                </div>
              </>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      {step !== 2 && (
        <>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-line pt-5">
            {TRUST.map((t) => (
              <li key={t.text} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <t.icon className="size-3.5 text-success" /> {t.text}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-brand-pink hover:underline">
              Entrar
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="mt-6 flex items-center gap-2" aria-label="Etapas do cadastro">
      {STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={s.label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'grid size-9 place-items-center rounded-full text-sm font-bold transition-colors',
                  active && 'bg-gradient-brand text-white shadow-card',
                  done && 'bg-success text-white',
                  !active && !done && 'bg-secondary text-muted-foreground',
                )}
                aria-current={active ? 'step' : undefined}
              >
                {done ? <Check className="size-4" /> : <s.icon className="size-4" />}
              </span>
              <span className={cn('text-[0.7rem] font-medium', active ? 'text-ink' : 'text-muted-foreground')}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className={cn('mb-5 h-0.5 flex-1 rounded-full transition-colors', done ? 'bg-success' : 'bg-line')} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Consent({
  error,
  register,
  children,
}: {
  error?: string;
  register: ReturnType<ReturnType<typeof useForm<Values>>['register']>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          className="mt-0.5 size-4 rounded border-line accent-brand-pink"
          aria-invalid={error ? true : undefined}
          {...register}
        />
        <span>{children}</span>
      </label>
      {error && (
        <p role="alert" className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function SuccessState({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mt-10 flex flex-col items-center text-center"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 14 }}
        className="grid size-20 place-items-center rounded-full bg-success/10 text-success"
      >
        <CheckCircle2 className="size-12" />
      </motion.span>
      <h2 className="mt-6 font-display text-2xl font-bold text-ink">Conta criada com sucesso!</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Tudo pronto. Você já pode explorar os lotes e dar seus primeiros lances em tempo real.
      </p>
      <Button onClick={onContinue} variant="gradient" size="lg" className="mt-8 w-full gap-2">
        Ir para o painel <ArrowRight className="size-4" />
      </Button>
    </motion.div>
  );
}
