import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';
import { calculateTotals } from '@/lib/config';

interface OrderItemPayload {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  sku?: string;
}

interface CustomerPayload {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  gstin?: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { items, customer, paymentMethod } = body as {
      items: OrderItemPayload[];
      customer: CustomerPayload;
      paymentMethod: 'UPI' | 'COD';
    };

    if (!items?.length) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    const subtotalInPaise = items.reduce((sum, it) => sum + Math.round(it.price * 100) * it.quantity, 0);
    const { shippingInPaise, gstInPaise, grandTotalInPaise } = calculateTotals(subtotalInPaise);

    const order = await Order.create({
      items,
      subtotalInPaise,
      shippingInPaise,
      gstInPaise,
      totalInPaise: grandTotalInPaise,
      customer,
      payment: { method: paymentMethod, status: paymentMethod === 'COD' ? 'pending' : 'pending' },
      status: 'created',
    });

    return NextResponse.json({ orderId: order._id, totalInPaise: order.totalInPaise });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


