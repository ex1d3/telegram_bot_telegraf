import { Telegraf, Context } from "telegraf";
import { Action } from "../../action.class";
import { KeyService } from "../../../services/key.service";
import { DynamicKeyboards } from "../../../keyboards/dynamic.keyboards";
import { DynamicMessages } from "../../../messages/dynamic.messages";

export class PickDaysToExtendSubscribeAction extends Action {
  private readonly dynamicKeyboards: DynamicKeyboards = new DynamicKeyboards();
  private readonly dynamicMessages: DynamicMessages = new DynamicMessages();
  private readonly keyService: KeyService = new KeyService();
  
  constructor(bot: Telegraf<Context>) {
    super(bot);
  }

  handle(): void {
    this.bot.action(/^keyManage-[0-9]+-extendSubscribe$/, async(ctx) => {
      const keyId = parseInt(ctx.match[0].split('-')[1]);
      const key = await this.keyService.findById(keyId);

      ctx.editMessageText(
        this.dynamicMessages.pickDaysToExtendSubscribeMessage(key),
        this.dynamicKeyboards.pickDaysToExtendSubscribeKeyboard(key),
      );
    })
  }
}