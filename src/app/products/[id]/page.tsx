import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getProductImage } from '@/utils/imageUtils';
import Link from 'next/link';
import { Metadata } from 'next';
import ProductStructuredData from './ProductStructuredData';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import EnhancedProductDetail from '@/components/EnhancedProductDetail';

async function getProduct(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.balajisphere.com';
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store' // Always fetch fresh data
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
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: 'Product Not Found - Shree Balaji Enterprises',
    };
  }

  const canonicalUrl = `https://www.balajisphere.com/products/${resolvedParams.id}`;

  return {
    title: `${product.name} - Shree Balaji Enterprises`,
    description: product.description,
    keywords: `${product.name}, ${product.category} manufacturer Mumbai, ${product.category} supplier India, ${product.category} wholesale, garment accessories ${product.category}, quality ${product.category} Mumbai, professional ${product.category} supplier, ${product.category} bulk order, garment accessories manufacturer, textile accessories ${product.category}, Mumbai garment accessories, India garment accessories supplier`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} - Shree Balaji Enterprises`,
      description: product.description,
      url: canonicalUrl,
      images: [
        {
          url: getProductImage(product),
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Shree Balaji Enterprises`,
      description: product.description,
      images: [getProductImage(product)],
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
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.balajisphere.com/' },
          { name: 'Products', url: 'https://www.balajisphere.com/products' },
          { name: product.name, url: `https://www.balajisphere.com/products/${product.id}` },
        ]}
      />
      <ProductStructuredData product={product} />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/products" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
        
        {/* Enhanced Product Detail */}
        <EnhancedProductDetail product={product} />

      </div>
    </>
  );
} 