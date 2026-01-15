import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';
import { createDelhiveryShipment, createDelhiveryPickup } from '@/lib/delhivery';

/**
 * POST /api/delhivery/create-shipment
 * Body: { orderId: string, pickupLocation: string }
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { orderId, pickupLocation } = body as { orderId?: string; pickupLocation?: string };

    if (!orderId || !pickupLocation) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, pickupLocation' },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.fulfillment?.trackingNumber) {
      return NextResponse.json(
        { error: 'Shipment already created for this order' },
        { status: 400 }
      );
    }

    const defaultWeightKg = Number(process.env.DELHIVERY_DEFAULT_WEIGHT_KG || 0.5);
    const defaultLength = Number(process.env.DELHIVERY_DEFAULT_LENGTH_CM || 20);
    const defaultWidth = Number(process.env.DELHIVERY_DEFAULT_WIDTH_CM || 15);
    const defaultHeight = Number(process.env.DELHIVERY_DEFAULT_HEIGHT_CM || 10);

    const paymentMode: 'COD' | 'Prepaid' = order.payment.method === 'COD' ? 'COD' : 'Prepaid';
    const shipmentPayload = {
      pickup_location: pickupLocation,
      shipments: [
        {
          name: order.customer.fullName,
          add: `${order.customer.addressLine1} ${order.customer.addressLine2 || ''}`.trim(),
          pin: order.customer.postalCode,
          city: order.customer.city,
          state: order.customer.state,
          country: order.customer.country || 'India',
          phone: order.customer.phone,
          order: order.orderNumber || order._id.toString(),
          payment_mode: paymentMode,
          products_desc: order.items.map((it: any) => it.name).join(', '),
          amount: order.subtotalInPaise / 100,
          cod_amount: order.payment.method === 'COD' ? order.totalInPaise / 100 : 0,
          weight: defaultWeightKg,
          quantity: order.items.reduce((sum: number, it: any) => sum + (it.quantity || 0), 0),
          shipment_length: defaultLength,
          shipment_width: defaultWidth,
          shipment_height: defaultHeight,
        },
      ],
    };

    const response = await createDelhiveryShipment(shipmentPayload);

    const waybill = response.packages?.[0]?.waybill;
    if (!waybill) {
      return NextResponse.json(
        {
          error: response.message || 'Delhivery did not return a waybill. Please check pickup location and order details.',
          response,
        },
        { status: 400 }
      );
    }
    const status = response.packages?.[0]?.status || 'created';

    order.fulfillment = {
      status: 'fulfilled',
      trackingNumber: waybill,
      carrier: 'Delhivery',
      trackingUrl: waybill ? `https://www.delhivery.com/track/?wb=${waybill}` : '',
      shippedAt: new Date(),
      items: order.items.map((_: any, index: number) => ({
        itemIndex: index,
        quantity: order.items[index].quantity,
        fulfilledAt: new Date(),
      })),
      delhiveryWaybill: waybill,
      delhiveryStatus: status,
    };

    order.timeline.push({
      status: 'shipped',
      timestamp: new Date(),
      note: `Shipment created via Delhivery. Waybill: ${waybill || 'N/A'}`,
      updatedBy: 'system',
    });

    order.status = 'shipped';
    await order.save();

    let pickupResponse: unknown = null;
    const pickupEnabled = (process.env.DELHIVERY_PICKUP_ENABLED || '').toLowerCase() === 'true';
    if (pickupEnabled) {
      try {
        const pickupDate = new Date().toISOString().slice(0, 10);
        const pickupTime = process.env.DELHIVERY_PICKUP_TIME || '10:00-18:00';
        const packageCount = order.items.reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);
        pickupResponse = await createDelhiveryPickup({
          pickup_location: pickupLocation,
          expected_package_count: Math.max(1, packageCount),
          pickup_date: pickupDate,
          pickup_time: pickupTime,
        });
      } catch (pickupError) {
        pickupResponse = {
          error: pickupError instanceof Error ? pickupError.message : 'Pickup scheduling failed',
        };
      }
    }

    return NextResponse.json({
      success: true,
      shipment: {
        waybill,
        status,
      },
      pickup: pickupResponse,
    });
  } catch (error) {
    console.error('Delhivery create shipment error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create shipment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
