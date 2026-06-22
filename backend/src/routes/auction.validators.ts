import { z } from 'zod';

const category = z.enum(['IMOVEL', 'VEICULO', 'OUTROS']);
const status = z.enum(['UPCOMING', 'LIVE', 'CLOSED']);

export const createAuctionSchema = z
  .object({
    title: z.string().min(3).max(160),
    description: z.string().min(10),
    category,
    city: z.string().min(1).max(120),
    state: z.string().length(2),
    startPrice: z.coerce.number().positive(),
    appraisal: z.coerce.number().positive().optional(),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
  })
  .strict();

export const updateAuctionSchema = createAuctionSchema
  .partial()
  .omit({ startPrice: true })
  .strict();

export const listAuctionsQuerySchema = z.object({
  category: category.optional(),
  status: status.optional(),
  state: z.string().length(2).optional(),
  city: z.string().min(1).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  q: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});

export type ListAuctionsQuery = z.infer<typeof listAuctionsQuerySchema>;
