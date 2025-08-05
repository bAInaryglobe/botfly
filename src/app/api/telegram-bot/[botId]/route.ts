import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';

// In-memory storage for running bots, rules, logs, and logging state (for demo; use DB for prod)
const bots: Record<string, Telegraf<any>> = {};
const rules: Record<string, Array<{ groupId: string; criteria: string; value: string }>> = {};
const logs: Record<string, Array<any>> = {};
const loggingEnabled: Record<string, boolean> = {};

// Helper: get bot token from somewhere (for demo, expects token in body)
function getBotToken(botId: string, body: any): string | null {
  // In production, fetch from DB using botId
  return body?.token || null;
}

// Helper: add listeners for group rules and general logging
function setupGroupListeners(bot: Telegraf<any>, botId: string) {
  bot.on('text', async (ctx) => {
    // General logging (if enabled)
    if (loggingEnabled[botId]) {
      if (!logs[botId]) logs[botId] = [];
      logs[botId].push({
        date: new Date().toISOString(),
        user: ctx.from?.username || ctx.from?.first_name || 'unknown',
        userId: ctx.from?.id,
        chatId: ctx.chat?.id,
        chatTitle: 'title' in ctx.chat ? ctx.chat.title : '',
        text: ctx.message?.text || '',
      });
      // Limit logs to last 1000 entries
      if (logs[botId].length > 1000) logs[botId].shift();
    }
    // Group rules
    const groupRules = rules[botId] || [];
    for (const rule of groupRules) {
      if (ctx.chat?.id?.toString() !== rule.groupId) continue;
      const text = ctx.message?.text || '';
      if (rule.criteria === 'startsWithNumber' && /^\d/.test(text)) {
        await ctx.reply('Message starts with a number!');
      }
      if (rule.criteria === 'containsCheck' && text.includes('✅')) {
        await ctx.reply('Message contains a check mark!');
      }
      // Add more criteria as needed
    }
  });
}


export async function POST(req: NextRequest, { params }: { params: { botId: string } }) {
  const botId = params.botId;
  const body = await req.json();
  const token = getBotToken(botId, body);
  if (!token) return NextResponse.json({ error: 'Missing bot token' }, { status: 400 });
  if (bots[botId]) return NextResponse.json({ status: 'already running' });
  const bot = new Telegraf(token);
  setupGroupListeners(bot, botId);
  await bot.launch();
  bots[botId] = bot;
  // Initialize logging state if not set
  if (typeof loggingEnabled[botId] === 'undefined') loggingEnabled[botId] = false;
  if (!logs[botId]) logs[botId] = [];
  return NextResponse.json({ status: 'started' });
}

export async function DELETE(req: NextRequest, { params }: { params: { botId: string } }) {
  const botId = params.botId;
  if (bots[botId]) {
    await bots[botId].stop();
    delete bots[botId];
    return NextResponse.json({ status: 'stopped' });
  }
  return NextResponse.json({ status: 'not running' });
}

export async function GET(req: NextRequest) {
  // Extract botId from URL
  const match = req.nextUrl.pathname.match(/\/api\/telegram-bot\/(.+)/);
  const botId = match ? match[1] : null;
  if (!botId) return NextResponse.json({ error: 'Missing botId' }, { status: 400 });
  const url = req.nextUrl;
  if (url.searchParams.get('logs')) {
    return NextResponse.json({ logs: logs[botId] || [], loggingEnabled: !!loggingEnabled[botId] });
  }
  return NextResponse.json({ rules: rules[botId] || [] });
}

export async function PUT(req: NextRequest, { params }: { params: { botId: string } }) {
  // Add a group rule
  const botId = params.botId;
  const body = await req.json();
  if (!body.groupId || !body.criteria) {
    return NextResponse.json({ error: 'Missing groupId or criteria' }, { status: 400 });
  }
  if (!rules[botId]) rules[botId] = [];
  rules[botId].push({ groupId: body.groupId, criteria: body.criteria, value: body.value || '' });
  return NextResponse.json({ status: 'rule added', rules: rules[botId] });
}

export async function PATCH(req: NextRequest, { params }: { params: { botId: string } }) {
  // Remove a group rule or toggle logging
  const botId = params.botId;
  const body = await req.json();
  // Toggle logging
  if (typeof body.loggingEnabled === 'boolean') {
    loggingEnabled[botId] = body.loggingEnabled;
    return NextResponse.json({ status: 'logging toggled', loggingEnabled: loggingEnabled[botId] });
  }
  // Remove a group rule
  if (!body.groupId || !body.criteria) {
    return NextResponse.json({ error: 'Missing groupId or criteria' }, { status: 400 });
  }
  if (!rules[botId]) return NextResponse.json({ status: 'no rules' });
  rules[botId] = rules[botId].filter(r => !(r.groupId === body.groupId && r.criteria === body.criteria && r.value === (body.value || '')));
  return NextResponse.json({ status: 'rule removed', rules: rules[botId] });
}
