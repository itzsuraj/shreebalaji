import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all unique customers from orders
    const customers = await Order.aggregate([
      {
        $group: {
          _id: {
            fullName: '$customer.fullName',
            phone: '$customer.phone',
            email: '$customer.email',
            city: '$customer.city'
          },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalInPaise' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' },
          orderIds: { $push: '$_id' }
        }
      },
      {
        $project: {
          _id: 0,
          fullName: '$_id.fullName',
          phone: '$_id.phone',
          email: '$_id.email',
          city: '$_id.city',
          totalOrders: 1,
          totalSpent: 1,
          firstOrder: 1,
          lastOrder: 1,
          orderIds: 1
        }
      },
      {
        $sort: { lastOrder: -1 }
      }
    ]);

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
