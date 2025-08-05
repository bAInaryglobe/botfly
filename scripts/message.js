// Usage: node scripts/message.js <token> <userId> <message>
const { Telegraf } = require('telegraf');

async function main() {
  const [,, token, userId, ...messageParts] = process.argv;
  const message = messageParts.join(' ');
  if (!token || !userId || !message) {
    console.error('Usage: node scripts/message.js <token> <userId> <message>');
    process.exit(1);
  }
  try {
    const bot = new Telegraf(token);
    await bot.telegram.sendMessage(userId, message);
    console.log('Message sent successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to send message:', err.message);
    process.exit(2);
  }
}

main();
