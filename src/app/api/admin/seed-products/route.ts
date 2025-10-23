import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';
import { products } from '@/data/products';

export const runtime = 'nodejs';

export async function POST() {
  try {
    await connectToDatabase();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully seeded ${insertedProducts.length} products`);

    // Get statistics
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({ 
      success: true,
      message: `Successfully seeded ${insertedProducts.length} products`,
      statistics: {
        totalProducts: insertedProducts.length,
        categories: categories
      }
    });
  } catch (error) {
    console.error('Error seeding products:', error);
    return NextResponse.json({ 
      error: 'Failed to seed products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}




