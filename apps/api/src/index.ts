import "dotenv/config";           // baca .env (DATABASE_URL)
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { contractsVersion, zTitleListRequest, zTitleListResponse, TitleCard, zTitleDetail, TitleDetail } from '@telegramwebminiapp/types';
import { prisma } from "./db/prisma";

const app = Fastify({ logger: true });

app.get('/v1/health', async () => ({ ok: true }));

app.get('/v1/contracts', async () => ({
  version: contractsVersion,
  hash: "no-hash-calculated-on-server", // Placeholder, as hash is no longer calculated
}));

// Debug nyata: hitung dari DB via Prisma
app.get("/v1/debug/counts", async () => {
  const [titles, episodes, sources, users] = await Promise.all([
    prisma.title.count(),
    prisma.episode.count(),
    prisma.source.count(),
    prisma.user.count(),
  ]);
  return { titles, episodes, sources, users };
});

// GET /v1/titles - List published titles with pagination
app.get('/v1/titles', async (request, reply) => {
  try {
    // Parse and validate query params
    const query = request.query as Record<string, string | undefined>;
    const queryResult = zTitleListRequest.safeParse({
      limit: query.limit ? Number(query.limit) : undefined,
      cursor: query.cursor,
      filter: query.filter
    });

    if (!queryResult.success) {
      return reply.status(400).send({ error: 'Invalid query parameters' });
    }

    const { limit, cursor, filter } = queryResult.data;

    // Build where clause
    const where = {
      status: 'PUBLISHED' as const,
      ...(cursor && { createdAt: { lt: cursor } })
    };

    // Fetch titles from database
    const titles = await prisma.title.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // Fetch one extra to check if there's more
      select: {
        id: true,
        title: true,
        type: true,
        posterUrl: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Check if there are more items
    const hasMore = titles.length > limit;
    const items = hasMore ? titles.slice(0, -1) : titles;

    // Map to TitleCard format
    const titleCards: TitleCard[] = items.map(t => ({
      id: t.id,
      title: t.title,
      type: t.type as "MOVIE" | "SERIES",
      posterUrl: t.posterUrl || undefined,
      status: t.status as "DRAFT" | "PUBLISHED",
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString()
    }));

    // Build response
    const response = {
      items: titleCards,
      nextCursor: hasMore ? items[items.length - 1].createdAt.toISOString() : undefined
    };

    // Validate response before sending
    const validatedResponse = zTitleListResponse.parse(response);
    return reply.send(validatedResponse);
  } catch (error) {
    app.log.error(error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// GET /v1/titles/:id - Get title detail by ID
app.get('/v1/titles/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };

    // Fetch title with episodes from database
    const title = await prisma.title.findUnique({
      where: { id },
      include: {
        episodes: {
          orderBy: { episodeNumber: 'asc' },
          select: {
            id: true,
            episodeNumber: true,
            name: true,
            thumbnailUrl: true
          }
        },
        sources: {
          where: { episodeId: null }, // Only sources directly on title (for movies)
          select: { id: true }
        }
      }
    });

    if (!title) {
      return reply.status(404).send({ error: 'Title not found' });
    }

    // Build response based on type
    let response: TitleDetail;
    
    if (title.type === 'MOVIE') {
      // For movies, check if there are sources available
      response = {
        id: title.id,
        title: title.title,
        type: title.type as "MOVIE" | "SERIES",
        overview: title.overview || undefined,
        posterUrl: title.posterUrl || undefined,
        backdropUrl: title.backdropUrl || undefined,
        hasFullMovie: title.sources.length > 0,
        createdAt: title.createdAt.toISOString(),
        updatedAt: title.updatedAt.toISOString()
      };
    } else {
      // For series, include episodes
      response = {
        id: title.id,
        title: title.title,
        type: title.type as "MOVIE" | "SERIES",
        overview: title.overview || undefined,
        posterUrl: title.posterUrl || undefined,
        backdropUrl: title.backdropUrl || undefined,
        episodes: title.episodes.map(ep => ({
          id: ep.id,
          episodeNumber: ep.episodeNumber,
          name: ep.name || undefined,
          thumbnailUrl: ep.thumbnailUrl || undefined
        })),
        createdAt: title.createdAt.toISOString(),
        updatedAt: title.updatedAt.toISOString()
      };
    }

    // Validate response before sending
    const validatedResponse = zTitleDetail.parse(response);
    return reply.send(validatedResponse);
  } catch (error) {
    app.log.error(error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

await app.register(cors, {
  origin: ['http://localhost:5173'], // FE dev
  credentials: true
});

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

app.listen({ port, host }).then(() => {
  console.log(`API listening on http://localhost:${port}`);
});
