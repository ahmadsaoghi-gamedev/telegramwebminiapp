import { z } from "zod";

export const zId = z.string().min(1);
export const zISODate = z.string(); // gunakan ISO string di wire (Date di DB)

export const zErrorResponse = z.object({
  error: z.string(),
  code: z.string().optional()
});

/** Helper untuk response paginasi */
export const zPaginated = <S extends z.ZodTypeAny>(schema: S) =>
  z.object({
    items: z.array(schema),
    nextCursor: z.string().optional()
  });
