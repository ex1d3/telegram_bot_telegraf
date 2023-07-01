import { AuthorizedUser } from "../entity/authorizedUser.entity";
import { NonAuthorizedUser } from "../entity/nonAuthorizedUser.entity";
import { AuthorizedUserService } from "../services/authorizedUser.service";
import { NonAuthorizedUserService } from "../services/nonAuthorizedUser.service";
import { TelegramInvoicePayload } from "../types/telegramInvoicePayload.type";
import { AppDataSource } from "./data-source";
import { Repository } from "typeorm";
import { UserTools } from "./user.tools";
import { Key } from "../entity/key.entity";

export class PaymentsTools {
  private readonly authorizedUserService: AuthorizedUserService = new AuthorizedUserService();
  private readonly nonAuthorizedUserService: NonAuthorizedUserService = new NonAuthorizedUserService();
  private readonly authorziedUserRepository: Repository<AuthorizedUser> = AppDataSource.getRepository(AuthorizedUser);
  private readonly nonAuthorizedUserReposoitory: Repository<NonAuthorizedUser> = AppDataSource.getRepository(NonAuthorizedUser);
  private readonly userTools: UserTools = new UserTools();

  getInvoice(tg: number, title: string, description: string, price: number, currency: string, code: string) {
    return {
      chat_id: tg,
      title: title,
      description: description,
      payload: code,
      provider_token: '381764678:TEST:57161',
      start_parameter: 'get_access',
      currency: currency,
      prices: [{ label: title, amount: 100 * price }],
    }
  }

  /*
  значение кодов при окончании метода:
    0 - перенаправить в /start;
    1 - перенаприветь в управление ключом из codeParams;
  */
  async resolveTelegramPayload(rawPayload: string): Promise<any> {
    const payload: TelegramInvoicePayload = {
      tg: rawPayload.split('-')[0],
      userType:  rawPayload.split('-')[1] === 'true',
      code:  rawPayload.split('-')[2],
      codeParams: rawPayload.split('-')[3],
    } 

    if (payload.code === 'balance') {
      await this.userTools.balanceUp(payload.tg, payload.userType, parseInt(payload.codeParams));

      return 0;
    } else if (payload.code === 'purchaseKey') {
      return await this.userTools.createKeyAndPushToUser(payload.tg, payload.userType, parseInt(payload.codeParams.split(':')[0]), parseInt(payload.codeParams.split(':')[1]));
    } else if (payload.code === 'extend') {

    }
  }
}