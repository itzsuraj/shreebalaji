import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const phone = searchParams.get('phone');

    if (!orderId || !phone) {
      return NextResponse.json({ error: 'Order ID and Phone Number are required' }, { status: 400 });
    }

    // Find order by ID and phone number
    const order = await Order.findOne({
      _id: orderId,
      'customer.phone': phone
    }).select('-__v');

    if (!order) {
      return NextResponse.json({ error: 'Order not found. Please check your Order ID and Phone Number.' }, { status: 404 });
    }

    // Format the response
    const orderData = {
      orderId: order._id.toString(),
      status: order.status,
      items: order.items.map((item: { name: string; quantity: number; price: number }) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      customer: {
        fullName: order.customer.fullName,
        phone: order.customer.phone,
        email: order.customer.email
      },
      totalInPaise: order.totalInPaise,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery
    };

    return NextResponse.json(orderData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
