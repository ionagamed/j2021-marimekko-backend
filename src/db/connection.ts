import { createConnection } from 'typeorm'
import { config } from '../config'
import { IssuedToken } from './IssuedToken'

export async function connect () {
  // TODO: poebat
  return createConnection({
    ...config.db as any,
    synchronize: true,
    entities: [IssuedToken]
  })
}