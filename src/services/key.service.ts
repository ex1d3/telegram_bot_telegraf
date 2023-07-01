import { Repository } from 'typeorm';
import { Tariff } from '../entity/tariff.entity';
import { AuthorizedUser } from '../entity/authorizedUser.entity';
import { Key } from '../entity/key.entity';
import { AppDataSource } from '../tools/data-source';

export class KeyService {
  private keyRepository: Repository<Key> = AppDataSource.getRepository(Key);

  async findAll(): Promise<Key[]> {
    return this.keyRepository.find({ relations: ['tariff', 'user'] });
  }

  async findByTg(tg: string): Promise<Key> {
    return await this.keyRepository.findOne({
      relations: ['tariff', 'user'],
      where: {
        'user': {
          tg: tg
        }
      }
    })
  }

  async findById(id: number): Promise<Key> {
    return await this.keyRepository.findOne({
      relations: ['tariff', 'user'],
      where: {
        id: id
      }
    })
  }

  async createKey(authorizedUserEntity: AuthorizedUser, days: number, tariff: Tariff): Promise<Key> {
    let from = new Date();
    let to = new Date();
    const keyEntity = new Key()
    
    to.setDate(to.getDate() + days);

    keyEntity.from = from
    keyEntity.to = to
    keyEntity.tariff = tariff
    keyEntity.user = authorizedUserEntity

    this.keyRepository.save(keyEntity)

    return keyEntity
  }

}