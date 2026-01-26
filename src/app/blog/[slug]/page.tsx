import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { sanitizeHTML } from '@/lib/sanitize';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/Blog';
import { normalizeImagePath } from '@/utils/imageUtils';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage?: string;
  author: string;
  readTime: string;
  status: 'draft' | 'published';
  publishedAt?: string | Date;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  tags?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    await connectToDatabase();
    const blog = await Blog.findOne({ slug, status: 'published' }).lean() as any;
    if (!blog) return null;
    return {
      _id: String(blog._id),
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      featuredImage: blog.featuredImage,
      author: blog.author,
      readTime: blog.readTime,
      status: blog.status,
      publishedAt: blog.publishedAt,
      seoTitle: blog.seoTitle,
      seoDescription: blog.seoDescription,
      seoKeywords: blog.seoKeywords,
      tags: blog.tags || [],
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = await getBlogPost(resolvedParams.slug);
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found - Shree Balaji Enterprises',
      description: 'The requested blog post could not be found.',
    };
  }

  const title = blog.seoTitle || `${blog.title} | Shree Balaji Enterprises`;
  const description = blog.seoDescription || blog.excerpt;
  const canonical = `https://www.balajisphere.com/blog/${blog.slug}`;
  const image = blog.featuredImage ? (normalizeImagePath(blog.featuredImage) || '/banner.png') : '/banner.png';

  return {
    title,
    description: description.slice(0, 160),
    keywords: blog.seoKeywords || blog.tags?.join(', '),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
      authors: [blog.author],
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = await getBlogPost(resolvedParams.slug);

  if (!blog) {
    notFound();
  }

  const imagePath = normalizeImagePath(blog.featuredImage) || '/banner.png';
  const publishedDate = blog.publishedAt ? new Date(blog.publishedAt) : new Date(blog.createdAt || Date.now());

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog
      </Link>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Featured Image */}
        {imagePath && (
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={imagePath}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Category and Meta */}
          <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap gap-3">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              {blog.category}
            </span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {publishedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {blog.readTime}
            </div>
            {blog.author && (
              <>
                <span>•</span>
                <span>By {blog.author}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(blog.content) }}
          />

          {/* Share Section */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-600 mb-3">Share this article:</p>
            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://www.balajisphere.com/blog/${blog.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=https://www.balajisphere.com/blog/${blog.slug}&text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://www.balajisphere.com/blog/${blog.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 text-sm"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">More Articles</h2>
        <Link 
          href="/blog"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View All Blog Posts →
        </Link>
      </div>
    </div>
  );
}
