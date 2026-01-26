import { Metadata } from 'next';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/Blog';
import { normalizeImagePath } from '@/utils/imageUtils';

export const metadata: Metadata = {
  title: "Blog - Garment Accessories Industry Insights | Shree Balaji Enterprises",
  description: "Stay updated with the latest trends, tips, and insights in the garment accessories industry. Expert articles on buttons, zippers, elastic, and cords.",
  keywords: "garment accessories blog, textile industry, buttons, zippers, elastic, cords, manufacturing tips, industry insights",
  alternates: {
    canonical: 'https://www.balajisphere.com/blog',
  },
  openGraph: {
    title: "Blog - Garment Accessories Industry Insights | Shree Balaji Enterprises",
    description: "Stay updated with the latest trends and insights in the garment accessories industry.",
    url: 'https://www.balajisphere.com/blog',
    type: 'website',
  },
};

async function getBlogPosts() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(50)
      .lean();
    return blogs.map(blog => ({
      _id: String(blog._id),
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      readTime: blog.readTime,
      publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
      featuredImage: blog.featuredImage || '/banner.png'
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Industry Insights & Tips</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay updated with the latest trends, techniques, and insights in the garment accessories industry. 
          Expert articles to help you make informed decisions.
        </p>
      </div>

      {blogPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No blog posts available yet.</p>
          <p className="text-sm text-gray-500">Check back soon for industry insights and tips!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => {
            const imagePath = normalizeImagePath(post.featuredImage) || '/banner.png';
            return (
              <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/blog/${post.slug}`}>
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {imagePath ? (
                      <Image
                        src={imagePath}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2 flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="mx-1">•</span>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                    <span className="mx-1">•</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Want to stay updated with our latest articles?
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Subscribe to Newsletter
        </button>
      </div>
    </div>
  );
} 