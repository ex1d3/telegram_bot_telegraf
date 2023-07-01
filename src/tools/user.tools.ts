import { Repository } from "typeorm";
import { AuthorizedUser } from "../entity/authorizedUser.entity";
import { NonAuthorizedUser } from "../entity/nonAuthorizedUser.entity";
import { Code } from "../entity/code.entity";
import { AppDataSource } from "./data-source";
import { CodeService } from "../services/code.service";
import { CodeTools } from "./code.tools";
import { AuthorizedUserService } from "../services/authorizedUser.service";
import { NonAuthorizedUserService } from "../services/nonAuthorizedUser.service";
import { Key } from "../entity/key.entity";
import { KeyTools } from "./key.tools";
import { Tariff } from "../entity/tariff.entity";
import { TariffService } from "../services/tariff.service";

export class UserTools {
  private readonly authorizedUserRepository: Repository<AuthorizedUser> = AppDataSource.getRepository(AuthorizedUser);
  private readonly nonAuthorizedUserRepository: Repository<NonAuthorizedUser> = AppDataSource.getRepository(NonAuthorizedUser);
  private readonly keyRepository: Repository<Key> = AppDataSource.getRepository(Key);
  private readonly codeService: CodeService = new CodeService();
  private readonly authorizedUserService: AuthorizedUserService = new AuthorizedUserService();
  private readonly nonAuthorizedUserService: NonAuthorizedUserService = new NonAuthorizedUserService();
  private readonly tariffService: TariffService = new TariffService();
  private readonly codeTools: CodeTools = new CodeTools();
  private readonly keyTools: KeyTools = new KeyTools();

  // type: true - create authorized user; false - create non authorized user
  async createUser(type: boolean, tg: string, code: Code): Promise<void> {
    if (type) {
      let authorizedUser = new AuthorizedUser();
      const nonAuthorizedUser = await this.nonAuthorizedUserService.findByTg(tg);
      const datetime = new Date();
    
      authorizedUser.tg = nonAuthorizedUser.tg;
      authorizedUser.email = code.email;
      authorizedUser.balance = nonAuthorizedUser.balance;
      authorizedUser.datetime = datetime;

      this.authorizedUserRepository.save(authorizedUser);

      await new Promise((r) => setTimeout(r, 300));

      authorizedUser = await this.authorizedUserService.findByTg(authorizedUser.tg);

      nonAuthorizedUser.keys.forEach(TKey => {
        const key = new Key();
				let tKey = JSON.parse(TKey)
				let dif: number;
				
				tKey.to = new Date(tKey.to);
				tKey.from = new Date(tKey.from);
        dif = (tKey.to - tKey.from) / (1000 * 60) / 1440;

				let from = new Date();
				let to = new Date();

				to.setDate(to.getDate() + dif);
				
				key.from = from;
				key.to = to;
				key.tariff = tKey.tariff;
				key.user = authorizedUser;
        key.proxy_list = tKey.tariff.proxy_list
        key.duration = dif;
        key.uid = tKey.uid

        this.keyRepository.save(key);

        authorizedUser.keys.push(key);
      });
    
      this.authorizedUserRepository.save(authorizedUser);
      await new Promise((r) => setTimeout(r, 500));
    } else {
      const nonAuthorizedUser = new NonAuthorizedUser();
      const datetime = new Date();

      nonAuthorizedUser.tg = tg;
      nonAuthorizedUser.balance = 0;
      nonAuthorizedUser.datetime = datetime;
      nonAuthorizedUser.keys = [];

      this.nonAuthorizedUserRepository.save(nonAuthorizedUser);
    }
  }

  setTg(tg: string, AuthorizedUser: AuthorizedUser): void {
    AuthorizedUser.tg = tg;
  
   this.authorizedUserRepository.save(AuthorizedUser);
  }

  async regByCode(tg: string, codeEntered: number): Promise<boolean> {
    const code = await this.codeService.findCodeByCode(codeEntered);
    const authorizedUser = await this.authorizedUserService.findByTg(tg);

    if (code) {
      if (!authorizedUser) {
        this.createUser(true, tg, code);
        this.codeTools.deleteCode(code);

        return true;
      } else {
        if (authorizedUser.tg === null) {
          this.setTg(tg, authorizedUser);
          this.codeTools.deleteCode(code);

          return true
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  async balanceUp(tg: string, userType: boolean, amount: number): Promise<void> {
    if (userType === true) {
      const user = await this.authorizedUserService.findByTg(tg);
      user.balance += amount;
      this.authorizedUserRepository.save(user);
    } else {
      const user = await this.nonAuthorizedUserService.findByTg(tg);
      user.balance += amount;
      this.nonAuthorizedUserRepository.save(user);
    }
  }

  async createKeyAndPushToUser (tg: string, isAuthorized: boolean, tariffId: number, duration: number): Promise<Key | number> {
    const tariff: Tariff = await this.tariffService.findById(tariffId);
    if (isAuthorized) {
      const user = await this.authorizedUserService.findByTg(tg);
      const key = this.keyTools.createAuthorizedKey(user, tariff, duration);
      user.keys.push(key);
      this.authorizedUserRepository.save(user);

      return key;
    } else {
      const user = await this.nonAuthorizedUserService.findByTg(tg);
      const key = JSON.stringify(this.keyTools.createTempKey(tg, tariff, duration));
      user.keys.push(key);
      this.nonAuthorizedUserRepository.save(user);

      return 0;
    }
  }
}