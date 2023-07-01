import { Context, Telegraf } from "telegraf";
import { Action } from "../../action.class";
import { KeyService } from "../../../services/key.service";
import { Repository } from "typeorm";
import { Key } from "../../../entity/key.entity";
import { AppDataSource } from "../../../tools/data-source";
import { DynamicMessages } from "../../../messages/dynamic.messages";
import { DynamicKeyboards } from "../../../keyboards/dynamic.keyboards";

export class ChangeAuthMethodAction extends Action {
  private readonly keyService: KeyService = new KeyService();
  private readonly keyRepository: Repository<Key> = AppDataSource.getRepository(Key);
  private readonly dynamicMessages: DynamicMessages = new DynamicMessages();
  private readonly dynamicKeyboards: DynamicKeyboards = new DynamicKeyboards();
  
  constructor(bot: Telegraf<Context>) {
    super(bot);
  }
  
  handle(): void {
    /*
    0 - авторизация по айпи адрессу;
    1 - авторизация по логину и паролю;
    */
    this.bot.action(/^keyManage-[0-9]+-changeAuthMethod-[0-9]/, async (ctx) => {
      const authMethod = parseInt(ctx.match[0].split('-')[3]);
      const keyId = parseInt(ctx.match[0].split('-')[1]);
      const key = await this.keyService.findById(keyId);

      if (authMethod === 0) {
        key.authMethod = 0;
      } else {
        key.authMethod = 1;
      }

      this.keyRepository.save(key);
      
      ctx.editMessageText(
        this.dynamicMessages.manageKeyMessage(key),
        this.dynamicKeyboards.manageKeyKeyboard(key),
      );
    });
  }
}