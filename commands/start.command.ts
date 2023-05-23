import { Context, Telegraf } from "telegraf";
import { Command } from "./command.class";

export class StartCommand extends Command {
 	constructor(bot: Telegraf<Context>) {
		super(bot);
	}

	handle(): void {
		this.bot.start((ctx) => {
			ctx.reply('1');
		});
 	}
}