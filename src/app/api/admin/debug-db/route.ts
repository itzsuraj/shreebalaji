import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get total count
    const totalCount = await Product.countDocuments();
    
    // Get active count
    const activeCount = await Product.countDocuments({ status: 'active' });
    
    // Get draft count
    const draftCount = await Product.countDocuments({ status: 'draft' });
    
    // Get products without status
    const noStatusCount = await Product.countDocuments({ 
      $or: [
        { status: { $exists: false } },
        { status: null },
        { status: '' }
      ]
    });
    
    // Get all products with basic info
    const allProducts = await Product.find()
      .select('_id name category status createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();
    
    // Get products with variants
    const productsWithVariants = await Product.find({
      variantPricing: { $exists: true, $ne: [], $size: { $gt: 0 } }
    })
      .select('_id name variantPricing')
      .lean();
    
    return NextResponse.json({
      success: true,
      summary: {
        totalProducts: totalCount,
        activeProducts: activeCount,
        draftProducts: draftCount,
        productsWithoutStatus: noStatusCount,
        productsWithVariants: productsWithVariants.length,
      },
      products: allProducts.map((p: any) => ({
        _id: String(p._id),
        name: p.name || 'Unnamed',
        category: p.category || 'N/A',
        status: p.status || 'NO STATUS',
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      productsWithVariants: productsWithVariants.map((p: any) => ({
        _id: String(p._id),
        name: p.name || 'Unnamed',
        variantCount: p.variantPricing?.length || 0,
      })),
      databaseInfo: {
        connectionString: process.env.MONGODB_URI ? 
          process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 
          'Not set',
      }
    });
  } catch (error) {
    console.error('[Debug DB] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
