import { Telegraf } from "telegraf";
import { On } from "./on.class";
import { CodeTools } from "../tools/code.tools";
import { StaticMessages } from "../messages/static.messages";
import { StaticKeyboards } from "../keyboards/static.keyboards";
import { UserTools } from "../tools/user.tools";
import { DynamicMessages } from "../messages/dynamic.messages";

export class TextOn extends On {
  private readonly codeTools = new CodeTools();
  private readonly UserTools = new UserTools();
  private readonly staticMessages = new StaticMessages();
  private readonly dynamicMessages = new DynamicMessages();
  private readonly staticKeyboards = new StaticKeyboards();

  constructor(bot: Telegraf) {
    super(bot);
  }

  handle() {
    this.bot.on('text', async (ctx) => {
      const message = ctx.message.text;

      if (message.split('@').length === 2) {
        const code = this.codeTools.sendCode(message, ctx.from.id.toString());
        this.codeTools.setCode(ctx.from.id.toString(), message, code);

        ctx.reply(
          this.staticMessages.enterCodeMessage,
          this.staticKeyboards.enterEmailKeyboard,
        );
        
      }

      if (message.length === 6) {
        if (await this.UserTools.regByCode(ctx.from.id.toString(), parseInt(message))) {
          await new Promise((r) => setTimeout(r, 300));
          ctx.reply(
            await this.dynamicMessages.startMessage(ctx.from.id.toString()),
            this.staticKeyboards.startKeyboard
          )
        }
      }
    });
  }
}