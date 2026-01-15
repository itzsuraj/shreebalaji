import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const cutoff = new Date(Date.now() - 15 * 60 * 1000);
    await Order.updateOne(
      {
        _id: id,
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
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    
    const updateData: {
      status?: string;
      fulfillment?: {
        status?: string;
        trackingNumber?: string;
        carrier?: string;
        trackingUrl?: string;
        shippedAt?: Date;
        deliveredAt?: Date;
        estimatedDelivery?: Date;
      };
      trackingNumber?: string;
      internalNotes?: string;
      customerNotes?: string;
      notes?: string;
      tags?: string[];
      estimatedDelivery?: Date;
      $push?: {
        timeline?: {
          status: string;
          timestamp: Date;
          note: string;
          updatedBy: string;
        };
      };
    } = {};
    
    // Status update
    if (body.status) {
      updateData.status = body.status;
    }
    
    // Fulfillment update
    if (body.fulfillment) {
      updateData.fulfillment = {
        ...body.fulfillment,
        ...(body.fulfillment.shippedAt ? { shippedAt: new Date(body.fulfillment.shippedAt) } : {}),
        ...(body.fulfillment.deliveredAt ? { deliveredAt: new Date(body.fulfillment.deliveredAt) } : {}),
        ...(body.fulfillment.estimatedDelivery ? { estimatedDelivery: new Date(body.fulfillment.estimatedDelivery) } : {}),
      };
    }
    
    // Tracking number
    if (body.trackingNumber) {
      updateData.trackingNumber = body.trackingNumber;
      if (!updateData.fulfillment) {
        updateData.fulfillment = {};
      }
      updateData.fulfillment.trackingNumber = body.trackingNumber;
      updateData.fulfillment.carrier = body.carrier || 'Standard';
      updateData.fulfillment.trackingUrl = body.trackingUrl || body.fulfillment?.trackingUrl || '';
      if (body.trackingNumber && !updateData.fulfillment.shippedAt) {
        updateData.fulfillment.shippedAt = new Date();
        updateData.fulfillment.status = 'fulfilled';
      }
    }
    
    // Notes
    if (body.internalNotes !== undefined) {
      updateData.internalNotes = body.internalNotes;
    }
    if (body.customerNotes !== undefined) {
      updateData.customerNotes = body.customerNotes;
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }
    
    // Tags
    if (body.tags) {
      updateData.tags = body.tags;
    }
    
    // Estimated delivery
    if (body.estimatedDelivery) {
      updateData.estimatedDelivery = new Date(body.estimatedDelivery);
      if (updateData.fulfillment) {
        updateData.fulfillment.estimatedDelivery = new Date(body.estimatedDelivery);
      }
    }
    
    // Add timeline entry if status changed
    if (body.status) {
      const order = await Order.findById(id);
      if (order && order.status !== body.status) {
        if (!updateData.$push) {
          updateData.$push = {};
        }
        updateData.$push.timeline = {
          status: body.status,
          timestamp: new Date(),
          note: body.timelineNote || `Order status changed to ${body.status}`,
          updatedBy: body.updatedBy || 'admin',
        };
      }
    }
    
    const updated = await Order.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Revalidate cache
    revalidatePath('/admin/orders');
    
    return NextResponse.json({ order: updated });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Order.findByIdAndDelete(id);
    
    // Revalidate cache
    revalidatePath('/admin/orders');
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

