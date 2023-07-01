import { Telegraf, Context } from "telegraf";
import { Command } from "./command.class";
import { DynamicMessages } from "../messages/dynamic.messages";
import { StaticKeyboards } from "../keyboards/static.keyboards";
import { NonAuthorizedUserService } from "../services/nonAuthorizedUser.service";
import { UserTools } from "../tools/user.tools";

export class StartCommand extends Command {
	private readonly dynamicMessages: DynamicMessages = new DynamicMessages();
	private readonly staticKeyboards: StaticKeyboards = new StaticKeyboards();
	private readonly nonAuthorizedUserService: NonAuthorizedUserService = new NonAuthorizedUserService();
	private readonly userTools: UserTools = new UserTools();

	constructor(bot: Telegraf<Context>) {
		super(bot);
	}

	handle(): void {
		this.bot.start(async (ctx) => {
			const user = await this.nonAuthorizedUserService.findByTg(ctx.from.id.toString());

			if (!user) {
				this.userTools.createUser(false, ctx.from.id.toString(), null);
				await new Promise((r) => setTimeout(r, 500));
			}
			
			const message = await ctx.reply(
				await this.dynamicMessages.startMessage(ctx.from.id.toString()),
        this.staticKeyboards.startKeyboard
			);
		});
 	}
}