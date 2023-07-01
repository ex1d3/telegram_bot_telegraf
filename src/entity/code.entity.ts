import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'codes' })
export class Code {
  @PrimaryGeneratedColumn()
  id: number
  
  @Column()
  code: number;

  @Column()
  email: string;

  @Column()
  tg: string;
}