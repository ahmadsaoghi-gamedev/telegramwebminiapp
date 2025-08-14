import { z } from 'zod';

export const zTitleCard = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['MOVIE', 'SERIES']),
  posterUrl: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const zTitleListRequest = z.object({
  limit: z.number().int().min(1).max(100),
  cursor: z.string().optional(),
  filter: z.enum(['all', 'popular', 'new']).optional(),
});

export const zTitleListResponse = z.object({
  items: z.array(zTitleCard),
  nextCursor: z.string().optional(),
});

export const zTitleDetail = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['MOVIE', 'SERIES']),
  overview: z.string().optional(),
  backdropUrl: z.string().optional(),
  episodes: z.array(z.object({
    id: z.string(),
    episodeNumber: z.number().int().min(1),
    name: z.string().optional(),
  })).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
