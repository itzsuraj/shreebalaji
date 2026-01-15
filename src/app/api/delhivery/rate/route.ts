import { NextRequest, NextResponse } from 'next/server';
import { getDelhiveryRate } from '@/lib/delhivery';
import { DEFAULT_SHIPPING_FEE_INR } from '@/lib/config';

function extractRateValue(raw: Record<string, unknown>): number | null {
  const candidates = [
    'total_amount',
    'charge',
    'freight_charge',
    'cod_charge',
    'total',
    'amount',
  ];

  for (const key of candidates) {
    const value = raw[key];
    if (typeof value === 'number' && !Number.isNaN(value)) return value;
    if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }

  return null;
}

/**
 * GET /api/delhivery/rate?pin=XXXXXX&weightKg=0.5&cod=0&orderValue=300
 */
export async function GET(req: NextRequest) {
  try {
    const pin = req.nextUrl.searchParams.get('pin');
    const weightKgParam = req.nextUrl.searchParams.get('weightKg');
    const codParam = req.nextUrl.searchParams.get('cod');
    const orderValueParam = req.nextUrl.searchParams.get('orderValue');

    if (!pin) {
      return NextResponse.json({ error: 'Missing pin' }, { status: 400 });
    }

    const originPin = process.env.DELHIVERY_PICKUP_PIN || '';
    if (!originPin) {
      return NextResponse.json({ error: 'Missing DELHIVERY_PICKUP_PIN' }, { status: 500 });
    }

    const weightKg = weightKgParam ? Number(weightKgParam) : Number(process.env.DELHIVERY_DEFAULT_WEIGHT_KG || 0.5);
    const paymentMode = codParam === '1' ? 'COD' : 'Pre-paid';
    const declaredValue = orderValueParam ? Number(orderValueParam) : undefined;

    const shipmentStatus = (process.env.DELHIVERY_RATE_SS as 'Delivered' | 'RTO' | 'DTO') || 'Delivered';
    const raw = await getDelhiveryRate({
      originPin,
      destPin: pin,
      weightKg: Number.isFinite(weightKg) ? weightKg : 0.5,
      paymentMode,
      declaredValue: Number.isFinite(declaredValue as number) ? (declaredValue as number) : undefined,
      shipmentStatus,
    });

    const rateValue = extractRateValue(raw as Record<string, unknown>);
    const rateInPaise = rateValue !== null ? Math.round(rateValue * 100) : null;

    return NextResponse.json({
      rateInPaise,
      fallbackInPaise: DEFAULT_SHIPPING_FEE_INR * 100,
      raw,
    });
  } catch (error) {
    console.error('Delhivery rate error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch rate';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
