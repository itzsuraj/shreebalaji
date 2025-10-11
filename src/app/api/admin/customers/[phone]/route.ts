import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ phone: string }> }
) {
  try {
    await connectToDatabase();
    
    const resolvedParams = await params;
    const phone = decodeURIComponent(resolvedParams.phone);
    
    // Get customer details and all their orders
    const customerOrders = await Order.find({
      'customer.phone': phone
    }).sort({ createdAt: -1 });

    if (customerOrders.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Calculate customer statistics
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalInPaise, 0);
    const totalOrders = customerOrders.length;
    const firstOrder = customerOrders[customerOrders.length - 1];
    const lastOrder = customerOrders[0];

    const customerDetails = {
      fullName: firstOrder.customer.fullName,
      phone: firstOrder.customer.phone,
      email: firstOrder.customer.email,
      city: firstOrder.customer.city,
      totalOrders,
      totalSpent,
      firstOrder: firstOrder.createdAt,
      lastOrder: lastOrder.createdAt,
      orders: customerOrders
    };

    return NextResponse.json({ customer: customerDetails });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return NextResponse.json({ error: 'Failed to fetch customer details' }, { status: 500 });
  }
}
