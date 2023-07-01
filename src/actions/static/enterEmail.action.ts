import { Telegraf } from "telegraf";
import { Action } from "../action.class";
import { StaticMessages } from "../../messages/static.messages";
import { StaticKeyboards } from "../../keyboards/static.keyboards";

export class EnterEmailAction extends Action {
  private readonly staticMessages: StaticMessages = new StaticMessages();
  private readonly staticKeyboards: StaticKeyboards = new StaticKeyboards();
  
  constructor(bot: Telegraf) {
    super(bot);
  }

  handle(): void {
    this.bot.action('enterEmail', async (ctx) => {
      ctx.editMessageText(
        this.staticMessages.enterEmailMessage,
        this.staticKeyboards.enterEmailKeyboard
      );
    })
  }
}