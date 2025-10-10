import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';

export async function GET() {
  await connectToDatabase();
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
  return NextResponse.json({ orders });
}


