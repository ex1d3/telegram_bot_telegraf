import { Telegraf } from "telegraf";
import { Action } from "../action.class";
import { DynamicKeyboards } from "../../keyboards/dynamic.keyboards";
import { StaticMessages } from "../../messages/static.messages";

export class SumToUpBalanceAction extends Action {
	private readonly staticMessages: StaticMessages = new StaticMessages();
	private readonly dynamicKeyboards: DynamicKeyboards = new DynamicKeyboards();
	
	constructor(bot: Telegraf) {
		super(bot);
	}

	handle(): void {
		this.bot.action('sumToUpBalance', async (ctx) => {
			ctx.editMessageText(
				this.staticMessages.sumToUpBalance,
				await this.dynamicKeyboards.sumToUpBalance(ctx.from.id.toString())
			);
		});
	}
}