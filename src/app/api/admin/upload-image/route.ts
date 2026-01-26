import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminToken = request.cookies.get('admin_token')?.value;
    const expectedToken = process.env.ADMIN_TOKEN;
    if (!adminToken || !expectedToken || adminToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Check if we're on Vercel (production)
    const isVercel = !!process.env.VERCEL;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    const isLocal = !isVercel && process.env.NODE_ENV !== 'production';
    
    // Only use Blob Storage on Vercel (production)
    // In local development, always use disk storage to avoid errors
    if (isVercel && blobToken) {
      try {
        console.log('Uploading to Vercel Blob Storage...', { filename, size: buffer.length, type: file.type });
        // @vercel/blob automatically uses BLOB_READ_WRITE_TOKEN from env
        const blob = await put(`uploads/${filename}`, buffer, {
          access: 'public',
          contentType: file.type,
        });
        
        console.log('Upload successful to Blob Storage:', blob.url);
        return NextResponse.json({ 
          success: true, 
          imageUrl: blob.url,
          message: 'Image uploaded successfully to cloud storage',
          storage: 'blob'
        });
      } catch (blobError) {
        console.error('Vercel Blob upload failed:', {
          error: blobError,
          message: blobError instanceof Error ? blobError.message : 'Unknown error',
          name: blobError instanceof Error ? blobError.name : 'Unknown'
        });
        
        // On Vercel, if blob fails, return error (disk will fail anyway)
        return NextResponse.json({
          error: 'Failed to upload to Vercel Blob Storage',
          details: blobError instanceof Error ? blobError.message : 'Unknown blob storage error',
          suggestion: 'Please check Vercel logs and ensure BLOB_READ_WRITE_TOKEN is set correctly'
        }, { status: 500 });
      }
    }
    
    // Use disk storage for local development
    if (isLocal) {
      console.log('Using local disk storage for development...');
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
        const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
        return NextResponse.json({
          error: 'Server storage is read-only. Vercel Blob Storage is required.',
          details: hasBlobToken 
            ? 'Blob token is set but upload failed. Please check Vercel Blob Storage configuration.'
            : 'BLOB_READ_WRITE_TOKEN environment variable is not set. Please configure it in Vercel dashboard.',
          code: errorCode,
          blobTokenConfigured: hasBlobToken,
          setupInstructions: hasBlobToken
            ? 'Blob token exists but upload failed. Check Vercel logs for details.'
            : 'Go to Vercel Dashboard > Your Project > Settings > Environment Variables > Add BLOB_READ_WRITE_TOKEN (it should be auto-generated when you create a Blob store).'
        }, { status: 500 });
      }
      throw writeError;
    }

  } catch (error) {
    console.error('Error uploading image:', error);
    // Don't expose internal error details in production
    const errorMessage = process.env.NODE_ENV === 'production'
      ? 'Failed to upload image'
      : `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return NextResponse.json({ 
      error: errorMessage
    }, { status: 500 });
  }
}




