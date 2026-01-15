import { NextRequest, NextResponse } from 'next/server';
import { trackDelhiveryShipment } from '@/lib/delhivery';

/**
 * GET /api/delhivery/track?waybill=XXXX
 */
export async function GET(req: NextRequest) {
  try {
    const waybill = req.nextUrl.searchParams.get('waybill');
    if (!waybill) {
      return NextResponse.json({ error: 'Missing waybill' }, { status: 400 });
    }

    const tracking = await trackDelhiveryShipment(waybill);
    return NextResponse.json(tracking);
  } catch (error) {
    console.error('Delhivery tracking error:', error);
    const message = error instanceof Error ? error.message : 'Failed to track shipment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
