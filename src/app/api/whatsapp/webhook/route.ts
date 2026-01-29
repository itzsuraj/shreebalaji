import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getWhatsAppBotReply, sendWhatsAppTextMessage } from '@/lib/whatsapp';

// GET: Webhook verification for WhatsApp Cloud API
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token && challenge && token === verifyToken) {
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

// POST: Incoming WhatsApp messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic structure handling for WhatsApp Cloud API webhook
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ status: 'ignored' });
    }

    const message = messages[0];

    // Only handle text messages for now
    if (message.type !== 'text') {
      return NextResponse.json({ status: 'ignored_non_text' });
    }

    const from = message.from as string; // WhatsApp phone number in international format
    const text = message.text?.body as string;

    if (!from || !text) {
      return NextResponse.json({ status: 'ignored_missing_fields' });
    }

    const reply = getWhatsAppBotReply(text);
    await sendWhatsAppTextMessage(from, reply);

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('[WhatsApp Webhook] Error handling request', err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

