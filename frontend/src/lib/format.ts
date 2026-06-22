const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? Number(value) : value;
  return currencyFormatter.format(Number.isFinite(num) ? num : 0);
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDateTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return dateFormatter.format(date);
}

/** Breaks a millisecond span into a zero-padded HH:MM:SS countdown string. */
export function formatCountdown(msRemaining: number): string {
  if (msRemaining <= 0) return '00:00:00';
  const totalSeconds = Math.floor(msRemaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export const CATEGORY_LABELS: Record<string, string> = {
  IMOVEL: 'Imóveis',
  VEICULO: 'Veículos',
  OUTROS: 'Outros',
};

export const STATUS_LABELS: Record<string, string> = {
  UPCOMING: 'Em breve',
  LIVE: 'Ao vivo',
  CLOSED: 'Encerrado',
};
