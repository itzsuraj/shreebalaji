import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

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

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
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
        console.warn('Filesystem is read-only, falling back to inline image storage');
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
        return NextResponse.json({
          success: true,
          imageUrl: base64Image,
          message: 'Image stored inline because server storage is read-only',
          storage: 'inline'
        });
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




