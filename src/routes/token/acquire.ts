import { FastifyInstance } from 'fastify'
import { NFTAcquireStatus, NFTService } from '../../domain/NFTService'
import { container } from '../../inversify.config'
import { authenticateRequest } from '../../mockAuth'

export default async function (fastify: FastifyInstance) {
  fastify.route<{ Params: { uuid: string } }>({
    method: 'POST',
    url: '/:uuid/acquire',
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: Object.values(NFTAcquireStatus)
            }
          }
        }
      }
    },
    async handler (req, reply) {
      const nftService = container.get(NFTService)
      const user = authenticateRequest(req)
      const result = await nftService.acquire(user, req.params.uuid)
      return reply.send(result)
    }
  })
}