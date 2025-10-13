import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const body = await req.json();
  type VariantInput = { stockQty?: number; inStock?: boolean };
  const doc = { ...body } as { stockQty?: number; inStock?: boolean; variantPricing?: VariantInput[] };
  const variantHasStock = Array.isArray(doc.variantPricing) && doc.variantPricing.some((v) => (v?.stockQty ?? 0) > 0 || v?.inStock === true);
  const productHasStock = (doc.stockQty ?? 0) > 0;
  doc.inStock = Boolean(productHasStock || variantHasStock);
  const updated = await Product.findByIdAndUpdate(id, doc, { new: true });
  return NextResponse.json({ product: updated });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}









