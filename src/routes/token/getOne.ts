import { FastifyInstance } from 'fastify'
import { NFTService } from '../../domain/NFTService'
import { container } from '../../inversify.config'

export default async function (fastify: FastifyInstance) {
  fastify.route<{ Params: { uuid: string } }>({
    method: 'GET',
    url: '/:uuid',
    schema: {
      params: {
        type: 'object',
        properties: {
          uuid: { type: 'string' }
        }
      }
    },
    async handler (req, reply) {
      const nftService = container.get(NFTService)
      const data = await nftService.getData(req.params.uuid)
      return reply.send(data)
    }
  })
}