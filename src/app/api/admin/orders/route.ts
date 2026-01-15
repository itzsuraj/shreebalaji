import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const cutoff = new Date(Date.now() - 15 * 60 * 1000);
    await Order.updateMany(
      {
        status: 'created',
        'payment.status': 'pending',
        createdAt: { $lte: cutoff },
      },
      {
        $set: {
          status: 'cancelled',
          'payment.status': 'failed',
        },
      }
    );
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Build filter object
    const filter: Record<string, unknown> = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.fullName': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get orders with pagination - include all fields
    const skip = (page - 1) * limit;
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('+timeline +fulfillment +internalNotes +customerNotes +tags')
      .lean();
    
    // Get total count for pagination
    const total = await Order.countDocuments(filter);
    
    // Calculate statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalInPaise' },
          pendingOrders: {
            $sum: {
              $cond: [
                { $in: ['$status', ['processing', 'shipped']] },
                1,
                0
              ]
            }
          },
          completedOrders: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'delivered'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);
    
    const statistics = stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0
    };
    
    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statistics: {
        totalOrders: statistics.totalOrders,
        totalRevenue: statistics.totalRevenue / 100, // Convert from paise to rupees
        pendingOrders: statistics.pendingOrders,
        completedOrders: statistics.completedOrders
      }
    });
  } catch (error) {
    console.error('Admin orders API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, trackingNumber, notes } = body;
    
    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and status are required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const updateData: Record<string, unknown> = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Admin orders update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
