import { cn } from '@/lib/utils';

type Strength = 0 | 1 | 2 | 3;

/** 0 = empty, 1 = fraca, 2 = média, 3 = forte. */
function scorePassword(pw: string): Strength {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length < 8) return 1;
  return Math.min(3, Math.max(1, score - 1)) as Strength;
}

const META: Record<Exclude<Strength, 0>, { label: string; color: string; bars: number }> = {
  1: { label: 'Fraca', color: 'bg-destructive', bars: 1 },
  2: { label: 'Média', color: 'bg-brand-orange', bars: 2 },
  3: { label: 'Forte', color: 'bg-success', bars: 3 },
};

export function PasswordStrength({ value }: { value: string }) {
  const strength = scorePassword(value);
  if (strength === 0) return null;
  const meta = META[strength];

  return (
    <div className="mt-1" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn('h-1 flex-1 rounded-full transition-colors', i <= meta.bars ? meta.color : 'bg-line')}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Força da senha: <span className="font-medium text-ink">{meta.label}</span>
      </p>
    </div>
  );
}
