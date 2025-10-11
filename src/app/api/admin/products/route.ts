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
  const created = await Product.create(body);
  return NextResponse.json({ product: created });
}









