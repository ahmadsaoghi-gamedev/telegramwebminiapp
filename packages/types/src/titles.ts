import { z } from "zod";
import { zPaginated, zISODate, zId } from "./common";

export const zTitleType = z.enum(["MOVIE", "SERIES"]);
export const zPubStatus = z.enum(["DRAFT", "PUBLISHED"]);

export const zTitleCard = z.object({
  id: zId,
  title: z.string(),
  type: zTitleType,
  posterUrl: z.string().url().optional(),
  status: zPubStatus,
  createdAt: zISODate,
  updatedAt: zISODate
});
export type TitleCard = z.infer<typeof zTitleCard>;

export const zTitleListRequest = z.object({
  limit: z.number().int().min(1).max(50).default(12),
  cursor: z.string().optional(),
  filter: z.enum(["all", "popular", "new"]).default("all")
});
export type TitleListRequest = z.infer<typeof zTitleListRequest>;

export const zTitleListResponse = zPaginated(zTitleCard);
export type TitleListResponse = z.infer<typeof zTitleListResponse>;

export const zEpisodeSummary = z.object({
  id: zId,
  episodeNumber: z.number().int().min(1),
  name: z.string().optional(),
  thumbnailUrl: z.string().url().optional()
});

export const zTitleDetail = z.object({
  id: zId,
  title: z.string(),
  type: zTitleType,
  overview: z.string().optional(),
  posterUrl: z.string().url().optional(),
  backdropUrl: z.string().url().optional(),
  hasFullMovie: z.boolean().optional(), // Only for MOVIE type
  episodes: z.array(zEpisodeSummary).optional(), // Only for SERIES type
  createdAt: zISODate,
  updatedAt: zISODate
});
export type TitleDetail = z.infer<typeof zTitleDetail>;
