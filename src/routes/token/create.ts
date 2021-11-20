import { FastifyInstance } from 'fastify'
import { NFTService } from '../../domain/NFTService'
import { container } from '../../inversify.config'

export default async function (fastify: FastifyInstance) {
  fastify.route<{ Body: { modelId: string } }>({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          modelId: { type: 'string' }
        },
        required: ['modelId']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            uuid: { type: 'string' }
          }
        }
      }
    },
    async handler (req, reply) {
      const nftService = container.get(NFTService)
      const uuid = await nftService.generate({ modelId: req.body.modelId })
      return reply.send({ uuid })
    }
  })
}