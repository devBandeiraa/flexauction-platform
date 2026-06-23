import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { FormField } from '@/components/shared/FormField';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { PasswordStrength } from '@/components/shared/PasswordStrength';
import { GoogleButton } from '@/components/shared/GoogleButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/services/api';

const schema = z
  .object({
    name: z.string().min(2, 'Informe seu nome completo.'),
    email: z.string().email('Digite um e-mail válido.'),
    cpf: z.string().regex(/^\d{11}$/, 'O CPF deve ter 11 dígitos (somente números).'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: 'Você precisa aceitar os termos.' }) }),
  })
  .refine((d) => d.password === d.confirm, {
    path: ['confirm'],
    message: 'As senhas não coincidem.',
  });

type Values = z.infer<typeof schema>;

export function Cadastro() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const password = watch('password') ?? '';

  const submit = handleSubmit(async (values) => {
    try {
      await registerUser({ name: values.name, email: values.email, cpf: values.cpf, password: values.password });
      toast.success('Conta criada com sucesso!');
      navigate('/painel', { replace: true });
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
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold text-ink">Criar conta</h1>
      <p className="mt-1 text-muted-foreground">Cadastre-se para participar dos leilões.</p>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <FormField id="name" label="Nome completo" error={errors.name?.message} required>
          <Input autoComplete="name" placeholder="Seu nome" {...register('name')} />
        </FormField>

        <FormField id="email" label="E-mail" error={errors.email?.message} required>
          <Input type="email" autoComplete="email" placeholder="voce@exemplo.com" {...register('email')} />
        </FormField>

        <FormField id="cpf" label="CPF" error={errors.cpf?.message} hint="Somente números" required>
          <Input inputMode="numeric" placeholder="00000000000" {...register('cpf')} />
        </FormField>

        <div>
          <FormField id="password" label="Senha" error={errors.password?.message} required>
            <PasswordInput autoComplete="new-password" placeholder="Mínimo de 8 caracteres" {...register('password')} />
          </FormField>
          <PasswordStrength value={password} />
        </div>

        <FormField id="confirm" label="Confirmar senha" error={errors.confirm?.message} required>
          <PasswordInput autoComplete="new-password" placeholder="Repita a senha" {...register('confirm')} />
        </FormField>

        <div>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              className="mt-0.5 size-4 rounded border-line accent-brand-pink"
              aria-invalid={errors.terms ? true : undefined}
              {...register('terms')}
            />
            <span>
              Li e aceito os{' '}
              <Link to="/como-funciona" className="font-medium text-brand-pink hover:underline">
                Termos de uso
              </Link>{' '}
              e a{' '}
              <Link to="/como-funciona" className="font-medium text-brand-pink hover:underline">
                Política de privacidade
              </Link>
              .
            </span>
          </label>
          {errors.terms && (
            <p role="alert" className="mt-1 text-sm text-destructive">
              {errors.terms.message}
            </p>
          )}
        </div>

        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar conta'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-line" /> ou <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton label="Cadastrar com Google" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-brand-pink hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
