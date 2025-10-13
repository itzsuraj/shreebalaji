import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

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

    const order = await Order.findByIdAndUpdate(orderId, {
      $set: {
        'payment.status': 'paid',
        'payment.razorpayOrderId': razorpay_order_id,
        'payment.razorpayPaymentId': razorpay_payment_id,
        'payment.razorpaySignature': razorpay_signature,
        status: 'processing',
      },
    }, { new: true }).lean();

    // Decrement stock after successful payment
    if (order && Array.isArray((order as unknown as { items: Array<{ productId: string; sku?: string; quantity: number }> }).items)) {
      for (const it of (order as unknown as { items: Array<{ productId: string; sku?: string; quantity: number }> }).items) {
        const prod = await Product.findById(it.productId);
        if (!prod) continue;
        const hasVariants = Array.isArray((prod as unknown as { variantPricing?: Array<{ sku?: string; stockQty?: number }> }).variantPricing) && (prod as unknown as { variantPricing: Array<{ sku?: string; stockQty?: number }> }).variantPricing.length > 0;
        if (hasVariants) {
          const v = (prod as unknown as { variantPricing: Array<{ sku?: string; stockQty?: number }> }).variantPricing.find((vp) => vp.sku && vp.sku === it.sku);
          if (v && typeof v.stockQty === 'number') {
            v.stockQty = Math.max(0, v.stockQty - (it.quantity || 0));
          }
          // Recompute product inStock
          const variantHasStock = (prod as unknown as { variantPricing: Array<{ stockQty?: number; inStock?: boolean }> }).variantPricing.some((vp) => (vp?.stockQty ?? 0) > 0 || vp?.inStock === true);
          (prod as unknown as { inStock: boolean; stockQty?: number }).inStock = Boolean(variantHasStock || (((prod as unknown as { stockQty?: number }).stockQty) ?? 0) > 0);
          await prod.save();
        } else {
          if (typeof (prod as unknown as { stockQty?: number }).stockQty === 'number') {
            (prod as unknown as { stockQty?: number }).stockQty = Math.max(0, ((prod as unknown as { stockQty?: number }).stockQty || 0) - (it.quantity || 0));
            (prod as unknown as { inStock: boolean; stockQty?: number }).inStock = (((prod as unknown as { stockQty?: number }).stockQty) ?? 0) > 0;
            await prod.save();
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


