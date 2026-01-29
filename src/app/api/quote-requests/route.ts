import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import QuoteRequest from '@/models/QuoteRequest';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const {
      companyName,
      contactName,
      email,
      phone,
      quantity,
      message,
      productId,
      productName,
      productCategory,
      productSize,
      productColor,
      productPack,
    } = body;

    // Validate required fields
    if (!companyName || !contactName || !email || !phone) {
      return NextResponse.json(
        { error: 'Company name, contact name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Create quote request
    const quoteRequest = await QuoteRequest.create({
      companyName,
      contactName,
      email,
      phone,
      quantity: quantity || undefined,
      message: message || undefined,
      productId: productId || undefined,
      productName: productName || undefined,
      productCategory: productCategory || undefined,
      productSize: productSize || undefined,
      productColor: productColor || undefined,
      productPack: productPack || undefined,
      status: 'new',
      source: 'website',
    });

    return NextResponse.json(
      { 
        success: true, 
        quoteRequestId: quoteRequest._id.toString(),
        message: 'Quote request submitted successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating quote request:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    
    const query: any = {};
    if (status) {
      query.status = status;
    }
    
    const skip = (page - 1) * limit;
    
    const quoteRequests = await QuoteRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    
    const total = await QuoteRequest.countDocuments(query);
    
    return NextResponse.json({
      quoteRequests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote requests' },
      { status: 500 }
    );
  }
}
