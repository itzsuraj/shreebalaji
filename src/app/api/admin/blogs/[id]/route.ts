import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';
import { rateLimiters } from '@/lib/rateLimit';
import { validateCSRFRequest } from '@/lib/csrf';
import { sanitizeObject } from '@/lib/sanitize';

// GET - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }
    
    const blog = await Blog.findById(id).lean();
    
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

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimiters.adminAPI(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
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
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Sanitize HTML content to prevent XSS
    const sanitizedBody = sanitizeObject(body, ['content', 'excerpt', 'title', 'seoTitle', 'seoDescription', 'seoKeywords']);
    const { title, slug, excerpt, content, category, featuredImage, author, readTime, status, seoTitle, seoDescription, seoKeywords, relatedProducts, tags } = sanitizedBody;
    
    const updateData: any = {
      title,
      slug,
      excerpt,
      content,
      category: category || 'Industry',
      featuredImage,
      author: author || 'Shree Balaji Enterprises',
      readTime: readTime || '5 min read',
      status: status || 'draft',
      seoTitle,
      seoDescription,
      seoKeywords,
      relatedProducts: relatedProducts || [],
      tags: tags || []
    };
    
    // If changing status to published and not already published, set publishedAt
    const existingBlog = await Blog.findById(id);
    if (status === 'published' && existingBlog?.status !== 'published') {
      updateData.publishedAt = new Date();
    } else if (status === 'draft') {
      updateData.publishedAt = null;
    }
    
    const blog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      blog 
    });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
    }
    const errorMessage = process.env.NODE_ENV === 'production'
      ? 'Failed to update blog post'
      : `Failed to update blog post: ${error.message}`;
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimiters.adminAPI(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
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
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }
    
    const blog = await Blog.findByIdAndDelete(id);
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
