import { Context } from "telegraf";

declare module 'telegraf' {
  interface ContextMessageUpdate extends Context {
    scene: any;
    session: {
      settingsScene: {
        messagesToDelete: any[];
      };
    };
  }
}