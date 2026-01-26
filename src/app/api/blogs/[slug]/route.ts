import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/Blog';

// GET - Get single blog post by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    const blog = await Blog.findOne({ 
      slug,
      status: 'published'
    }).lean();
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
