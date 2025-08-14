import Fastify from 'fastify';
import cors from '@fastify/cors';
import { contractsVersion, contractHash } from '@telegramwebminiapp/types';

const fastify = Fastify({ logger: true });

fastify.get('/v1/health', async () => ({ ok: true }));

fastify.get('/v1/contracts', async () => ({
  version: contractsVersion,
  hash: contractHash(),
}));
await fastify.register(cors, {
  origin: ['http://localhost:5173'], // FE dev
  credentials: true
});
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('API listening on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
