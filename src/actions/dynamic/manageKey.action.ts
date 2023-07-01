import { Telegraf } from "telegraf";
import { DynamicKeyboards } from "../../keyboards/dynamic.keyboards";
import { DynamicMessages } from "../../messages/dynamic.messages";
import { Action } from "../action.class";
import { KeyService } from "../../services/key.service";
import { StaticKeyboards } from "../../keyboards/static.keyboards";
import { StaticMessages } from "../../messages/static.messages";

export class ManageKeyAction extends Action {
  private readonly dynamicMessages: DynamicMessages = new DynamicMessages();
  private readonly staticMessages: StaticMessages = new StaticMessages();
  private readonly dynamicKeyboards: DynamicKeyboards = new DynamicKeyboards();
  private readonly staticKeyboards: StaticKeyboards = new StaticKeyboards();
  private readonly keyService: KeyService = new KeyService();

  constructor(bot: Telegraf) {
    super(bot);
  }

  handle(): void {
    this.bot.action(/^manage-[0-9]+$/, async (ctx) => {
      if (ctx.match[0].split('-')[1] !== '0') {
        const key = await this.keyService.findById(parseInt(ctx.match[0].split('-')[1]));
        ctx.editMessageText(
          this.dynamicMessages.manageKeyMessage(key),
          this.dynamicKeyboards.manageKeyKeyboard(key),
        );
      } else {
        ctx.editMessageText(
          this.staticMessages.yesNoMessage,
          this.staticKeyboards.yesNoKeyboard,
        )
      }
    })
  }
}