import { Telegraf } from "telegraf";
import { Action } from "../action.class";
import { StaticMessages } from "../../messages/static.messages";
import { AuthorizedUserService } from "../../services/authorizedUser.service";
import { NonAuthorizedUserService } from "../../services/nonAuthorizedUser.service";
import { StaticKeyboards } from "../../keyboards/static.keyboards";
import { DynamicKeyboards } from "../../keyboards/dynamic.keyboards";

export class ManageKeysAction extends Action {
  private readonly staticMessages: StaticMessages = new StaticMessages();
  private readonly staticKeyboards: StaticKeyboards = new StaticKeyboards();
  private readonly dynamicKeyboards: DynamicKeyboards = new DynamicKeyboards();
  private readonly authorizedUserService: AuthorizedUserService = new AuthorizedUserService();
  private readonly nonAuthorizedUserService: NonAuthorizedUserService = new NonAuthorizedUserService();
  
  constructor(bot: Telegraf) {
    super(bot);
  }
  
  handle(): void {
    this.bot.action('manageKeys', async (ctx) => {
      const authorizedUser = await this.authorizedUserService.findByTg(ctx.from.id.toString());
      
      if (authorizedUser) {
        if (authorizedUser.keys.length > 0) {
          ctx.editMessageText(
            this.staticMessages.manageKeysMessage,
            await this.dynamicKeyboards.manageKeysKeyboard(ctx.from.id.toString())
          );
        } else {
          ctx.editMessageText(
            this.staticMessages.noKeysMessage,
            this.staticKeyboards.noKeysKeyboard
          );
        }
      } else {
        const notAuthorizedUser = await this.nonAuthorizedUserService.findByTg(ctx.from.id.toString());

        if (notAuthorizedUser.keys.length > 0) {
          ctx.editMessageText(
            this.staticMessages.manageKeysMessage,
            await this.dynamicKeyboards.manageKeysKeyboard(ctx.from.id.toString())
          );
        } else {
          ctx.editMessageText(
            this.staticMessages.noKeysMessage,
            this.staticKeyboards.noKeysKeyboard
          );
        }
      }
    });
  }
}