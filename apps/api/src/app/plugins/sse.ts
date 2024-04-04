import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { FastifySSEPlugin } from 'fastify-sse-v2';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(FastifySSEPlugin);
});
