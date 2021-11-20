import { FastifyInstance } from 'fastify'

export default async function (fastify: FastifyInstance) {
  fastify.register(require('./acquire').default)
  fastify.register(require('./confirm').default)
  fastify.register(require('./create').default)
  fastify.register(require('./getOne').default)
}