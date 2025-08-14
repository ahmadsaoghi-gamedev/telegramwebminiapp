import { z } from 'zod';

export const zEpisodeSourcesResponse = z.object({
  items: z.array(z.object({
    id: z.string(),
    url: z.string(),
    provider: z.enum(['HLS', 'MP4', 'EMBED', 'CUSTOM']),
    quality: z.string().optional(),
    lang: z.string().optional(),
    priority: z.number().int().min(0),
    isActive: z.boolean(),
  })),
});
