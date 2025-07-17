import { Metadata } from 'next';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

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

const blogPosts = [
  {
    id: 'choosing-right-buttons',
    title: 'How to Choose the Right Buttons for Your Garment',
    excerpt: 'Learn the essential factors to consider when selecting buttons for different types of garments and fabrics.',
    category: 'Buttons',
    readTime: '5 min read',
    date: '2024-01-15',
    image: '/blog/buttons-guide.jpg'
  },
  {
    id: 'zipper-installation',
    title: 'Professional Zipper Installation Techniques',
    excerpt: 'Master the art of installing zippers correctly for a professional finish on your garments.',
    category: 'Zippers',
    readTime: '7 min read',
    date: '2024-01-10',
    image: '/blog/zipper-installation.jpg'
  },
  {
    id: 'elastic-selection',
    title: 'Selecting the Perfect Elastic for Waistbands',
    excerpt: 'A comprehensive guide to choosing the right elastic type and width for different waistband applications.',
    category: 'Elastic',
    readTime: '6 min read',
    date: '2024-01-05',
    image: '/blog/elastic-guide.jpg'
  },
  {
    id: 'quality-standards',
    title: 'Quality Standards in Garment Accessories Manufacturing',
    excerpt: 'Understanding the importance of quality standards and how they impact your final product.',
    category: 'Industry',
    readTime: '8 min read',
    date: '2024-01-01',
    image: '/blog/quality-standards.jpg'
  }
];

export default function BlogPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <span className="text-sm">Image Placeholder</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {post.category}
                </span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {post.readTime}
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <Link 
                href={`/blog/${post.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>

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