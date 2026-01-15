import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';

/**
 * POST /api/delhivery/webhook
 * Handles status updates from Delhivery
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const waybill = body?.waybill || body?.Waybill || body?.shipment?.waybill;
    const status = body?.status || body?.Status || body?.shipment?.status;

    if (!waybill) {
      return NextResponse.json({ error: 'Missing waybill' }, { status: 400 });
    }

    const order = await Order.findOne({
      $or: [
        { 'fulfillment.trackingNumber': waybill },
        { 'fulfillment.delhiveryWaybill': waybill },
      ],
    });

    if (!order) {
      return NextResponse.json({ success: true, message: 'Order not found' });
    }

    if (order.fulfillment) {
      order.fulfillment.delhiveryStatus = status || order.fulfillment.delhiveryStatus;
    }

    if (status === 'Delivered') {
      order.status = 'delivered';
      order.timeline.push({
        status: 'delivered',
        timestamp: new Date(),
        note: 'Order delivered (Delhivery)',
        updatedBy: 'delhivery',
      });
    } else if (status === 'In Transit' || status === 'Shipped') {
      order.status = 'shipped';
      order.timeline.push({
        status: 'shipped',
        timestamp: new Date(),
        note: `Shipment update: ${status}`,
        updatedBy: 'delhivery',
      });
    }

    await order.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delhivery webhook error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process webhook';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
