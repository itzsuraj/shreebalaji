import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
  }

  const body = await req.json();
  const { amountInPaise, receipt } = body as { amountInPaise: number; receipt?: string };
  if (!amountInPaise || amountInPaise < 100) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  console.log('Creating Razorpay order:', { amountInPaise, keyId, keySecret: keySecret ? '***' : 'missing' });

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

  const data = await response.json();
  if (!response.ok) {
    console.error('Razorpay API Error:', { status: response.status, data });
    return NextResponse.json({ error: data?.error?.description || 'Failed to create Razorpay order' }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}


