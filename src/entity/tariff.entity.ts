import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tariffs' })
export class Tariff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  emoji: string;

  @Column({ nullable: false , type: 'text', array: true })
  proxy_list: string[];

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  subnet: string;

  @Column({ nullable: false })
  tcp: number;
}