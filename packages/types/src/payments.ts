import { z } from 'zod';

export const zCreatePaymentRequest = z.object({
  planId: z.string(),
});

export const zCreatePaymentResponse = z.object({
  paymentId: z.string(),
  qr: z.string(),
  expiresAt: z.string(),
});

export const zPaymentStatusResponse = z.object({
  status: z.enum(['PENDING', 'PAID', 'EXPIRED', 'FAILED']),
});
