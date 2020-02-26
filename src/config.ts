export const config: BotConfig = {
  token: process.env.TOKEN,
  name: process.env.BOT_NAME,
};

export interface BotConfig {
  token: string;
  name: string;
}
