import { Telegraf } from "telegraf";
import { Repository } from "typeorm";
import { AppDataSource } from "../../tools/data-source";
import { Action } from "../action.class";
import { AuthorizedUser } from "../../entity/authorizedUser.entity";
import { AuthorizedUserService } from "../../services/authorizedUser.service";
import { NonAuthorizedUserService } from "../../services/nonAuthorizedUser.service";
import { TariffService } from "../../services/tariff.service";
import { KeyTools } from "../../tools/key.tools";
import { NonAuthorizedUser } from "../../entity/nonAuthorizedUser.entity";
import { StaticMessages } from "../../messages/static.messages";
import { DynamicKeyboards } from "../../keyboards/dynamic.keyboards";
import { DynamicMessages } from "../../messages/dynamic.messages";
import { StaticKeyboards } from "../../keyboards/static.keyboards";
import { PaymentsTools } from "../../tools/payments.tools";

export class BuyAction extends Action {
  private readonly authorizedUserService: AuthorizedUserService = new AuthorizedUserService();
  private readonly nonAuthorizedUserService: NonAuthorizedUserService = new NonAuthorizedUserService();
  private readonly tariffService: TariffService = new TariffService();
  private readonly authorizedUserRepository: Repository<AuthorizedUser> = AppDataSource.getRepository(AuthorizedUser);
  private readonly nonAuthorizedUserRepository: Repository<NonAuthorizedUser> = AppDataSource.getRepository(NonAuthorizedUser);
  private readonly dynamicMessages: DynamicMessages = new DynamicMessages();
  private readonly staticMessages: StaticMessages = new StaticMessages();
  private readonly dynamicKeyboards: DynamicKeyboards = new DynamicKeyboards();
  private readonly staticKeyboards: StaticKeyboards = new StaticKeyboards();
  private readonly keyTools: KeyTools = new KeyTools();
  private readonly paymentsTools: PaymentsTools = new PaymentsTools();

  
  constructor(bot: Telegraf) {
    super(bot);
  }

  handle(): void {
    this.bot.action(/^buy-[A-Za-zа-яА-ЯёЁ]+-[0-9]+$/, async (ctx) => {
      const authorizedUser = await this.authorizedUserService.findByTg(ctx.from.id.toString());
      const callbackQuery = ctx.match[0].split('-');
      const tariff = await this.tariffService.findByName(callbackQuery[1]);
      const duration = parseInt(callbackQuery[2]);
      // const totalPrice = duration * tariff.price

      if (authorizedUser) {
        ctx.replyWithInvoice(
          this.paymentsTools.getInvoice(
            ctx.from.id,
            'Приобретение ключа',
            `Приборетение ключа с тарифом ${tariff.name}${tariff.emoji} на ${duration} дней`,
            duration * tariff.price,
            'RUB',
            `${ctx.from.id}-true-purchaseKey-${tariff.id}:${duration}`,
          )
        );
        
        // const key = this.keyTools.createAuthorizedKey(authorizedUser, tariff, duration);
        // authorizedUser.keys.push(key);
        // authorizedUser.balance = authorizedUser.balance - totalPrice;
        
        // this.authorizedUserRepository.save(authorizedUser);

        // await new Promise((r) => setTimeout(r, 300));
        // ctx.editMessageText(
        //   this.staticMessages.pickAuthMethod,
        //   this.dynamicKeyboards.pickAuthMethod(key),
        // );
      } else {
        // const nonAuthorizedUser = await this.nonAuthorizedUserService.findByTg(ctx.from.id.toString());
        // const key = this.keyTools.createTempKey(ctx.from.id.toString(), tariff, duration);
        
        // nonAuthorizedUser.balance = nonAuthorizedUser.balance - totalPrice;
        // nonAuthorizedUser.keys.push(JSON.stringify(key));
        
        // this.nonAuthorizedUserRepository.save(nonAuthorizedUser);

        // await new Promise((r) => setTimeout(r, 300));

        // ctx.editMessageText(
        //   await this.dynamicMessages.startMessage(ctx.from.id.toString()),
        //   this.staticKeyboards.startKeyboard
        // );        
      }
    })
  }
}