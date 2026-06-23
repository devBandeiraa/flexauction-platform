import { cloneElement, type ReactElement } from 'react';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  /** The control (Input, textarea, select…). Gets id + aria wired automatically. */
  children: ReactElement;
}

/**
 * Reusable label + control + error/hint wrapper. Injects id, aria-invalid and
 * aria-describedby into the child so accessibility is consistent everywhere.
 */
export function FormField({ id, label, error, hint, required, children }: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const control = cloneElement(children, {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    'aria-required': required || undefined,
  } as Record<string, unknown>);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {control}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
