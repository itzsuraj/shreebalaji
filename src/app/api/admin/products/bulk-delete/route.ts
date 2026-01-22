import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { ids } = body as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid product IDs' }, { status: 400 });
    }

    const result = await Product.deleteMany({ _id: { $in: ids } });
    
    // Aggressively revalidate all product-related pages after bulk deletion
    revalidatePath('/products', 'page');
    revalidatePath('/', 'page');
    // Revalidate individual product pages for deleted products
    ids.forEach(id => {
      revalidatePath(`/products/${id}`, 'page');
    });
    // Revalidate category pages
    revalidatePath('/products?category=buttons', 'page');
    revalidatePath('/products?category=zippers', 'page');
    revalidatePath('/products?category=elastic', 'page');
    revalidatePath('/products?category=cords', 'page');
    
    return NextResponse.json({ 
      ok: true, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Bulk delete products error:', error);
    return NextResponse.json({ error: 'Failed to delete products' }, { status: 500 });
  }
}

