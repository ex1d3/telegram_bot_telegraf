import { TariffService } from "../services/tariff.service";
import { AuthorizedUserService } from "../services/authorizedUser.service";
import { Key } from "../entity/key.entity";
import { Tariff } from "../entity/tariff.entity";
import { NonAuthorizedUserService } from "../services/nonAuthorizedUser.service";
import { KeyTools } from "../tools/key.tools";

export class DynamicMessages {
  private readonly authorizedUserService: AuthorizedUserService = new AuthorizedUserService();
  private readonly nonAuthorizedUserService: NonAuthorizedUserService = new NonAuthorizedUserService();
  private readonly keyTools: KeyTools = new KeyTools();
  
  async startMessage(tg: string): Promise<string> {
    const authorizedUser = await this.authorizedUserService.findByTg(tg);
    
    if (authorizedUser) {
      let tariffStatus;
      if (authorizedUser.keys.length !== 0) {
        tariffStatus = 'Активен';
      } else {
        tariffStatus = 'Не активен';
      }
    
      return `E-mail: ${authorizedUser.email}\n👤ID: ${authorizedUser.tg}\n💰Баланс: ${authorizedUser.balance} руб.\n🔐Тариф: ${tariffStatus}`;
    } else {
      const nonAuthorizedUser = await this.nonAuthorizedUserService.findByTg(tg);
      let tariffStatus;
      if (nonAuthorizedUser.keys !== undefined) {
        if (nonAuthorizedUser.keys.length > 0) {
          tariffStatus = 'Активен';
        } else {
          tariffStatus = 'Не активен';
        }
      } else {
        tariffStatus = 'Не активен';
      }

      return `E-mail: Не подтвержден\n👤ID: ${tg}\n💰Баланс: ${nonAuthorizedUser.balance} руб.\n🔐Тариф: ${tariffStatus}`;
    }
  }
    
  tariffDataMessage(tariff: Tariff): string {
    return `${tariff.name}\n${tariff.description}\n\nНа какой срок хотите приобрести тариф?`;
  }

  manageKeyMessage(key: Key): string {
    const to = this.keyTools.getUTCDate(new Date(key.to))
    let authMethod: string;

    if(key.authMethod === 0) {
      authMethod = 'IP'
    } else {
      authMethod = 'Логин и пароль'
    }

    return `Ключ: ${key.uid}\nТариф: ${key.tariff.name}\nЗаканчивается: ${to} UTC\nТип авторизации: ${authMethod}\nЛимит TCP: ${key.tariff.tcp}`
  }

  getProxyListMessage(key: Key): string {
    const rawProxyList = key.proxy_list;
    let messageToSend: string = 'Ваш прокси лист:\n';
    rawProxyList.forEach((ip) => {
      messageToSend = messageToSend + ip + '\n';
    })

    return messageToSend;
  }

  pickDaysToExtendSubscribeMessage(key: Key): string {
    return `Выберите колличество дней на которое хотите продлить свой ключ.\nЛибо введите /extendSubscribe ${key.uid} [Желаемое колличество дней для продления]`;
  }
}