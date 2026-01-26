import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/Blog';
import { rateLimiters } from '@/lib/rateLimit';
import { validateCSRFRequest } from '@/lib/csrf';
import { sanitizeObject } from '@/lib/sanitize';

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
      // Sanitize regex to prevent ReDoS attacks
      const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: sanitizedSearch, $options: 'i' } },
        { excerpt: { $regex: sanitizedSearch, $options: 'i' } },
        { content: { $regex: sanitizedSearch, $options: 'i' } }
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
    // Rate limiting
    const rateLimitResult = rateLimiters.adminAPI(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          }
        }
      );
    }

    // Authentication
    const adminToken = request.cookies.get('admin_token')?.value;
    const expectedToken = process.env.ADMIN_TOKEN;
    if (!adminToken || !expectedToken || adminToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // CSRF protection
    if (!validateCSRFRequest(request)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }
    
    await connectToDatabase();
    const body = await request.json();
    
    // Sanitize HTML content to prevent XSS
    const sanitizedBody = sanitizeObject(body, ['content', 'excerpt', 'title', 'seoTitle', 'seoDescription', 'seoKeywords']);
    
    const { title, slug, excerpt, content, category, featuredImage, author, readTime, status, seoTitle, seoDescription, seoKeywords, relatedProducts, tags } = sanitizedBody;
    
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
    // Don't expose internal error details in production
    const errorMessage = process.env.NODE_ENV === 'production'
      ? 'Failed to create blog post'
      : `Failed to create blog post: ${error.message}`;
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
