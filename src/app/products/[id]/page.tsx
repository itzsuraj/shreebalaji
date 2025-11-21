import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductStructuredData from './ProductStructuredData';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import EnhancedProductDetail from '@/components/EnhancedProductDetail';

async function getProduct(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.balajisphere.com';
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'force-cache',
      next: { revalidate: 30 } // Cache for 30 seconds - faster updates
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Generate metadata for each product
export async function generateMetadata(): Promise<Metadata> {
  // Use a simpler approach for metadata to avoid duplicate API calls
  return {
    title: `Product - Shree Balaji Enterprises`,
    description: 'High-quality garment accessories and textile supplies',
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductStructuredData product={product} />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <BreadcrumbSchema
              items={[
                { name: 'Home', url: '/' },
                { name: 'Products', url: '/products' },
                { name: product.category, url: `/products?category=${encodeURIComponent(product.category)}` },
                { name: product.name, url: `/products/${product.id}` },
              ]}
              showVisualBreadcrumb={true}
            />
          </div>
          
          {/* Enhanced Product Detail */}
          <EnhancedProductDetail product={product} />
        </div>
      </div>
    </>
  );
} 