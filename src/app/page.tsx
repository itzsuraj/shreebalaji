import { Metadata } from 'next';
import HomeClient from './HomeClient';

import type { Product } from '@/types/product';

async function getProductsSSR(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.balajisphere.com';
    const res = await fetch(`${baseUrl}/api/products`, { 
      cache: 'force-cache',
      next: { revalidate: 30 } // Cache for 30 seconds - faster updates
    });
    if (!res.ok) return [] as Product[];
    const data = await res.json();
    return Array.isArray(data.products) ? (data.products as Product[]) : [];
  } catch {
    return [] as Product[];
  }
}

export const metadata: Metadata = {
  title: "Shree Balaji Enterprises - Garment Accessories Mumbai",
  description: "Premium garment accessories manufacturer in Mumbai. Quality buttons, zippers, elastic bands & cotton cords. Bulk orders welcome. Contact +91 9372268410",
  keywords: "garment accessories manufacturer Mumbai, button manufacturer Mumbai, zipper supplier Mumbai, elastic band manufacturer India, cotton cord supplier Mumbai, garment accessories wholesale Mumbai, metal buttons for garments, nylon coil zippers, invisible zippers, waistband elastic, drawstring cords, garment accessories bulk order, textile industry supplier, garment making accessories, quality buttons Mumbai, professional zippers supplier, elastic bands wholesale, cotton cords manufacturer, garment accessories India, Mumbai textile accessories",
  alternates: {
    canonical: 'https://www.balajisphere.com',
  },
  openGraph: {
    title: "Shree Balaji Enterprises - Premium Garment Accessories Manufacturer",
    description: "Leading manufacturer of premium garment accessories in Mumbai. Quality buttons, zippers, elastic bands, and cotton cords.",
    url: 'https://www.balajisphere.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shree Balaji Enterprises - Premium Garment Accessories Manufacturer",
    description: "Leading manufacturer of premium garment accessories in Mumbai.",
  },
};

export default async function Home() {
  const products = await getProductsSSR();
  const featured = products.slice(0, 8);

  // ItemList JSON-LD for featured products
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: 'Featured Garment Accessories',
    url: 'https://www.balajisphere.com/',
    numberOfItems: featured.length,
    itemListElement: featured.map((p, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        url: `https://www.balajisphere.com/products/${(p as unknown as { _id?: string })._id || p.id}`,
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeClient initialProducts={products} />
    </>
  );
}
