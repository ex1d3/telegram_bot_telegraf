import { Context, Telegraf } from "telegraf";
import { Action } from "../../action.class";
import { KeyService } from "../../../services/key.service";
import { StaticMessages } from "../../../messages/static.messages";
import { DynamicKeyboards } from "../../../keyboards/dynamic.keyboards";

export class PickAuthMethodAction extends Action {
  private readonly keyService: KeyService = new KeyService();
  private readonly staticMessages: StaticMessages = new StaticMessages();
  private readonly dynamicKeyboards: DynamicKeyboards = new DynamicKeyboards();

  constructor(bot: Telegraf<Context>) {
    super(bot);
  }
  
  handle(): void {
    this.bot.action(/^keyManage-[0-9]+-pickAuthMethod/, async (ctx) => {
      const keyId = ctx.match[0].split('-')[1];
      const key = await this.keyService.findById(parseInt(keyId));
      
      ctx.editMessageText(
        this.staticMessages.pickAuthMethod,
        await this.dynamicKeyboards.pickAuthMethod(key),
      );
    })
  }
}