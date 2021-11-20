import { Container } from 'inversify'
import { connect } from './db/connection'
import { NFTService } from './domain/NFTService'
import { TOKENS } from './inversify.tokens'

export const container = new Container()
container.bind(NFTService).to(NFTService)

export async function initializeAsyncContainerDeps () {
  const dbConnection = await connect()
  container.bind(TOKENS.dbConnection).toConstantValue(dbConnection)
}