import { FastifyInstance } from 'fastify'

export default async function (fastify: FastifyInstance) {
  fastify.register(require('./token').default, { prefix: '/token' })
}