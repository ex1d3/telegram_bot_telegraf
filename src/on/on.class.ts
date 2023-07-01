import { Telegraf, Context } from "telegraf";

export abstract class On {
  constructor(public bot: Telegraf<Context>) {}
  
  abstract handle()
}