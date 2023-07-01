import { Telegraf } from "telegraf";
import { Action } from "../action.class";
import { TariffService } from "../../services/tariff.service";
import { DynamicMessages } from "../../messages/dynamic.messages";
import { DynamicKeyboards } from "../../keyboards/dynamic.keyboards";
import { AuthorizedUserService } from "../../services/authorizedUser.service";
import { NonAuthorizedUserService } from "../../services/nonAuthorizedUser.service";

export class PurchaseKeyAction extends Action {
  private readonly dynamicMessges: DynamicMessages = new DynamicMessages();
  private readonly dynamicKeyboards: DynamicKeyboards = new DynamicKeyboards();
  private readonly tariffService: TariffService = new TariffService();
  private readonly authorizedUserService: AuthorizedUserService = new AuthorizedUserService();
  private readonly nonAuthorizedUserService: NonAuthorizedUserService = new NonAuthorizedUserService();
  
  constructor(bot: Telegraf) {
    super(bot);
  }

  handle(): void {
    this.bot.action(/^purchase-(.+)$/, async (ctx) => {
      const tariff = await this.tariffService.findByName(ctx.match[1]);
      const authorizedUser = await this.authorizedUserService.findByTg(ctx.from.id.toString());
      if (authorizedUser) {
        ctx.editMessageText(
          this.dynamicMessges.tariffDataMessage(tariff),
          this.dynamicKeyboards.tariffPriceKeyboard(tariff, authorizedUser),
        );
      } else {
        const nonAuthorizedUser = await this.nonAuthorizedUserService.findByTg(ctx.from.id.toString());
        ctx.editMessageText(
          this.dynamicMessges.tariffDataMessage(tariff),
          this.dynamicKeyboards.tariffPriceKeyboard(tariff, nonAuthorizedUser),
        );
      }
    }) 
  }
}