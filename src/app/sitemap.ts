import { MetadataRoute } from 'next'
import { connectToDatabase } from '@/lib/db'
import Product from '@/models/Product'
import Blog from '@/models/Blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.balajisphere.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },

    {
      url: `${baseUrl}/enquiries`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/technical-support`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/buttons-manufacturer-india`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic product pages from DB (excluding specific products)
  await connectToDatabase();
  const dbProducts = (await Product.find({}, { _id: 1, updatedAt: 1 }).lean()) as Array<{ _id: unknown; updatedAt?: string | Date }>;
  
  // Exclude specific product IDs from sitemap
  const excludedProductIds = ['8', '9', '10', '11', '12', '13', '14', '15'];
  
  const productPages = dbProducts
    .filter((p) => !excludedProductIds.includes(String(p._id)))
    .map((p) => ({
      url: `${baseUrl}/products/${String(p._id)}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt as string | Date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  // Dynamic blog posts from DB
  const dbBlogs = await Blog.find({ status: 'published' }, { slug: 1, publishedAt: 1, updatedAt: 1 }).lean();
  
  const blogPosts = (dbBlogs || []).map((blog: any) => ({
    url: `${baseUrl}/blog/${blog.slug || ''}`,
    lastModified: blog.updatedAt 
      ? new Date(blog.updatedAt as string | Date)
      : blog.publishedAt 
        ? new Date(blog.publishedAt as string | Date)
        : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })).filter((post: any) => post.url.includes('/blog/') && !post.url.endsWith('/blog/'));

  return [...staticPages, ...productPages, ...blogPosts]
} 