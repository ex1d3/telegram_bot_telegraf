import { AppDataSource } from '../tools/data-source';
import { Code } from '../entity/code.entity';
import { Repository } from 'typeorm';

export class CodeService {
  private codeRepository: Repository<Code> = AppDataSource.getRepository(Code);

  async findAll(): Promise<Code[]> {
    return this.codeRepository.find();
  }

  async findCodeByCode(code: number): Promise<Code> {
    return this.codeRepository.findOneBy({ code });
  }

  async findCodeByEmail(email: string): Promise<Code> {
    return this.codeRepository.findOneBy({ email });
  }
}
