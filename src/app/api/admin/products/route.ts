import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 }).limit(200).lean();
    
    // Log for debugging
    console.log(`[Admin Products API] Found ${products?.length || 0} products in database`);
    if (products && products.length > 0) {
      console.log(`[Admin Products API] Product names:`, products.map((p: any) => p.name));
      console.log(`[Admin Products API] Product statuses:`, products.map((p: any) => ({ name: p.name, status: p.status })));
    }
    
    return NextResponse.json({ products: products || [] });
  } catch (error) {
    console.error('[Admin Products API] Error fetching products:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch products',
      products: [] 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    // Derive inStock from stock fields
    type VariantInput = { stockQty?: number; inStock?: boolean };
    const doc = { ...body } as { stockQty?: number; inStock?: boolean; variantPricing?: VariantInput[] };
    const variantHasStock = Array.isArray(doc.variantPricing) && doc.variantPricing.some((v) => (v?.stockQty ?? 0) > 0 || v?.inStock === true);
    const productHasStock = (doc.stockQty ?? 0) > 0;
    doc.inStock = Boolean(productHasStock || variantHasStock);
    // Default status to active if not provided
    // (admin UI will send 'active' or 'draft')
    if (!('status' in doc) || !doc.status) {
      // @ts-expect-error - status exists in schema
      doc.status = 'active';
    }
    const created = await Product.create(doc);
    
    // Revalidate cache after creating new product
    revalidatePath('/products');
    revalidatePath('/');
    
    return NextResponse.json({ product: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}









