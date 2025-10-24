import { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import ProductsStructuredData from './ProductsStructuredData';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
  title: "All Products - Garment Accessories | Shree Balaji Enterprises",
  description: "Browse our complete collection of premium garment accessories including buttons, zippers, elastic bands, and cotton cords. Quality products for professional garment making.",
  keywords: "garment accessories products Mumbai, button products wholesale, zipper products supplier, elastic band products, cotton cord products, garment accessories catalog, buttons zippers elastic cords, Mumbai garment accessories, manufacturer products, supplier catalog, wholesale garment accessories, bulk garment accessories, quality buttons supplier, professional zippers manufacturer, elastic bands supplier, cotton cords wholesale, garment accessories India, textile accessories products",
  alternates: {
    canonical: 'https://www.balajisphere.com/products',
  },
  openGraph: {
    title: "All Products - Garment Accessories | Shree Balaji Enterprises",
    description: "Browse our complete collection of premium garment accessories including buttons, zippers, elastic bands, and cotton cords.",
    url: 'https://www.balajisphere.com/products',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "All Products - Garment Accessories | Shree Balaji Enterprises",
    description: "Browse our complete collection of premium garment accessories.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

async function getProducts() {
  try {
    // Use relative URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.balajisphere.com';
    const response = await fetch(`${baseUrl}/api/products`, {
      cache: 'force-cache',
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const searchQuery = params.search || '';
  const category = params.category || '';
  
  const products = await getProducts();
  
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.balajisphere.com/' },
          { name: 'Products', url: 'https://www.balajisphere.com/products' },
        ]}
      />
      <ProductsStructuredData products={products} />
      <ProductsClient products={products} searchQuery={searchQuery} initialCategory={category} />
    </>
  );
} 