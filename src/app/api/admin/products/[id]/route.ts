import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    type VariantInput = { stockQty?: number; inStock?: boolean };
    const doc = { ...body } as { stockQty?: number; inStock?: boolean; variantPricing?: VariantInput[] };
    const variantHasStock = Array.isArray(doc.variantPricing) && doc.variantPricing.some((v) => (v?.stockQty ?? 0) > 0 || v?.inStock === true);
    const productHasStock = (doc.stockQty ?? 0) > 0;
    doc.inStock = Boolean(productHasStock || variantHasStock);
    // Preserve or default status if not explicitly set
    if (!('status' in doc) || !doc.status) {
      // @ts-expect-error - status exists in schema
      doc.status = 'active';
    }
    const updated = await Product.findByIdAndUpdate(id, doc, { new: true });
    
    // Revalidate cache for immediate visibility
    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath(`/products/${id}`);
    
    return NextResponse.json({ product: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  await Product.findByIdAndDelete(id);
  
  // Revalidate cache after deletion
  revalidatePath('/products');
  revalidatePath('/');
  revalidatePath(`/products/${id}`);
  
  return NextResponse.json({ ok: true });
}









