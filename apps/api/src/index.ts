import "dotenv/config";           // baca .env (DATABASE_URL)
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { contractsVersion, contractHash } from '@telegramwebminiapp/types';
import { prisma } from "./db/prisma";

const app = Fastify({ logger: true });

app.get('/v1/health', async () => ({ ok: true }));

app.get('/v1/contracts', async () => ({
  version: contractsVersion,
  hash: contractHash(),
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

await app.register(cors, {
  origin: ['http://localhost:5173'], // FE dev
  credentials: true
});

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

app.listen({ port, host }).then(() => {
  console.log(`API listening on http://localhost:${port}`);
});
