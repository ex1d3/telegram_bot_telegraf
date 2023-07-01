import { Telegraf } from "telegraf";
import { Action } from "../action.class";
import { IConfigService } from "../../config/config.interface";
import { AuthorizedUserService } from "../../services/authorizedUser.service";

export class GetProxyListAction extends Action {
  private secret_key: string;
  private readonly AuthorizedUserService: AuthorizedUserService = new AuthorizedUserService();
  
  constructor(bot: Telegraf, private readonly configService: IConfigService) {
    super(bot);
    this.secret_key = configService.get('SECRET_KEY');
  }
  
  handle(): void {
    this.bot.action('getProxyList', async (ctx) => {
    })
  }
}