// Telegram integration using Telegraf
import { Telegraf } from 'telegraf';

/**
 * Send a message to a Telegram user immediately using a specific bot token
 * @param token Bot token
 * @param userId Telegram user ID  
 * @param text Message text
 */
export async function sendTelegramMessage(token: string, userId: number, text: string): Promise<void> {
  if (!token) {
    throw new Error('Bot token is required');
  }
  
  const bot = new Telegraf(token);
  await bot.telegram.sendMessage(userId, text);
}

/**
 * Create and launch a Telegram bot with handlers
 * @param token Bot token
 * @returns Bot instance
 */
export function createTelegramBot(token: string): Telegraf {
  if (!token) {
    throw new Error('Bot token is required');
  }
  
  const bot = new Telegraf(token);
  
  // Basic handlers
  bot.start((ctx) => ctx.reply('Welcome to Botfly!'));
  bot.help((ctx) => ctx.reply('Send me a message or command.'));
  bot.on('text', (ctx) => ctx.reply(`You said: ${ctx.message.text}`));
  
  return bot;
}
