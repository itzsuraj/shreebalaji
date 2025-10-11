import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const body = await req.json();
  const updated = await Product.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json({ product: updated });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}









