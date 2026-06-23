import type { Request, Response } from 'express';
import { z } from 'zod';
import * as auctionService from '../services/auction.service.js';

const CATEGORIES = [
  { value: 'IMOVEL', label: 'Imóveis' },
  { value: 'VEICULO', label: 'Veículos' },
  { value: 'GALPAO', label: 'Galpões' },
  { value: 'MAQUINA', label: 'Máquinas' },
  { value: 'EMBARCACAO', label: 'Embarcações' },
  { value: 'OUTROS', label: 'Outros' },
] as const;

const searchQuerySchema = z.object({ q: z.string().trim().min(1) });

export function listCategoriesHandler(_req: Request, res: Response): void {
  res.json(CATEGORIES);
}

export async function searchHandler(req: Request, res: Response): Promise<void> {
  const { q } = searchQuerySchema.parse(req.query);
  const results = await auctionService.searchAuctions(q);
  res.json(results);
}
