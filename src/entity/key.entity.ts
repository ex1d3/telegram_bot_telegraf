import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { AuthorizedUser } from "./authorizedUser.entity";
import { Tariff } from "./tariff.entity";

@Entity({ name: 'keys' })
export class Key {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => AuthorizedUser, AuthorizedUser => AuthorizedUser.keys)
  @JoinColumn()
  user: AuthorizedUser | string;

  @Column({ nullable: false })
  uid: string;

  @Column({ nullable: false })
  from: Date;

  @Column({ nullable: false })
  to: Date;

  /*
  0 - авторизация по айпи;
  1 - авторизация по логину и паролю;
  */
  @Column({ nullable: true })
  authMethod: number;

  @Column({ nullable: false, type: 'text', array: true })
  proxy_list: string[];

  // (кол во дней)
  @Column({ nullable: false })
  duration: number;

  @ManyToOne(() => Tariff)
  @JoinColumn()
  tariff: Tariff;
}