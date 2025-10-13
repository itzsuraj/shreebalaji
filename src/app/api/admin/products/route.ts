import { NextRequest, NextResponse } from 'next/server';
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
  const created = await Product.create(doc);
  return NextResponse.json({ product: created });
}









