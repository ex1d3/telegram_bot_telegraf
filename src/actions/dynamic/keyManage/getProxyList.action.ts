import { Context, Telegraf } from "telegraf";
import { Action } from "../../action.class";
import { KeyService } from "../../../services/key.service";
import { DynamicMessages } from "../../../messages/dynamic.messages";
import { DynamicKeyboards } from "../../../keyboards/dynamic.keyboards";

export class GetProxyListAction extends Action {
  private readonly keyService: KeyService = new KeyService();
  private readonly dynamicMessages: DynamicMessages = new DynamicMessages();
  private readonly dynamicKeyboards: DynamicKeyboards = new DynamicKeyboards();

  constructor(bot: Telegraf<Context>) {
    super(bot);
  }
  
  handle(): void {
    this.bot.action(/^keyManage-[0-9]+-getProxyList/, async (ctx) => {
      const callbackQuery = ctx.match[0].split('-');
      const key = await this.keyService.findById(parseInt(callbackQuery[1]));
      ctx.editMessageText(
        this.dynamicMessages.getProxyListMessage(key),
        this.dynamicKeyboards.backToKeySettingsKeyboard(key),
      );
    })
  }
}