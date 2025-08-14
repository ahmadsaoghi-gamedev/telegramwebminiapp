import { z } from "zod";
import { zISODate, zId } from "./common";

export const zPaymentStatus = z.enum(["PENDING", "PAID", "EXPIRED", "FAILED"]);

export const zCreatePaymentRequest = z.object({
  planId: zId
});
export type CreatePaymentRequest = z.infer<typeof zCreatePaymentRequest>;

export const zCreatePaymentResponse = z.object({
  paymentId: zId,
  qr: z.string(),              // bisa string QR (base64) atau URL gambar
  expiresAt: zISODate
});
export type CreatePaymentResponse = z.infer<typeof zCreatePaymentResponse>;

export const zPaymentStatusResponse = z.object({
  status: zPaymentStatus
});
export type PaymentStatusResponse = z.infer<typeof zPaymentStatusResponse>;
