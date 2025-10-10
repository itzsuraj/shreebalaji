import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { amountInPaise, receipt } = body as { amountInPaise: number; receipt?: string };
    if (!amountInPaise || amountInPaise < 100) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create order via Razorpay REST API (using fetch)
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({ amount: amountInPaise, currency: 'INR', receipt: receipt || `rcpt_${Date.now()}` }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json({ error: data?.error?.description || `Razorpay error ${response.status}` }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


