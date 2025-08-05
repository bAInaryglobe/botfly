import { Telegraf } from 'telegraf';
import fs from 'fs';
import path from 'path';

// --- CONFIG ---
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const LOGS_FILE = path.join(__dirname, 'telegram-bot-logs.json');

if (!BOT_TOKEN) {
  console.error('Missing BOT_TOKEN env variable.');
  process.exit(1);
}

// --- LOGGING ---
function loadLogs(): any[] {
  try {
    return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}
function saveLogs(logs: any[]) {
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
}

let logs = loadLogs();

// --- BOT SETUP ---
const bot = new Telegraf(BOT_TOKEN);

bot.on('text', (ctx) => {
  const logEntry = {
    date: new Date().toISOString(),
    user: ctx.from?.username || ctx.from?.first_name || 'unknown',
    userId: ctx.from?.id,
    chatId: ctx.chat?.id,
    chatTitle: 'title' in ctx.chat ? ctx.chat.title : '',
    text: ctx.message?.text || '',
  };
  logs.push(logEntry);
  if (logs.length > 1000) logs.shift();
  saveLogs(logs);
  console.log('[LOGGED]', logEntry);
});

bot.launch();
console.log('Telegram bot started and polling.');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
