import { z } from 'zod';

export const zPaginated = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().optional(),
  });

export const zErrorResponse = z.object({
  error: z.string(),
});
