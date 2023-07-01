import { Repository } from "typeorm";
import {v4 as uuidv4} from 'uuid';
import { Key } from "../entity/key.entity";
import { Tariff } from "../entity/tariff.entity";
import { AuthorizedUser } from "../entity/authorizedUser.entity";
import { AppDataSource } from '../tools/data-source';
import { NonAuthorizedUser } from "../entity/nonAuthorizedUser.entity";

export class KeyTools {
  private readonly keyRepository: Repository<Key> = AppDataSource.getRepository(Key);

  createAuthorizedKey(user: AuthorizedUser, tariff: Tariff, duration: number): Key {
    const key = new Key()
    const from = new Date();
    const to = new Date();
  
    to.setDate(to.getDate() + duration)
  
    key.from = from;
    key.to = to;
    key.tariff = tariff;
    key.user = user;
    key.proxy_list = tariff.proxy_list;
    key.duration = duration;
    key.uid = uuidv4();
  
    this.keyRepository.save(key);
  
    return key;
  }

  createTempKey(user: string, tariff: Tariff, duration: number): Key {
    const key = new Key()
    const from = new Date();
    const to = new Date();
  
    to.setDate(to.getDate() + duration)
    
    key.from = from;
    key.to = to;
    key.tariff = tariff;
    key.user = user;
    key.proxy_list = tariff.proxy_list;
    key.duration = duration;
    key.authMethod = 1;
    key.uid = uuidv4();

    return key;
  }

  deserializeKeysWithNewDate(user: NonAuthorizedUser) {
    let keysToReturn: Key[] = [ ];
    user.keys.forEach((TKey) => {
      const key = new Key();
      let tKey = JSON.parse(TKey)
      let dif: number;
          
      tKey.to = new Date(tKey.to);
      tKey.from = new Date(tKey.from);
      dif = (tKey.to - tKey.from) / (1000 * 60) / 1440;
  
      let from = new Date();
      let to = new Date();
  
      to.setDate(to.getDate() + dif);

      console.log(tKey.tariff.proxy_list)
          
      key.from = from;
      key.to = to;
      key.tariff = tKey.tariff;
      key.user = user.tg;
      key.proxy_list = tKey.tariff.proxy_list;
      key.duration = dif;
      key.uid = tKey.uid

      keysToReturn.push(key);
    })

    return keysToReturn
  }

  deserializeKeysWithOldDate(user: NonAuthorizedUser) {
    let keysToReturn: Key[] = [];
    user.keys.forEach((TKey) => {
      const key = new Key();
      let tKey = JSON.parse(TKey)
      let dif: number;
          
      tKey.to = new Date(tKey.to);
      tKey.from = new Date(tKey.from);

      dif = (tKey.to - tKey.from) / (1000 * 60) / 1440;
  
      key.from = new Date(tKey.to);
      key.to = new Date(tKey.from);
      key.tariff = tKey.tariff;
      key.user = user.tg;
      key.proxy_list = tKey.tariff.proxy_list;
      key.duration = dif
      key.uid = tKey.uid

      keysToReturn.push(key);
    })

    return keysToReturn
  }

  getUTCDate(date: Date) {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }
}