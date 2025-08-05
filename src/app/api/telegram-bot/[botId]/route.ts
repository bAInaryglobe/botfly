import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendTelegramMessage } from '@/integrations/telegram/telegram';
import { getDocument, COLLECTION_IDS, databaseId, getBotById } from '@/lib/appwrite';
import type { Bots } from '@/types/appwrite';

const LOGS_FILE = path.join(process.cwd(), 'src/integrations/telegram/telegram-bot-logs.json');
const LOGGING_FLAG_FILE = path.join(process.cwd(), 'src/integrations/telegram/telegram-bot-logging-flag.json');

function readLogs() {
  try {
    return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}
function readLoggingFlag() {
  try {
    return JSON.parse(fs.readFileSync(LOGGING_FLAG_FILE, 'utf-8')).enabled;
  } catch {
    return false;
  }
}
function writeLoggingFlag(enabled: boolean) {
  fs.writeFileSync(LOGGING_FLAG_FILE, JSON.stringify({ enabled }));
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  if (url.searchParams.get('logs')) {
    return NextResponse.json({ logs: readLogs(), loggingEnabled: readLoggingFlag() });
  }
  return NextResponse.json({});
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  if (typeof body.loggingEnabled === 'boolean') {
    writeLoggingFlag(body.loggingEnabled);
    return NextResponse.json({ status: 'logging toggled', loggingEnabled: body.loggingEnabled });
  }
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}

export async function POST(req: NextRequest, { params }: { params: { botId: string } }) {
  try {
    const { userId, text } = await req.json();
    const { botId } = params;

    if (!userId || !text) {
      return NextResponse.json({ error: 'Missing userId or text' }, { status: 400 });
    }

    if (!botId) {
      return NextResponse.json({ error: 'Missing botId' }, { status: 400 });
    }

    // Use robust getBotById utility
    const botResult = await getBotById(botId);
    if (botResult instanceof Error) {
      return NextResponse.json({ error: botResult.message }, { status: 404 });
    }
    const { token } = botResult;
    await sendTelegramMessage(token, userId, text);
    return NextResponse.json({ status: 'sent' });
  } catch (err) {
    console.error('Telegram send error:', err);
    const error = err as Error;
    return NextResponse.json({ error: error?.message || 'Failed to send message' }, { status: 500 });
  }
}

