import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Try Vercel Blob Storage first (for production/cloud deployments)
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      try {
        console.log('Uploading to Vercel Blob Storage...');
        const blob = await put(`uploads/${filename}`, buffer, {
          access: 'public',
          contentType: file.type,
        });
        
        return NextResponse.json({ 
          success: true, 
          imageUrl: blob.url,
          message: 'Image uploaded successfully to cloud storage',
          storage: 'blob'
        });
      } catch (blobError) {
        console.error('Vercel Blob upload failed:', blobError);
        // Fall through to try disk storage
      }
    }

    // Fallback to disk storage (for local development)
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const path = join(uploadsDir, filename);

    try {
      // Create uploads directory if it doesn't exist
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
      }

      // Write file to disk
      await writeFile(path, buffer);

      // Return the public URL
      const imageUrl = `/uploads/${filename}`;
      
      return NextResponse.json({ 
        success: true, 
        imageUrl,
        message: 'Image uploaded successfully',
        storage: 'disk'
      });
    } catch (writeError) {
      const errorCode = (writeError as NodeJS.ErrnoException)?.code;
      if (errorCode === 'EROFS' || errorCode === 'EACCES') {
        console.error('Filesystem is read-only. Vercel Blob Storage is required for production.');
        return NextResponse.json({
          error: 'Server storage is read-only. Please configure Vercel Blob Storage.',
          details: 'The server filesystem is read-only. Please set BLOB_READ_WRITE_TOKEN environment variable in Vercel dashboard.',
          code: errorCode,
          setupInstructions: 'Go to Vercel Dashboard > Your Project > Storage > Create Blob Store, then add BLOB_READ_WRITE_TOKEN to environment variables.'
        }, { status: 500 });
      }
      throw writeError;
    }

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}




