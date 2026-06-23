import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { FormField } from '@/components/shared/FormField';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { SocialAuthButtons } from '@/components/shared/SocialAuthButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email('Digite um e-mail válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

type Values = z.infer<typeof schema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [remember, setRemember] = useState(true);
  const from = (location.state as { from?: string } | null)?.from ?? '/painel';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const submit = handleSubmit(async (values) => {
    try {
      await login(values);
      toast.success('Bem-vindo de volta!');
      navigate(from, { replace: true });
    } catch {
      // Generic message on purpose — never reveal which field failed.
      toast.error('Credenciais inválidas. Verifique e tente novamente.');
    }
  });

  return (
    <AuthLayout headline="Arremate oportunidades únicas.">
      <h1 className="font-display text-3xl font-bold text-ink">Entrar</h1>
      <p className="mt-1 text-muted-foreground">Acesse sua conta para dar lances e favoritar lotes.</p>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <FormField id="email" label="E-mail" error={errors.email?.message} required>
          <Input type="email" autoComplete="email" placeholder="voce@exemplo.com" {...register('email')} />
        </FormField>

        <FormField id="password" label="Senha" error={errors.password?.message} required>
          <PasswordInput autoComplete="current-password" placeholder="Sua senha" {...register('password')} />
        </FormField>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded border-line accent-brand-pink"
            />
            Lembrar-me
          </label>
          <Link to="/contato" className="text-sm font-medium text-brand-pink hover:underline">
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-line" /> ou continue com <span className="h-px flex-1 bg-line" />
      </div>

      <SocialAuthButtons />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Não tem conta?{' '}
        <Link to="/cadastro" className="font-medium text-brand-pink hover:underline">
          Cadastre-se
        </Link>
      </p>
    </AuthLayout>
  );
}
