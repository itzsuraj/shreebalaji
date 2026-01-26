import { NextResponse } from 'next/server';

export async function GET() {
  const hasAdminToken = Boolean(process.env.ADMIN_TOKEN && process.env.ADMIN_TOKEN.length > 0);
  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN.length > 0);
  
  return NextResponse.json({ 
    hasAdminToken,
    hasBlobToken,
    blobTokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    // Don't expose actual token values, just check if they exist
    envVarsWithBlob: Object.keys(process.env).filter(k => k.includes('BLOB')).join(', ') || 'none'
  });
}












