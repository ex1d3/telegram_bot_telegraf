import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinTable } from "typeorm";

@Entity({ name: 'non_authorized_users' })
export class NonAuthorizedUser {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  tg: string

  @Column({ nullable: false })
  balance: number

  @Column('text', { nullable: false, array: true  })
  keys: string[]

  @Column({ nullable: false })
  datetime: Date
}