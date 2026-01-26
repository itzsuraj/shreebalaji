'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import { useCSRF } from '@/hooks/useCSRF';
import DeleteModal from '@/components/ui/DeleteModal';
import { sanitizeHTML, sanitizeText } from '@/lib/sanitize';

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
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; blogId: string | null; blogTitle: string | null }>({
    isOpen: false,
    blogId: null,
    blogTitle: null
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { showError, showSuccess, showWarning } = useToast();
  const { getHeaders } = useCSRF();
  
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Industry',
    featuredImage: '',
    author: 'Shree Balaji Enterprises',
    readTime: '5 min read',
    status: 'draft' as 'draft' | 'published',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    tags: [] as string[]
  });

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (searchQuery) params.append('search', searchQuery);
      
      const res = await fetch(`/api/admin/blogs?${params.toString()}`);
      if (!res.ok) {
        showError('Failed to load blog posts');
        return;
      }
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
      showError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchQuery, showError]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Industry',
      featuredImage: '',
      author: 'Shree Balaji Enterprises',
      readTime: '5 min read',
      status: 'draft',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      tags: []
    });
    setEditingBlog(null);
    setShowForm(false);
  };

  const startEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      featuredImage: blog.featuredImage || '',
      author: blog.author,
      readTime: blog.readTime,
      status: blog.status,
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || '',
      seoKeywords: blog.seoKeywords || '',
      tags: blog.tags || []
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      showWarning('Please enter a title');
      return;
    }
    if (!form.slug.trim()) {
      showWarning('Please enter a slug');
      return;
    }
    if (!form.excerpt.trim()) {
      showWarning('Please enter an excerpt');
      return;
    }
    if (!form.content.trim()) {
      showWarning('Please enter content');
      return;
    }

    try {
      const url = editingBlog 
        ? `/api/admin/blogs/${editingBlog._id}`
        : '/api/admin/blogs';
      
      const method = editingBlog ? 'PUT' : 'POST';
      
      // Sanitize form data before sending
      const sanitizedForm = {
        ...form,
        title: sanitizeText(form.title),
        excerpt: sanitizeText(form.excerpt),
        content: sanitizeHTML(form.content),
        seoTitle: form.seoTitle ? sanitizeText(form.seoTitle) : '',
        seoDescription: form.seoDescription ? sanitizeText(form.seoDescription) : '',
        seoKeywords: form.seoKeywords ? sanitizeText(form.seoKeywords) : '',
      };
      
      const res = await fetch(url, {
        method,
        headers: await getHeaders(),
        body: JSON.stringify(sanitizedForm)
      });

      if (!res.ok) {
        const data = await res.json();
        showError(data.error || 'Failed to save blog post');
        return;
      }

      showSuccess(editingBlog ? 'Blog post updated successfully' : 'Blog post created successfully');
      resetForm();
      loadBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      showError('Failed to save blog post');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.blogId) return;
    
    try {
      const res = await fetch(`/api/admin/blogs/${deleteModal.blogId}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });

      if (!res.ok) {
        showError('Failed to delete blog post');
        return;
      }

      showSuccess('Blog post deleted successfully');
      setDeleteModal({ isOpen: false, blogId: null, blogTitle: null });
      loadBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      showError('Failed to delete blog post');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB');
      return;
    }
      showError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const headers = await getHeaders();
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': headers['X-CSRF-Token'],
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data?.imageUrl) {
        setForm(prev => ({ ...prev, featuredImage: data.imageUrl }));
        showSuccess('Image uploaded successfully');
      } else {
        showError(data?.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      showError('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const categories = ['Buttons', 'Zippers', 'Elastic', 'Cords', 'Industry', 'Tips', 'Market Trends', 'Product Updates'];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Blog Post
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md flex-1"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Blog Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  setForm(prev => ({ 
                    ...prev, 
                    title: e.target.value,
                    slug: prev.slug || generateSlug(e.target.value)
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                placeholder="blog-post-url-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
                placeholder="Short description for blog listing..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={15}
                required
                placeholder="Full blog content (HTML supported)..."
              />
              <p className="text-xs text-gray-500 mt-1">You can use HTML tags for formatting</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => setForm(prev => ({ ...prev, readTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="5 min read"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-700 mb-2"
              />
              {isUploadingImage && <p className="text-sm text-blue-600">Uploading...</p>}
              {form.featuredImage && (
                <div className="mt-2">
                  <img src={form.featuredImage} alt="Featured" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => setForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="SEO optimized title (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <textarea
                value={form.seoDescription}
                onChange={(e) => setForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
                placeholder="SEO meta description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords</label>
              <input
                type="text"
                value={form.seoKeywords}
                onChange={(e) => setForm(prev => ({ ...prev, seoKeywords: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={form.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                  setForm(prev => ({ ...prev, tags }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="garment accessories, buttons, manufacturing"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                {editingBlog ? 'Update' : 'Create'} Blog Post
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog List */}
      {loading ? (
        <div className="text-center py-12">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No blog posts found</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{blog.title}</div>
                    <div className="text-sm text-gray-500">{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{blog.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      blog.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {blog.publishedAt 
                      ? new Date(blog.publishedAt).toLocaleDateString()
                      : 'Not published'
                    }
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(blog)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, blogId: blog._id, blogTitle: blog.title })}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                      {blog.status === 'published' && (
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, blogId: null, blogTitle: null })}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteModal.blogTitle}"? This action cannot be undone.`}
      />
    </div>
  );
}
