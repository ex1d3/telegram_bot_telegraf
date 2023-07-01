import { Telegraf, Context } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import { SumToUpBalanceAction } from "./actions/static/sumToUpBalance.action";
import { Action } from "./actions/action.class";
import { BackAction } from "./actions/static/back.action";
import { ChooseTariffAction } from "./actions/static/chooseTariff.action";
import { ManageKeysAction } from "./actions/static/chooseKey.action";
import { ManageKeyAction } from "./actions/dynamic/manageKey.action";
import { PurchaseKeyAction } from "./actions/dynamic/purchaseKey.action";
import { BuyAction } from "./actions/dynamic/buy.action";
import { EnterEmailAction } from "./actions/static/enterEmail.action";
import { TextOn } from "./on/text.on";
import { On } from "./on/on.class";
import { _cronJob } from "./tools/cron-tools/cron-job";
import { WebServer } from "./webServer";
import { createLogger, transports, format } from "winston";
import { BalanceUpAction } from "./actions/dynamic/balanceUp.action";
import { Balance } from "./commands/balance.command";
import { ChangeAuthMethodAction } from "./actions/dynamic/keyManage/changeAuthMethod.action";
import { GetProxyListAction } from "./actions/dynamic/keyManage/getProxyList.action";
import LocalSession from "telegraf-session-local";
import { PickDaysToExtendSubscribeAction } from "./actions/dynamic/keyManage/pickDaysToExtedndSubscribe.action";
import { PreCheckoutQueryOn } from "./on/preCheckoutQuery.on";
import { SuccessfulPaymentOn } from "./on/successfulPayment.on";

class BotClass {
	bot: Telegraf<Context>;
	secretKey: string;
	commands: Command[] = [];
	on: On[] = [];
	actions: Action[] = [];
	cron_job: _cronJob = new _cronJob();
	server: WebServer;

	constructor(private readonly configService: IConfigService) {
		this.bot = new Telegraf<Context>(this.configService.get("TOKEN"));
		this.bot.use((new LocalSession({ database: 'sessions.json' })).middleware())
		this.secretKey = this.configService.get('SECRET_KEY');
	}

	init() {		
		const logger = createLogger({
      transports: [new transports.Console()],
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, service }) => {
          return `[${timestamp}] ${service} ${level}: ${message}`;
        })
      ),
      defaultMeta: {
        service: "Bot",
      },
    });

		this.server = new WebServer(this.bot);
		this.commands = [
			new StartCommand(this.bot),
			new Balance(this.bot),
		];
		this.on = [
			new TextOn(this.bot),
			new PreCheckoutQueryOn(this.bot),
			new SuccessfulPaymentOn(this.bot),
		];
		this.actions = [
			new BackAction(this.bot),
			new BalanceUpAction(this.bot),
			new SumToUpBalanceAction(this.bot),
			new ChooseTariffAction(this.bot),
			new ManageKeyAction(this.bot),
			new ManageKeysAction(this.bot),
			new PurchaseKeyAction(this.bot),
			new BuyAction(this.bot),
			new EnterEmailAction(this.bot),
			new ChangeAuthMethodAction(this.bot),
			new GetProxyListAction(this.bot),
			new PickDaysToExtendSubscribeAction(this.bot),
		];

		for (const command of this.commands) {
			command.handle();
		}

		for (const on of this.on) {
			on.handle();
		}

		for (const action of this.actions) {
			action.handle();
		}

		this.cron_job.job.start();
		this.bot.launch();
		this.server.init();

		logger.info('Started')
	}
}

const bot = new BotClass(new ConfigService());
bot.init();