import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
  // (Optional) implement rules logic here if needed
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

import { sendTelegramMessage } from '@/integrations/telegram/telegram';

export async function POST(req: NextRequest) {
  try {
    const { userId, text } = await req.json();
    if (!userId || !text) {
      return NextResponse.json({ error: 'Missing userId or text' }, { status: 400 });
    }
    await sendTelegramMessage(userId, text);
    return NextResponse.json({ status: 'sent' });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to send message' }, { status: 500 });
  }
}

// POST/PUT/DELETE endpoints for rules can be added as needed, but bot launching is now handled by the standalone script.
