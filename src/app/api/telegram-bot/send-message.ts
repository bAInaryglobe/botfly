import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';

export async function POST(req: NextRequest) {
  try {
    const { token, userId, text } = await req.json();
    if (!token || !userId || !text) {
      return NextResponse.json({ error: 'Missing token, userId, or text' }, { status: 400 });
    }
    const bot = new Telegraf(token);
    await bot.telegram.sendMessage(userId, text);
    return NextResponse.json({ status: 'sent' });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to send message' }, { status: 500 });
  }
}
