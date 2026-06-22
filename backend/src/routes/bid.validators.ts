import { z } from 'zod';

export const placeBidSchema = z
  .object({
    value: z.number().positive(),
  })
  .strict();
