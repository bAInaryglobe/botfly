import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/integrations/telegram/telegram';

export async function POST(req: NextRequest) {
  try {
    const { token, userId, text } = await req.json();
    if (!token || !userId || !text) {
      return NextResponse.json({ error: 'Missing token, userId, or text' }, { status: 400 });
    }
    await sendTelegramMessage(token, userId, text);
    return NextResponse.json({ status: 'sent' });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error?.message || 'Failed to send message' }, { status: 500 });
  }
}
