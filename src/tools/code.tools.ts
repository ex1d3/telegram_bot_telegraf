import { Code } from "../entity/code.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "./data-source";

export class CodeTools {
  private readonly codeRepository: Repository<Code> = AppDataSource.getRepository(Code);
  
  sendCode(email: string, tg: string): number {
    let firstPart: string = ((Math.random() * 46656) | 0).toString();
    let secondPart: string = ((Math.random() * 46656) | 0).toString();
    firstPart = ('000' + firstPart.toString()).slice(-3).toString();
    secondPart = ('000' + secondPart.toString()).slice(-3);
    const code = firstPart + secondPart;
  
    console.log(`CODE ${code} SENT TO ${email} FOR AuthorizedUser ${tg}`)
  
    return parseInt(code);
  }

  setCode(tg: string, email: string, code: number): void {
    const newCode = new Code();

    newCode.tg = tg;
    newCode.email = email;
    newCode.code = code;
    this.codeRepository.save(newCode);
  }

  deleteCode(codeEntity: Code): void {
    this.codeRepository.delete(codeEntity.id)
  }
}