import { Key } from "../entity/key.entity"
import { Tariff } from "../entity/tariff.entity"
import { AuthorizedUser } from "../entity/authorizedUser.entity"
import { Code } from "../entity/code.entity"
import { DataSource } from "typeorm"
import { NonAuthorizedUser } from "../entity/nonAuthorizedUser.entity"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "q",
  database: "bot",
  // logging: "all",
  synchronize: true,
  entities: [AuthorizedUser, NonAuthorizedUser, Tariff, Key, Code],
  subscribers: [],
  migrations: [],
})

AppDataSource.initialize();