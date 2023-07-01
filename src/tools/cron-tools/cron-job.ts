import { CronJob } from "cron";
import { AuthorizedUser } from "../../entity/authorizedUser.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";

export class _cronJob {
  AuthorizedUsers_old: AuthorizedUser[];
  AuthorizedUsers_new: AuthorizedUser[];

  job = new CronJob('0 * * * * *', 
    async function() {
      const AuthorizedUserRepository: Repository<AuthorizedUser> = AppDataSource.getRepository(AuthorizedUser);
      const date = new Date().getTime();
      let AuthorizedUsers = await AuthorizedUserRepository.find({ relations: ['keys', 'keys.tariff'] });
        
      AuthorizedUsers = AuthorizedUsers.map((AuthorizedUser) => {
        if (AuthorizedUser.keys) {
          if (AuthorizedUser.keys.length > 0) {
            AuthorizedUser.keys = AuthorizedUser.keys.filter(key => key.to.getTime() > date);
          }
        }

        return AuthorizedUser;
      })

      AuthorizedUserRepository.save(AuthorizedUsers);
    }
  )
}