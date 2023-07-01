import express, { Request, Response } from "express"
import { Telegraf, Context } from "telegraf";
import { AuthorizedUserService } from "./services/authorizedUser.service";
import { createLogger, transports, format } from "winston";

export class WebServer {
  bot: Telegraf<Context>;
  AuthorizedUserService: AuthorizedUserService = new AuthorizedUserService();

  constructor(bot: Telegraf) {
    this.bot = bot;
  };
  
  init(): void {
    const app = express();
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
        service: "Express",
      },
    });

    app.get('/check/:tg', async (req: Request, res: Response) => {
      const AuthorizedUser = await this.AuthorizedUserService.findByTg(req.params.tg);

      if (AuthorizedUser) {
        if (AuthorizedUser.tg) {
          try {
            const msg = await this.bot.telegram.sendMessage(req.params.tg, '.');
            this.bot.telegram.deleteMessage(msg.chat.id, msg.message_id);

            res.json({succes: true});
          } catch (err) {
            res.json({succes: false});
          }
        } else {
          res.json({succes: false});
        }
      } else {
        res.json({succes: false});
      }
    });

    app.listen(3000, () => {
      logger.info('Started');
    });
  }
}