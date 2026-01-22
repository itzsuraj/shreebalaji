import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    // Preserve all variant fields including image
    type VariantInput = { 
      stockQty?: number; 
      inStock?: boolean; 
      image?: string;
      size?: string;
      color?: string;
      pack?: string;
      quality?: string;
      quantity?: string;
      price?: number;
      sku?: string;
    };
    const doc = { ...body } as { stockQty?: number; inStock?: boolean; variantPricing?: VariantInput[] };
    const variantHasStock = Array.isArray(doc.variantPricing) && doc.variantPricing.some((v) => (v?.stockQty ?? 0) > 0 || v?.inStock === true);
    const productHasStock = (doc.stockQty ?? 0) > 0;
    doc.inStock = Boolean(productHasStock || variantHasStock);
    // Preserve or default status if not explicitly set
    if (!('status' in doc) || !doc.status) {
      // @ts-expect-error - status exists in schema
      doc.status = 'active';
    }
    // Use $set to ensure all fields including variant images are preserved
    const updated = await Product.findByIdAndUpdate(id, doc, { new: true, runValidators: true });
    
    // Aggressively revalidate all product-related pages after update
    revalidatePath('/products', 'page');
    revalidatePath('/', 'page');
    revalidatePath(`/products/${id}`, 'page');
    // Revalidate category pages
    revalidatePath('/products?category=buttons', 'page');
    revalidatePath('/products?category=zippers', 'page');
    revalidatePath('/products?category=elastic', 'page');
    revalidatePath('/products?category=cords', 'page');
    
    return NextResponse.json({ product: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await Product.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Aggressively revalidate all product-related pages after deletion
    revalidatePath('/products', 'page');
    revalidatePath('/', 'page');
    revalidatePath(`/products/${id}`, 'page');
    // Revalidate category pages
    revalidatePath('/products?category=buttons', 'page');
    revalidatePath('/products?category=zippers', 'page');
    revalidatePath('/products?category=elastic', 'page');
    revalidatePath('/products?category=cords', 'page');
    
    return NextResponse.json({ ok: true, deletedId: id });
  } catch (error) {
    console.error('Delete product error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}









