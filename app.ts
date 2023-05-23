import Telegraf from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";

class Bot {
	// bot: Telegraf<Context>
	commands: Command[] = []
	bot: any

	constructor(private readonly configService: IConfigService) {
		this.bot = new Telegraf<Context>(this.configService.get("TOKEN"))
	}

	init() {
		this.commands = [new StartCommand(this.bot)]
		for (const command of this.commands) {
			command.handle()
		}
		
		this.bot.launch()
	}
}

const bot = new Bot(new ConfigService());
bot.init()