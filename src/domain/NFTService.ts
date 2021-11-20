import { inject, injectable } from 'inversify'
import { Connection, Repository } from 'typeorm'
import uuid4 from 'uuid4'
import { IssuedToken } from '../db/IssuedToken'
import { TOKENS } from '../inversify.tokens'
import { User, UserRole } from '../mockAuth'

interface NFTCreateData {
  modelId: string
}

interface NFTOutputData {
  uuid: string
  modelId: string
  ownerId?: string
  previousOwners: { ownerId: string, acquiredAt: number }[]
}

export enum NFTAcquireStatus {
  needsConfirmationFromOtherUser = 'needsConfirmationFromOtherUser',
  needsConfirmationFromStore = 'needsConfirmationFromStore'
}

interface NFTAcquireResult {
  status: NFTAcquireStatus
}

export enum NFTConfirmStatus {
  success = 'success'
}

interface NFTConfirmResult {
  status: NFTConfirmStatus
}

@injectable()
export class NFTService {
  constructor (
    @inject(TOKENS.dbConnection) connection: Connection
  ) {
    this.issuedTokenRepository = connection.getRepository(IssuedToken)
  }

  async generate (data: NFTCreateData): Promise<string> {
    const uuid = uuid4()

    const token = new IssuedToken()
    token.uuid = uuid
    token.modelId = data.modelId
    token.previousOwners = []
    await this.issuedTokenRepository.save(token)

    return uuid
  }

  async getData (uuid: string): Promise<NFTOutputData> {
    const token = await this.issuedTokenRepository.findOneOrFail(uuid)
    return {
      uuid: token.uuid,
      modelId: token.modelId,
      ownerId: token.ownerId,
      previousOwners: token.previousOwners
    }
  }

  async acquire (user: User, uuid: string): Promise<NFTAcquireResult> {
    const issuedToken = await this.issuedTokenRepository.findOneOrFail(uuid)
    if (issuedToken.ownerId) {
      return { status: NFTAcquireStatus.needsConfirmationFromOtherUser }
    } else {
      return { status: NFTAcquireStatus.needsConfirmationFromStore }
    }
  }

  async confirm (user: User, uuid: string, requesterId: string): Promise<NFTConfirmResult> {
    if (user.role == UserRole.seller) {
      const issuedToken = await this.issuedTokenRepository.findOneOrFail(uuid)
      if (issuedToken.ownerId) {
        throw new Error('The token already has an owner - store manager should not sell it')
      }
      issuedToken.ownerId = requesterId
      issuedToken.previousOwners.push({
        ownerId: requesterId,
        acquiredAt: Math.ceil(new Date().valueOf() / 1000)
      })
      await this.issuedTokenRepository.save(issuedToken)
    } else if (user.role == UserRole.user) {
      const issuedToken = await this.issuedTokenRepository.findOneOrFail(uuid)
      if (!issuedToken.ownerId) {
        throw new Error('The token does not have an owner - ask a store manager to sell it')
      }
      if (issuedToken.ownerId != user.id) {
        throw new Error('You are trying to sell an item that does not belong to you')
      }
      issuedToken.ownerId = requesterId
      issuedToken.previousOwners.push({
        ownerId: requesterId,
        acquiredAt: Math.ceil(new Date().valueOf() / 1000)
      })
      await this.issuedTokenRepository.save(issuedToken)
    }
    return { status: NFTConfirmStatus.success }
  }

  private issuedTokenRepository: Repository<IssuedToken>
}