import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/store/ui.store';
import { ApiError } from '@/services/api';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos (somente números)'),
  password: z.string().min(8, 'Mínimo de 8 caracteres'),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function AuthModal() {
  const { authModalOpen, authMode, closeAuth, setAuthMode } = useUiStore();
  const { login, register: registerUser } = useAuth();

  return (
    <Dialog open={authModalOpen} onOpenChange={(open) => (open ? null : closeAuth())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{authMode === 'login' ? 'Entrar' : 'Criar conta'}</DialogTitle>
          <DialogDescription>
            {authMode === 'login'
              ? 'Acesse sua conta para dar lances e favoritar lotes.'
              : 'Cadastre-se para participar dos leilões.'}
          </DialogDescription>
        </DialogHeader>

        {authMode === 'login' ? (
          <LoginForm
            onSubmit={async (values) => {
              await login(values);
              toast.success('Bem-vindo de volta!');
              closeAuth();
            }}
          />
        ) : (
          <RegisterForm
            onSubmit={async (values) => {
              await registerUser(values);
              toast.success('Conta criada com sucesso!');
              closeAuth();
            }}
          />
        )}

        <p className="text-center text-sm text-muted-foreground">
          {authMode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
          <button
            type="button"
            className="font-medium text-accent hover:underline"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          >
            {authMode === 'login' ? 'Cadastre-se' : 'Entrar'}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}

function LoginForm({ onSubmit }: { onSubmit: (values: LoginValues) => Promise<void> }) {
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => reset(), [reset]);

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Falha ao entrar';
      setError('password', { message: msg });
      toast.error(msg);
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="login-email">E-mail</Label>
        <Input id="login-email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="login-password">Senha</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}

function RegisterForm({ onSubmit }: { onSubmit: (values: RegisterValues) => Promise<void> }) {
  const form = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => reset(), [reset]);

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        for (const [field, messages] of Object.entries(err.fieldErrors)) {
          setError(field as keyof RegisterValues, { message: messages[0] });
        }
      }
      const msg = err instanceof ApiError ? err.message : 'Falha ao cadastrar';
      toast.error(msg);
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="reg-name">Nome</Label>
        <Input id="reg-name" autoComplete="name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reg-email">E-mail</Label>
        <Input id="reg-email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reg-cpf">CPF</Label>
        <Input id="reg-cpf" inputMode="numeric" placeholder="Somente números" {...register('cpf')} />
        {errors.cpf && <p className="text-sm text-destructive">{errors.cpf.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reg-password">Senha</Label>
        <Input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Criando...' : 'Criar conta'}
      </Button>
    </form>
  );
}
