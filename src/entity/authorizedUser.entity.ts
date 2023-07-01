import { AfterLoad, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Key } from "./key.entity";

@Entity({ name: 'authorized_users' })
export class AuthorizedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  tg: string;

  @Column({ nullable: true })
  uid: string;

  @Column({ nullable: false })
  balance: number;

  @OneToMany(() => Key, key => key.user)
  @JoinTable()
  keys: Key[];

  @Column({ nullable: false })
  datetime: Date;
} 