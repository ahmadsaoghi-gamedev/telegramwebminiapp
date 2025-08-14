import { z } from 'zod';

export const zUserProfile = z.object({
  id: z.string(),
  telegramId: z.string(),
  name: z.string().optional(),
  username: z.string().optional(),
  photoUrl: z.string().optional(),
  plan: z.enum(['FREE', 'VIP']),
  vipExpiresAt: z.string().optional(),
  points: z.number().int().min(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});
