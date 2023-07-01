import { Telegraf } from "telegraf";
import { Action } from "../action.class";
import { DynamicMessages } from "../../messages/dynamic.messages";
import { StaticKeyboards } from "../../keyboards/static.keyboards";

export class BackAction extends Action {
	private readonly dynamicMessages: DynamicMessages = new DynamicMessages();
	private readonly staticKeyboards: StaticKeyboards = new StaticKeyboards();

	constructor(bot: Telegraf) {
		super(bot);
	}

	handle(): void {
		this.bot.action('back', async (ctx) => {
			ctx.editMessageText(
				await this.dynamicMessages.startMessage(ctx.from.id.toString()),
				this.staticKeyboards.startKeyboard
			);
		});
	}

}