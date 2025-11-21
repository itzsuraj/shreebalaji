import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import OfflineOrder from '@/models/OfflineOrder';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const formData = await request.formData();
    
    // Get form fields
    const companyName = formData.get('companyName') as string;
    const contactPerson = formData.get('contactPerson') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const postalCode = formData.get('postalCode') as string;
    const gstin = formData.get('gstin') as string;
    const poNumber = formData.get('poNumber') as string;
    const itemDescription = formData.get('itemDescription') as string;
    const notes = formData.get('notes') as string;
    
    // Get uploaded file (optional)
    const file: File | null = formData.get('poFile') as unknown as File;
    
    // Validation
    if (!companyName || !contactPerson || !email || !phone) {
      return NextResponse.json(
        { error: 'Company name, contact person, email, and phone are required' },
        { status: 400 }
      );
    }
    
    if (!poNumber) {
      return NextResponse.json(
        { error: 'PO Number is required' },
        { status: 400 }
      );
    }
    
    // Either file or description must be provided
    if (!file && !itemDescription?.trim()) {
      return NextResponse.json(
        { error: 'Please upload a Purchase Order file or provide item description' },
        { status: 400 }
      );
    }
    
    let fileUrl: string | undefined;
    let fileName: string | undefined;
    
    // Handle file upload if provided
    if (file) {
      // Validate file type (PDF or image)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'File must be a PDF or image (JPG, PNG, WEBP)' },
          { status: 400 }
        );
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size must be less than 10MB' },
          { status: 400 }
        );
      }
      
      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads/po directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'po');
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `po-${timestamp}-${sanitizedFileName}`;
      const filePath = join(uploadsDir, filename);
      
      // Write file to disk
      await writeFile(filePath, buffer);
      
      // Create public URL
      fileUrl = `/uploads/po/${filename}`;
      fileName = file.name;
    }
    
    // Save to database
    const offlineOrder = await OfflineOrder.create({
      companyName,
      contactPerson,
      email,
      phone,
      address: address || undefined,
      city: city || undefined,
      state: state || undefined,
      postalCode: postalCode || undefined,
      gstin: gstin || undefined,
      poNumber,
      poFile: fileUrl,
      poFileName: fileName,
      itemDescription: itemDescription?.trim() || undefined,
      notes: notes || undefined,
      status: 'pending',
    });
    
    return NextResponse.json({
      success: true,
      message: 'Purchase Order submitted successfully',
      orderId: offlineOrder._id.toString(),
    });
    
  } catch (error) {
    console.error('PO upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload Purchase Order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

