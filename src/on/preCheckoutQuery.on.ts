import { Context, Telegraf } from "telegraf";
import { On } from "./on.class";

export class PreCheckoutQueryOn extends On {
  constructor(bot: Telegraf<Context>) {
    super(bot)
  }
  
  handle() {
    this.bot.on('pre_checkout_query', (ctx) => {
      ctx.answerPreCheckoutQuery(true);
    })
  }
}