import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { updates } = await req.json();
    
    if (!Array.isArray(updates)) {
      return NextResponse.json({ success: false, error: 'Updates must be an array' }, { status: 400 });
    }

    const bulkOps = updates.map(({ productId, stockQty, inStock }) => ({
      updateOne: {
        filter: { _id: productId },
        update: { 
          stockQty, 
          inStock: Boolean(inStock) 
        }
      }
    }));

    const result = await Product.bulkWrite(bulkOps);
    
    return NextResponse.json({ 
      success: true, 
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount 
    });
  } catch (error) {
    console.error('Error updating bulk stock:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update stock' 
    }, { status: 500 });
  }
}




