import { Context, Telegraf } from "telegraf";
import { On } from "./on.class";
import { PaymentsTools } from "../tools/payments.tools";
import { DynamicMessages } from "../messages/dynamic.messages";
import { StaticKeyboards } from "../keyboards/static.keyboards";
import { StaticMessages } from "../messages/static.messages";
import { DynamicKeyboards } from "../keyboards/dynamic.keyboards";
import { Key } from "../entity/key.entity";
import { TelegramInvoicePayload } from "../types/telegramInvoicePayload.type";

export class SuccessfulPaymentOn extends On {
  private readonly paymentsTools: PaymentsTools = new PaymentsTools();
  private readonly dynamicMessages: DynamicMessages = new DynamicMessages();
  private readonly staticMessages: StaticMessages = new StaticMessages();
  private readonly dynamicKeyboards: DynamicKeyboards = new DynamicKeyboards();
  private readonly staticKeyboards: StaticKeyboards = new StaticKeyboards();
  
  constructor(bot: Telegraf<Context>) {
    super(bot)
  }
  
  handle() {
    this.bot.on('successful_payment', async (ctx) => {
      const rawPayload = ctx.message.successful_payment.invoice_payload
      const payload: TelegramInvoicePayload = JSON.parse(rawPayload, (key, value) => {
        if (key === 'userType') {
          return Boolean(value);
        } else {
          return value;
        }
      });

      if (payload.code === 'balance') {
        await this.userTools.balanceUp(payload.tg, payload.userType, parseInt(payload.codeParams));
  
        return 0;
      } else if (payload.code === 'purchaseKey') {
        return await this.userTools.createKeyAndPushToUser(payload.tg, payload.userType, parseInt(payload.codeParams.split(':')[0]), parseInt(payload.codeParams.split(':')[1]));
      } else if (payload.code === 'extend') {
  
      }
    })
  }
}