export const config: BotConfig = {
  token: process.env.TOKEN_API,
  name: process.env.BOT_NAME,
};

export interface BotConfig {
  token: string;
  name: string;
}
