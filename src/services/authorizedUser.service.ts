import { AuthorizedUser } from '../entity/authorizedUser.entity';
import { Repository } from 'typeorm';
import { AppDataSource } from '../tools/data-source';

export class AuthorizedUserService {
  private authorizedUserRepository: Repository<AuthorizedUser> = AppDataSource.getRepository(AuthorizedUser);

  async findAll(): Promise<AuthorizedUser[]> {
    return this.authorizedUserRepository.find({ relations: ['keys', 'keys.tariff'] });
  }

  async findByEmail(email: string): Promise<AuthorizedUser> {
    return this.authorizedUserRepository.findOne( {relations: ['keys', 'keys.tariff'], where: {email: email}} );
  }

  async findByUid(uid: string): Promise<AuthorizedUser> {
    return this.authorizedUserRepository.findOne( {relations: ['keys', 'keys.tariff'], where: {uid: uid}} );
  }

  async findByTg(tg: string): Promise<AuthorizedUser> {
    return this.authorizedUserRepository.findOne( { relations: ['keys', 'keys.tariff'], where: {tg: tg} } );
  }


  // async findByLastIp(lastIp: string): Promise<AuthorizedUser> {
  //   return this.AuthorizedUserRepository.findOne( {relations: ['keys', 'keys.tariff'], where: {lastIp: lastIp}} );
  // }

  // async existsByEmail(email: string): Promise<boolean> {
  //   return (await this.AuthorizedUserRepository.findOneBy({ email })) !== null;
  // }

  // async existsByUid(uid: string): Promise<boolean> {
  //   return (await this.AuthorizedUserRepository.findOneBy({ uid })) !== null;
  // }

  // async existsByTg(tg: string): Promise<boolean> {
  //   return (await this.AuthorizedUserRepository.findOneBy({ tg })) !== null;
  // }

  // async existsByLast_Ip(lastIp: string): Promise<boolean> {
  //   return (await this.AuthorizedUserRepository.findOneBy({ lastIp })) !== null;
  // }

  // async setKey(tg: string, key: Key) {
  //   const AuthorizedUser = await this.findByTg(tg);

  //   if (AuthorizedUser) {
  //     AuthorizedUser.keys.push(key)
  //     console.log(AuthorizedUser)
  //     this.AuthorizedUserRepository.save(AuthorizedUser)
  //   }
  // }

  // async setAuthMethod(tg: string, authMethod: string) {
  //   const AuthorizedUser = await this.findByTg(tg);

  //   if (AuthorizedUser) {
  //     AuthorizedUser.authMethod = authMethod;
  //     this.AuthorizedUserRepository.save(AuthorizedUser);

  //     return true;
  //   }
  // }

  // async setUid(tg: string, uid: string) {
  //   const AuthorizedUser = await this.findByUid(uid);

  //   AuthorizedUser.tg = tg;
  //   this.AuthorizedUserRepository.save(AuthorizedUser);
  // }

  // async setTg(tg: string, AuthorizedUser: AuthorizedUser) {
  //   AuthorizedUser.tg = tg;

  //   this.AuthorizedUserRepository.save(AuthorizedUser);
  // }

  // async createAuthorizedUser(codeEntity: Code) {
  //   const AuthorizedUser = new AuthorizedUser();

  //   AuthorizedUser.tg = codeEntity.tg;
  //   AuthorizedUser.email = codeEntity.email;
  //   AuthorizedUser.balance = 0;

  //   this.AuthorizedUserRepository.save(AuthorizedUser);
  // }
}
