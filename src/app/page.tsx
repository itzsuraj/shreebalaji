import { Metadata } from 'next';
import HomeClient from './HomeClient';
import { connectToDatabase } from '@/lib/db';
import ProductModel from '@/models/Product';

import type { Product } from '@/types/product';

async function getProductsSSR(): Promise<Product[]> {
  try {
    await connectToDatabase();

    // Only fetch active products for the storefront home page
    const products = await ProductModel.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .lean();

    if (!products || !Array.isArray(products)) {
      return [];
    }

    // Normalize data shape to match Product type
    const normalized: Product[] = products.map((product: any) => {
      const hasVariants =
        product.variantPricing &&
        Array.isArray(product.variantPricing) &&
        product.variantPricing.length > 0;

      let calculatedInStock = false;
      if (hasVariants) {
        calculatedInStock = product.variantPricing.some(
          (v: any) => (v.stockQty ?? 0) > 0 || v.inStock === true,
        );
      } else {
        calculatedInStock = (product.stockQty ?? 0) > 0;
      }

      return {
        // IDs
        _id: String(product._id),
        id: String(product._id),
        // Basic fields
        name: String(product.name || ''),
        description: String(product.description || ''),
        price: Number(product.price || 0),
        category: String(product.category || ''),
        image: String(product.image || ''),
        // Options / variants
        sizes: Array.isArray(product.sizes) ? product.sizes.map(String) : [],
        colors: Array.isArray(product.colors) ? product.colors.map(String) : [],
        packs: Array.isArray(product.packs) ? product.packs.map(String) : [],
        variantPricing: Array.isArray(product.variantPricing)
          ? product.variantPricing.map((v: any) => ({
              size: v.size ? String(v.size) : undefined,
              color: v.color ? String(v.color) : undefined,
              pack: v.pack ? String(v.pack) : undefined,
              price: Number(v.price || 0),
              stockQty: Number(v.stockQty || 0),
              inStock: Boolean(v.inStock),
              sku: v.sku ? String(v.sku) : undefined,
              image: v.image ? String(v.image) : undefined,
            }))
          : [],
        // Stock
        inStock: Boolean(calculatedInStock),
        stockQty: Number(product.stockQty || 0),
        // Misc
        rating: Number(product.rating || 4.5),
        reviews: Number(product.reviews || 0),
        // Dates
        createdAt: product.createdAt
          ? new Date(product.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: product.updatedAt
          ? new Date(product.updatedAt).toISOString()
          : new Date().toISOString(),
      };
    });

    return normalized;
  } catch (err) {
    console.error('Error fetching products for home page:', err);
    return [];
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
