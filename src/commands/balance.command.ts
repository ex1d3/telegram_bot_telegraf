import { Telegraf, Context } from "telegraf";
import { Command } from "./command.class";
import { AuthorizedUserService } from "../services/authorizedUser.service";
import { PaymentsTools } from "../tools/payments.tools";
/*
import { NonAuthorizedUserService } from "../services/nonAuthorizedUser.service";
import { Repository } from "typeorm";
import { AuthorizedUser } from "../entity/authorizedUser.entity";
import { AppDataSource } from "../tools/data-source";
import { NonAuthorizedUser } from "../entity/nonAuthorizedUser.entity";
import { DynamicMessages } from "../messages/dynamic.messages";
import { StaticKeyboards } from "../keyboards/static.keyboards";
*/

export class Balance extends Command {
  private readonly authorizedUserService: AuthorizedUserService = new AuthorizedUserService();
  private readonly paymentsTools: PaymentsTools = new PaymentsTools();
  /*
  private readonly nonAuthorizedUserService: NonAuthorizedUserService = new NonAuthorizedUserService();
  private readonly authorizedUserRepository: Repository<AuthorizedUser> = AppDataSource.getRepository(AuthorizedUser);
  private readonly nonAuthorizedUserRepository: Repository<NonAuthorizedUser> = AppDataSource.getRepository(NonAuthorizedUser);
  private readonly dynamicMessages: DynamicMessages = new DynamicMessages();
  private readonly staticKeyboards: StaticKeyboards = new StaticKeyboards();
  */
  
  constructor(bot: Telegraf<Context>) {
    super(bot);
  }

  handle(): void {
    this.bot.command('balance', async (ctx) => {
      const amount = parseInt(ctx.message.text.split(' ')[1]);
      if (!isNaN(amount)) {
        /*
        const authorizedUser = await this.authorizedUserService.findByTg(ctx.from.id.toString());
        */
        if (await this.authorizedUserService.findByTg(ctx.from.id.toString())) {
          ctx.replyWithInvoice(
            this.paymentsTools.getInvoice(
              ctx.from.id,
              'Пополнение баланса',
              `Пополнение баланса на ${amount} рублей`,
              amount,
              'RUB',
              `${ctx.from.id}-${true}-balance-${amount}`,
            ),
          );
          /*
          authorizedUser.balance = authorizedUser.balance + parseInt(arg);
          this.authorizedUserRepository.save(authorizedUser);
          */
        } else {
          ctx.replyWithInvoice(
            this.paymentsTools.getInvoice(
              ctx.from.id,
              'Пополнение баланса',
              `Пополнение баланса на ${amount} рублей`,
              amount,
              'RUB',
              `${ctx.from.id}-${false}-balance-${amount}`,
            ),
          );
          /*
          const nonAuthorizedUser = await this.nonAuthorizedUserService.findByTg(ctx.from.id.toString());
          nonAuthorizedUser.balance = nonAuthorizedUser.balance + parseInt(arg);
          this.nonAuthorizedUserRepository.save(nonAuthorizedUser);
          */
        }
        /*
        await new Promise((r) => setTimeout(r, 300));

        ctx.reply(
          await this.dynamicMessages.startMessage(ctx.from.id.toString()),
          this.staticKeyboards.startKeyboard,
        );
        */
      }
    })
  }
}