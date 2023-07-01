import { AppDataSource } from '../tools/data-source';
import { Tariff} from '../entity/tariff.entity';
import { Repository } from 'typeorm';

export class TariffService {
  private tariffRepository: Repository<Tariff> = AppDataSource.getRepository(Tariff);

  async findAll(): Promise<Tariff[]> {
    return this.tariffRepository.find();
  }

  async findByName(name: string): Promise<Tariff> {
    return this.tariffRepository.findOneBy({ name });
  }

  async findById(id: number): Promise<Tariff> {
    return this.tariffRepository.findOneBy({ id });
  }
}
