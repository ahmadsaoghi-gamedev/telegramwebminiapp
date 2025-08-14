import { z } from "zod";
import { zId } from "./common";

export const zProvider = z.enum(["HLS", "MP4", "EMBED", "CUSTOM"]);

export const zEpisodeSource = z.object({
  id: zId,
  url: z.string(),
  provider: zProvider,
  quality: z.string().optional(), // '360','720','1080'
  lang: z.string().optional(),    // 'ID','EN'
  priority: z.number().int().default(1),
  isActive: z.boolean().default(true),
  subtitles: z
    .array(z.object({ lang: z.string(), url: z.string() }))
    .optional()
});

export const zEpisodeSourcesResponse = z.object({
  items: z.array(zEpisodeSource)
});
export type EpisodeSourcesResponse = z.infer<typeof zEpisodeSourcesResponse>;
