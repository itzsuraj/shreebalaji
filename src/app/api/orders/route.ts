import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
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

    const { items, customer, paymentMethod, shippingInPaise: shippingOverride, gstInPaise: gstOverride } = body as {
      items: OrderItemPayload[];
      customer: CustomerPayload;
      paymentMethod: 'UPI' | 'COD';
      shippingInPaise?: number;
      gstInPaise?: number;
    };

    if (!items?.length) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    // Validate stock server-side
    for (const it of items) {
      const prod = await Product.findById(it.productId).lean<{ _id: string; stockQty?: number; inStock?: boolean; variantPricing?: Array<{ sku?: string; stockQty?: number; inStock?: boolean }> }>();
      if (!prod) {
        return NextResponse.json({ error: `Product not found: ${it.productId}` }, { status: 400 });
      }
      const hasVariants = Array.isArray(prod.variantPricing) && prod.variantPricing.length > 0;
      if (hasVariants) {
        // If SKU present, try to match; otherwise, rely on product inStock only
        const v = prod.variantPricing!.find((vp) => vp.sku && vp.sku === it.sku);
        if (v && typeof v.stockQty === 'number' && v.stockQty < it.quantity) {
          return NextResponse.json({ error: `Insufficient stock for selected variant of ${it.name}` }, { status: 409 });
        }
      } else {
        if (typeof prod.stockQty === 'number' && prod.stockQty < it.quantity) {
          return NextResponse.json({ error: `Insufficient stock for ${it.name}` }, { status: 409 });
        }
      }
    }

    const subtotalInPaise = items.reduce((sum, it) => sum + Math.round(it.price * 100) * it.quantity, 0);
    const { shippingInPaise, gstInPaise, grandTotalInPaise } = (() => {
      const base = calculateTotals(subtotalInPaise);
      if (typeof shippingOverride === 'number' && Number.isFinite(shippingOverride) && shippingOverride >= 0) {
        const gstInPaise = typeof gstOverride === 'number' && Number.isFinite(gstOverride) && gstOverride >= 0
          ? gstOverride
          : Math.round((subtotalInPaise + shippingOverride) * (18 / 100));
        return {
          shippingInPaise: shippingOverride,
          gstInPaise,
          grandTotalInPaise: subtotalInPaise + shippingOverride + gstInPaise,
        };
      }
      return base;
    })();

    const order = await Order.create({
      items,
      subtotalInPaise,
      shippingInPaise,
      gstInPaise,
      totalInPaise: grandTotalInPaise,
      customer,
      payment: { method: paymentMethod, status: paymentMethod === 'COD' ? 'pending' : 'pending' },
      status: 'created',
      timeline: [{
        status: 'created',
        timestamp: new Date(),
        note: 'Order created',
        updatedBy: 'system',
      }],
    });

    return NextResponse.json({ orderId: order._id, totalInPaise: order.totalInPaise });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


