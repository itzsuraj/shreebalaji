import { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import ProductsStructuredData from './ProductsStructuredData';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

// Force this page to be dynamic so it always uses fresh product data
export const dynamic = 'force-dynamic';

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
    // Use direct database query instead of API call for faster SSR
    const { connectToDatabase } = await import('@/lib/db');
    const ProductModel = (await import('@/models/Product')).default;
    
    await connectToDatabase();
    
    // Fetch active products OR products without status (treat missing status as active for backward compatibility)
    let products = await ProductModel.find({
      $or: [
        { status: 'active' },
        { status: { $exists: false } },
        { status: null },
        { status: '' }
      ]
    })
      .select('_id name description price category image sizes colors packs variantPricing stockQty rating reviews createdAt updatedAt status')
      .sort({ createdAt: -1 })
      .lean()
      .limit(100);
    
    // Log for debugging
    console.log(`[Products Page] Found ${products?.length || 0} active/missing-status products`);
    
    if (!products || products.length === 0) {
      const allProducts = await ProductModel.find({})
        .select('_id name description price category image sizes colors packs variantPricing stockQty rating reviews createdAt updatedAt status')
        .sort({ createdAt: -1 })
        .lean()
        .limit(100);
      
      console.log(`[Products Page] No active products found. Total products in DB: ${allProducts?.length || 0}`);
      console.log(`[Products Page] Product statuses:`, allProducts?.map((p: any) => ({ name: p.name, status: p.status })));
      
      products = allProducts;
    }
    
    // Normalize products
    return products.map((product: any) => {
      const hasVariants = product.variantPricing && Array.isArray(product.variantPricing) && product.variantPricing.length > 0;
      let calculatedInStock = false;
      
      if (hasVariants) {
        calculatedInStock = product.variantPricing.some((v: any) => 
          (v.stockQty ?? 0) > 0 || v.inStock === true
        );
      } else {
        calculatedInStock = (product.stockQty ?? 0) > 0;
      }
      
      return {
        _id: String(product._id),
        id: String(product._id),
        name: String(product.name || ''),
        description: String(product.description || ''),
        price: Number(product.price || 0),
        category: String(product.category || ''),
        image: String(product.image || ''),
        sizes: Array.isArray(product.sizes) ? product.sizes.map(String) : [],
        colors: Array.isArray(product.colors) ? product.colors.map(String) : [],
        packs: Array.isArray(product.packs) ? product.packs.map(String) : [],
        variantPricing: Array.isArray(product.variantPricing) 
          ? product.variantPricing.map((v: any) => ({
              size: v.size ? String(v.size) : undefined,
              color: v.color ? String(v.color) : undefined,
              pack: v.pack ? String(v.pack) : undefined,
              quality: v.quality ? String(v.quality) : undefined,
              quantity: v.quantity ? String(v.quantity) : undefined,
              price: Number(v.price || 0),
              stockQty: Number(v.stockQty || 0),
              inStock: Boolean(v.inStock),
              sku: v.sku ? String(v.sku) : undefined,
              image: v.image ? String(v.image) : undefined,
            }))
          : [],
        inStock: Boolean(calculatedInStock),
        stockQty: Number(product.stockQty || 0),
        rating: Number(product.rating || 4.5),
        reviews: Number(product.reviews || 0),
        createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
      };
    });
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