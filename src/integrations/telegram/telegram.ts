// Telegram integration using Telegraf
// Usage: Set TELEGRAM_BOT_TOKEN in your environment

import { Telegraf } from 'telegraf';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
}

export const bot = new Telegraf(token);

// Example: Basic handlers
bot.start((ctx) => ctx.reply('Welcome to Botfly!'));
bot.help((ctx) => ctx.reply('Send me a message or command.'));
bot.on('text', (ctx) => ctx.reply(`You said: ${ctx.message.text}`));

// Launch the bot only if this module is run directly (not imported)
if (require.main === module) {
  bot.launch();
  console.log('Telegram bot started');
  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
