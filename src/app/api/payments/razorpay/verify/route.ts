import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay key secret not configured' }, { status: 500 });
    }

    await connectToDatabase();

    const body = await req.json();
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body as {
      orderId: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = generatedSignature === razorpay_signature;
    if (!isValid) {
      await Order.findByIdAndUpdate(orderId, {
        $set: {
          'payment.status': 'failed',
          'payment.razorpayOrderId': razorpay_order_id,
          'payment.razorpayPaymentId': razorpay_payment_id,
          'payment.razorpaySignature': razorpay_signature,
          status: 'created',
        },
      });
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    await Order.findByIdAndUpdate(orderId, {
      $set: {
        'payment.status': 'paid',
        'payment.razorpayOrderId': razorpay_order_id,
        'payment.razorpayPaymentId': razorpay_payment_id,
        'payment.razorpaySignature': razorpay_signature,
        status: 'processing',
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


