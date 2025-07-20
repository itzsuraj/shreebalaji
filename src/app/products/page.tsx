import { Metadata } from 'next';
import { products } from '@/data/products';
import ProductsClient from './ProductsClient';

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
};

interface ProductsPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const searchQuery = params.search || '';
  
  return <ProductsClient products={products} searchQuery={searchQuery} />;
} 