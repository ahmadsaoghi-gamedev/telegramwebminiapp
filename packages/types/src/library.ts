import { z } from "zod";
import { zId, zISODate, zPaginated } from "./common";

export const zFavorite = z.object({
  id: zId,
  userId: zId,
  episodeId: zId,
  createdAt: zISODate
});
export type Favorite = z.infer<typeof zFavorite>;

export const zHistoryItem = z.object({
  id: zId,
  userId: zId,
  episodeId: zId,
  positionSec: z.number().int().nonnegative(),
  completed: z.boolean().default(false),
  createdAt: zISODate
});
export type HistoryItem = z.infer<typeof zHistoryItem>;

export const zFavoritesResponse = zPaginated(zFavorite);
export const zHistoryResponse = zPaginated(zHistoryItem);

export const zSaveFavoriteRequest = z.object({ episodeId: zId });
export const zLogHistoryRequest = z.object({
  episodeId: zId,
  positionSec: z.number().int().nonnegative(),
  completed: z.boolean().optional()
});
