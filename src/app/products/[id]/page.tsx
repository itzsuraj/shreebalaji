import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';
import ProductStructuredData from './ProductStructuredData';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import EnhancedProductDetail from '@/components/EnhancedProductDetail';

async function getProduct(id: string) {
  try {
    await connectToDatabase();
    
    // Use lean() to get a plain JavaScript object instead of Mongoose document
    // Only fetch active products for storefront
    // Select only needed fields for better performance
    const product = await Product.findOne({ _id: id, status: 'active' })
      .select('_id name description price category image sizes colors packs variantPricing stockQty rating reviews createdAt updatedAt')
      .lean() as any;
    
    if (!product) {
      return null;
    }
    
    // Recalculate inStock based on actual stock (same logic as API)
    const hasVariants = product.variantPricing && Array.isArray(product.variantPricing) && product.variantPricing.length > 0;
    let calculatedInStock = false;
    
    if (hasVariants) {
      // Check if any variant has stock
      calculatedInStock = product.variantPricing.some((v: any) => 
        (v.stockQty ?? 0) > 0 || v.inStock === true
      );
    } else {
      // Check product-level stock
      calculatedInStock = (product.stockQty ?? 0) > 0;
    }
    
    // Convert to plain object with proper serialization
    const productData = {
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
            image: v.image ? String(v.image) : undefined
          }))
        : [],
      inStock: Boolean(calculatedInStock),
      stockQty: Number(product.stockQty || 0),
      rating: Number(product.rating || 4.5),
      reviews: Number(product.reviews || 0),
      createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString()
    };
    
    return productData;
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