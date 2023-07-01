import { Telegraf, Context } from "telegraf";
import { PaymentsTools } from "../../tools/payments.tools";
import { Action } from "../action.class";
import { AuthorizedUserService } from "../../services/authorizedUser.service";
/*
import { DynamicMessages } from "../../messages/dynamic.messages";
import { StaticKeyboards } from "../../keyboards/static.keyboards";
import { Repository } from "typeorm";
import { AuthorizedUser } from "../../entity/authorizedUser.entity";
import { NonAuthorizedUser } from "../../entity/nonAuthorizedUser.entity";
import { AppDataSource } from "../../tools/data-source";
import { NonAuthorizedUserService } from "../../services/nonAuthorizedUser.service";
*/

export class BalanceUpAction extends Action {
  /*
  private readonly dynamicMessages: DynamicMessages = new DynamicMessages();
	private readonly staticKeyboards: StaticKeyboards = new StaticKeyboards();
  private readonly nonAuthorizedUserService: NonAuthorizedUserService = new NonAuthorizedUserService();
  private readonly authorizedUserRepository: Repository<AuthorizedUser> = AppDataSource.getRepository(AuthorizedUser);
  private readonly nonAuthorizedUserRepository: Repository<NonAuthorizedUser> = AppDataSource.getRepository(NonAuthorizedUser);
  */
  private readonly authorizedUserService: AuthorizedUserService = new AuthorizedUserService();
  private readonly paymentsTools: PaymentsTools= new PaymentsTools();
  readonly bot: Telegraf<Context>;

  constructor(bot: Telegraf<Context>) {
    super(bot);
    this.bot = bot;
  }

  handle(): void {
    this.bot.action(/^balance-[0-9]+$/, async (ctx) => {
      const callback_query = ctx.match[0].split('-');
      if (await this.authorizedUserService.findByTg(ctx.from.id.toString())) {
        ctx.replyWithInvoice(
          this.paymentsTools.getInvoice(
            ctx.from.id,
            'Пополнение баланса',
            `Пополнение баланса на ${callback_query[1]} рублей`,
            parseInt(callback_query[1]),
            'RUB',
            `${ctx.from.id}-true-balance-${callback_query[1]}`
          )
        );
      } else {
        ctx.replyWithInvoice(
          this.paymentsTools.getInvoice(
            ctx.from.id,
            'Пополнение баланса',
            `Пополнение баланса на ${callback_query[1]} рублей`,
            parseInt(callback_query[1]),
            'RUB',
            `{"tg": "${ctx.from.id}", "userType": false, "code": "balance", "codeParams": "${callback_query[1]}"}`
          )
        );
      }
      /*
      if (authorizedUser) {
        authorizedUser.balance = authorizedUser.balance + parseInt(callback_query[1]);
        this.authorizedUserRepository.save(authorizedUser);
        await new Promise((r) => setTimeout(r, 300));

        ctx.editMessageText(
          await this.dynamicMessages.startMessage(ctx.from.id.toString()),
          this.staticKeyboards.startKeyboard
        );
      } else {
        const nonAuthorizedUser = await this.nonAuthorizedUserService.findByTg(ctx.from.id.toString());
        
        nonAuthorizedUser.balance = nonAuthorizedUser.balance + parseInt(callback_query[1]);
        this.nonAuthorizedUserRepository.save(nonAuthorizedUser);
        await new Promise((r) => setTimeout(r, 300));

        ctx.editMessageText(
          await this.dynamicMessages.startMessage(ctx.from.id.toString()),
          this.staticKeyboards.startKeyboard
        );
      }
      */
    });
  }
}