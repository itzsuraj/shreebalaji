import { NextRequest, NextResponse } from 'next/server';
import { checkDelhiveryPincode } from '@/lib/delhivery';

/**
 * GET /api/delhivery/pincode?pin=XXXXXX
 */
export async function GET(req: NextRequest) {
  try {
    const pin = req.nextUrl.searchParams.get('pin');
    if (!pin) {
      return NextResponse.json({ error: 'Missing pin' }, { status: 400 });
    }

    const result = await checkDelhiveryPincode(pin);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Delhivery pincode error:', error);
    const message = error instanceof Error ? error.message : 'Failed to check pincode';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
