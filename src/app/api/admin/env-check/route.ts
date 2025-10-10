import { NextResponse } from 'next/server';

export async function GET() {
  const hasToken = Boolean(process.env.ADMIN_TOKEN && process.env.ADMIN_TOKEN.length > 0);
  return NextResponse.json({ hasAdminToken: hasToken });
}







