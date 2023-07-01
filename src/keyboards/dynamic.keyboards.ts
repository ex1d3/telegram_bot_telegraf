import { Key } from '../entity/key.entity';
import { Tariff } from '../entity/tariff.entity';
import { AuthorizedUser } from '../entity/authorizedUser.entity';
import { NonAuthorizedUser } from '../entity/nonAuthorizedUser.entity';
import { TariffService } from '../services/tariff.service';
import { AuthorizedUserService } from '../services/authorizedUser.service';
import { NonAuthorizedUserService } from '../services/nonAuthorizedUser.service';
import { Keyboard } from './keyboard.type';
import { KeyTools } from '../tools/key.tools';
import { NetTools } from '../tools/net.tools';
 
export class DynamicKeyboards {
  private readonly tariffService: TariffService = new TariffService();
  private readonly authorizedUserService: AuthorizedUserService = new AuthorizedUserService();
  private readonly nonAuthorizedUserService: NonAuthorizedUserService = new NonAuthorizedUserService();
  private readonly keyTools: KeyTools = new KeyTools();
  private readonly netTools: NetTools = new NetTools();

  sumToUpBalance(tg: string): Keyboard {
    const keyboard = { 
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: '100 руб.', 
              callback_data: `balance-100`, 
            },
            { 
              text: '300 руб.', 
              callback_data: `balance-300`, 
            },
          ],
          [
            { 
              text: '500 руб.', 
              callback_data: `balance-500`, 
            },
            { 
              text: '1000 руб.', 
              callback_data: `balance-1000}`,
            },
          ],
          [
            { 
              text: '1500 руб.', 
              callback_data: `balance-1500` ,
            },
            { 
              text: '3000 руб.', 
              callback_data: `balance-3000`, 
            },
          ],
          [
            { 
              text: 'Другая сумма', 
              callback_data: 'fingerPrint', 
            },
          ],
          [
            { 
              text: 'Вернуться назад', 
              callback_data: 'back⬅️',
            },
          ],
        ],
      },
    };

    return keyboard;
  }

  tariffPriceKeyboard(tariff: Tariff, user: AuthorizedUser | NonAuthorizedUser): Keyboard {
    const tariffName = tariff.name;
    const oneDayPrice = tariff.price;
    const keyboard = {
      reply_markup: {
        inline_keyboard: [],
      },
    };
    const prices = {
      week: {
        price: oneDayPrice * 7,
        callback: `buy-${tariffName}-7`,
        mark: 'week',
      },
      twoWeeks: {
        price: oneDayPrice * 14,
        callback: `buy-${tariffName}-14`,
        mark: 'two_weeks',
      },

      month: {
        price: oneDayPrice * 30,
        callback: `buy-${tariffName}-30`,
        mark: 'month',
      },
    };

    Object.values(prices).forEach((val) => {
      if (user.balance > val.price) {
        if (val.mark === 'week') {
          keyboard.reply_markup.inline_keyboard.push(
            [
              {
                text: `Неделя - ${val.price} рублей`,
                callback_data: val.callback,
              },
            ],
          );
        }
        if (val.mark === 'two_weeks') {
          keyboard.reply_markup.inline_keyboard.push(
            [
              {
                text: `Две недели ${val.price} рублей`,
                callback_data: val.callback,
              },
            ],
          );
        }  
        if (val.mark === 'month') {
          keyboard.reply_markup.inline_keyboard.push(
            [
              {
                text: `Месяц - ${val.price} рублей`,
                callback_data: val.callback,
              },
            ],
          );
        }
      } else {
        if (val.mark === 'week') {
          keyboard.reply_markup.inline_keyboard.push(
            [
              {
                text: `Неделя - ${val.price} рублей (Недостаточно средств)`,
                callback_data: 'empty callback',
              },
            ],
          );
        }
        if (val.mark === 'two_weeks') {
          keyboard.reply_markup.inline_keyboard.push(
            [
              {
                text: `Две недели ${val.price} рублей (Недостаточно средств)`,
                callback_data: 'empty callback',
              },
            ],
          );
        }  
        if (val.mark === 'month') {
          keyboard.reply_markup.inline_keyboard.push(
            [
              {
                text: `Месяц - ${val.price} рублей (Недостаточно средств)`,
                callback_data: 'empty callback',
              },
            ],
          );
        }
      }    
    });

    keyboard.reply_markup.inline_keyboard.push([
      {
        text: 'Вернуться назад⬅️',
        callback_data: 'chooseTariff',
      },
    ]);

    return keyboard;
  }

  async chooseTariffKeyboard(): Promise<Keyboard> {
    const tariffs = await this.tariffService.findAll();
    const rawButtons = tariffs.map((tariff) => [
      { 
        text: tariff.name,
        callback_data: `purchase-${tariff.name}`,
      },
    ]);
    
    return {
      reply_markup: {
        inline_keyboard: [
          ...rawButtons,
          ...[
            [
              { 
                text: 'Вернуться назад⬅️', 
                callback_data: 'back',
              },
            ],
          ],
        ],
      },
    };
  }

  async manageKeysKeyboard(tg: string): Promise<Keyboard> {
    const authorizedUser = await this.authorizedUserService.findByTg(tg);
    let buttons = [];
    let keys: Key[] = [];
    if (authorizedUser) {
      keys = authorizedUser.keys;

      keys.map((key) => {
        const to = new Date(key.to);
        const now = new Date();
        const diffInMilliSeconds = to.getTime() - now.getTime();
        const diffInDays = diffInMilliSeconds / (1000 * 60 * 60 * 24);
        const dif = Math.floor(diffInDays);

        buttons.push([
          {
            text: `IPv${this.netTools.checkIpVersion(key.proxy_list[0])} - ${key.tariff.emoji} - ${key.tariff.subnet} - ${key.tariff.tcp} tcp - ${dif}d`, 
            callback_data: `manage-${key.id}`, 
          },
        ]);
    
      });

    } else {
      const nonAuthorizedUser = await this.nonAuthorizedUserService.findByTg(tg);
      keys = this.keyTools.deserializeKeysWithNewDate(nonAuthorizedUser);
      
      keys.map((key) => {

        buttons.push([
          {
            text: `🔑⛔️ - IPv${this.netTools.checkIpVersion(key.proxy_list[0])} - ${key.tariff.emoji} - ${key.tariff.subnet} - ${key.tariff.tcp} tcp`, 
            callback_data: `manage-0`, 
          },
        ]);
    
      });
    }


    return {
      reply_markup: {
        inline_keyboard: [
          ...buttons,
          ...[
            [
              { 
                text: 'Вернуться назад⬅️', 
                callback_data: 'back',
              }
            ],
          ],
        ],
      },
    };
  }

  manageKeyKeyboard(key: Key): Keyboard {
    let changeAuthMethodText: string;
    let changeAuthMethodCallback: string;
    if (key.authMethod === 0) {
      changeAuthMethodText = 'Сменить метод авторизации на логин и пароль';
      changeAuthMethodCallback = `keyManage-${key.id}-changeAuthMethod-1`;
    } else {
      changeAuthMethodText = 'Сменить метод авторизации на IP';
      changeAuthMethodCallback = `keyManage-${key.id}-changeAuthMethod-0`;
    }
    
    return {
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: changeAuthMethodText, 
              callback_data: changeAuthMethodCallback,
            },
          ],
          [
            { 
              text: 'Статистика подключений',
              callback_data: `keyManage-${key.id}-getStats`, 
            },
          ],
          [
            {
              text: 'Получить прокси список',
              callback_data: `keyManage-${key.id}-getProxyList`
            },
          ],
          [
            { 
              text: 'Продлить ключ', 
              callback_data: `keyManage-${key.id}-extendSubscribe` 
            },
          ],
          [
            { 
              text: 'Вернуться назад', 
              callback_data: 'manageKeys' 
            },
          ],
        ],
      },
    };
  }

  pickAuthMethod(key: Key): Keyboard {
    return {
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: 'Через IP', 
              callback_data: `keyManage-${key.id}-changeAuthMethod-0` 
            },
            {
              text: 'Через логин и пароль', 
              callback_data: `keyManage-${key.id}-changeAuthMethod-1` 
            },
          ],
        ],
      },
    };
  } 

  backToKeySettingsKeyboard(key: Key): Keyboard {
    return {
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: 'Вернуться назад', 
              callback_data: `manage-${key.id}` 
            },
          ],
        ],
      },
    };
  }

  pickDaysToExtendSubscribeKeyboard(key: Key): Keyboard {
    return {
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: '7 дней', 
              callback_data: `keyManage-${key.id}-extendSubscribe-7`, 
            },
            { 
              text: '14 дней', 
              callback_data: `keyManage-${key.id}-extendSubscribe-14`, 
            },
            { 
              text: '30 дней', 
              callback_data: `keyManage-${key.id}-extendSubscribe-30`, 
            },
          ],
          [
            { 
              text: 'Вернуться назад', 
              callback_data: `manage-${key.id}`, 
            },
          ],
        ],
      },
    };
  }
}
