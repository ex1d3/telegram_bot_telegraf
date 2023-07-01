import { NonAuthorizedUser } from '../entity/nonAuthorizedUser.entity';
import { Repository } from 'typeorm';
import { AppDataSource } from '../tools/data-source';

export class NonAuthorizedUserService {
  private nonAuthorizedUserRepository: Repository<NonAuthorizedUser> = AppDataSource.getRepository(NonAuthorizedUser);

  async findAll(): Promise<NonAuthorizedUser[]> {
    return this.nonAuthorizedUserRepository.find();
  }

  async findByTg(tg: string): Promise<NonAuthorizedUser> {
    return this.nonAuthorizedUserRepository.findOne( { where: {tg: tg} } );
  }
}
