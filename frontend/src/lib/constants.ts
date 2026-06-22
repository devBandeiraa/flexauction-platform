import type { AuctionStatus, Category } from '@/types';

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'IMOVEL', label: 'Imóveis' },
  { value: 'VEICULO', label: 'Veículos' },
  { value: 'OUTROS', label: 'Outros' },
];

export const STATUS_OPTIONS: { value: AuctionStatus; label: string }[] = [
  { value: 'LIVE', label: 'Ao vivo' },
  { value: 'UPCOMING', label: 'Em breve' },
  { value: 'CLOSED', label: 'Encerrado' },
];
