import { z } from "zod";
import { zISODate, zId } from "./common";

export const zUserPlan = z.enum(["FREE", "VIP"]);

export const zUserProfile = z.object({
  id: zId,
  telegramId: z.string(),
  name: z.string().optional(),
  username: z.string().optional(),
  photoUrl: z.string().url().optional(),
  plan: zUserPlan.default("FREE"),
  vipExpiresAt: zISODate.optional(),
  points: z.number().int().nonnegative().default(0),
  referralCode: z.string().optional(),
  referredBy: z.string().optional(),
  createdAt: zISODate.optional(),
  updatedAt: zISODate.optional()
});
export type UserProfile = z.infer<typeof zUserProfile>;

export const zAuthVerifyRequest = z.object({
  initData: z.string().min(1)
});
export const zAuthVerifyResponse = z.object({
  profile: zUserProfile
});
