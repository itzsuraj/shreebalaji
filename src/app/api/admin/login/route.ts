import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { password } = (await req.json()) as { password?: string };
  const provided = (password ?? '').trim();
  const expected = (process.env.ADMIN_TOKEN ?? '').trim();
  if (!provided || !expected || provided !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_token', expected, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', sameSite: 'lax', maxAge: 60 * 60 * 8 });
  return res;
}


