import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  await connectToDatabase();
  const products = await Product.find().sort({ createdAt: -1 }).limit(200);
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
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
}









