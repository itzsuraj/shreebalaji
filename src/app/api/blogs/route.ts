import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/Blog';

// GET - List published blog posts for public
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    const query: any = { status: 'published' };
    if (category) query.category = category;
    
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content') // Don't send full content in list
        .lean(),
      Blog.countDocuments(query)
    ]);
    
    return NextResponse.json({ 
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
