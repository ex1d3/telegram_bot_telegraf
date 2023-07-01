import { Telegraf } from "telegraf";
import { Action } from "../action.class";
import { StaticMessages } from "../../messages/static.messages";
import { DynamicKeyboards } from "../../keyboards/dynamic.keyboards";

export class ChooseTariffAction extends Action {
  private readonly staticMessages: StaticMessages = new StaticMessages();
  private readonly dynamicKeyboards: DynamicKeyboards = new DynamicKeyboards();

  constructor(bot: Telegraf) {
    super(bot);
  }
  
  handle(): void {
    this.bot.action('chooseTariff', async (ctx) => {
      ctx.editMessageText(
        this.staticMessages.chooseTariffMessage,
        await this.dynamicKeyboards.chooseTariffKeyboard()
      );
    });
  }
}