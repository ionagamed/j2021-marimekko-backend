import { FastifyRequest } from 'fastify'

export enum UserRole {
  user = 'user',
  seller = 'seller'
}

export interface User {
  id: string
  role: UserRole
}

export function authenticateRequest (request: FastifyRequest): User {
  const header = request.headers['authorization']
  const data = JSON.parse(header)
  return data
}