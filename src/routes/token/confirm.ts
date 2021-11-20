import { FastifyInstance } from 'fastify'
import { NFTConfirmStatus, NFTService } from '../../domain/NFTService'
import { container } from '../../inversify.config'
import { authenticateRequest } from '../../mockAuth'

export default async function (fastify: FastifyInstance) {
  fastify.route<{ Params: { uuid: string }, Body: { requesterId: string } }>({
    method: 'POST',
    url: '/:uuid/confirm',
    schema: {
      body: {
        type: 'object',
        properties: {
          requesterId: { type: 'string' }
        },
        required: ['requesterId']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: Object.values(NFTConfirmStatus)
            }
          }
        }
      }
    },
    async handler (req, reply) {
      const nftService = container.get(NFTService)
      const user = authenticateRequest(req)
      const result = await nftService.confirm(user, req.params.uuid, req.body.requesterId)
      return reply.send(result)
    }
  })
}