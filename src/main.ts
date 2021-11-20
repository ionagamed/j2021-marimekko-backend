import Fastify from 'fastify'
import FastifySwagger from 'fastify-swagger'
import 'reflect-metadata'
import { initializeAsyncContainerDeps } from './inversify.config'

import rootRoutesPlugin from './routes'

const fastify = Fastify({ logger: true })

fastify.register(async () => {
  await initializeAsyncContainerDeps()
})

fastify.register(FastifySwagger, {
  routePrefix: '/docs',
  exposeRoute: true
})
fastify.register(rootRoutesPlugin)

if (require.main === module) {
  fastify.listen(5050, '0.0.0.0', e => {
    if (e) {
      console.error(e)
      process.exit(-1)
    } else {
      fastify.log.info('Server running on 0.0.0.0:5050')
    }
  })
}