import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class IssuedToken {
  @PrimaryColumn()
  uuid: string

  @Column()
  modelId: string

  @Column({ nullable: true })
  ownerId?: string

  @Column({ type: 'simple-json' })
  previousOwners: { ownerId: string, acquiredAt: number }[]
}