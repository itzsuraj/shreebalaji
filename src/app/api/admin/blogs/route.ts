import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/Blog';

// GET - List all blog posts
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
    
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin_token')?.value;
    const expectedToken = process.env.ADMIN_TOKEN;
    if (!adminToken || !expectedToken || adminToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    const body = await request.json();
    
    const { title, slug, excerpt, content, category, featuredImage, author, readTime, status, seoTitle, seoDescription, seoKeywords, relatedProducts, tags } = body;
    
    // If publishing, set publishedAt
    const publishedAt = status === 'published' ? new Date() : null;
    
    const blog = new Blog({
      title,
      slug,
      excerpt,
      content,
      category: category || 'Industry',
      featuredImage,
      author: author || 'Shree Balaji Enterprises',
      readTime: readTime || '5 min read',
      status: status || 'draft',
      publishedAt,
      seoTitle,
      seoDescription,
      seoKeywords,
      relatedProducts: relatedProducts || [],
      tags: tags || []
    });
    
    await blog.save();
    
    return NextResponse.json({ 
      success: true, 
      blog: blog.toObject() 
    });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create blog post', details: error.message },
      { status: 500 }
    );
  }
}
