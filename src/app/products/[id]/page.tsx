import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';
import ProductStructuredData from './ProductStructuredData';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import EnhancedProductDetail from '@/components/EnhancedProductDetail';

export const dynamic = 'force-dynamic';

async function getProduct(id: string) {
  try {
    await connectToDatabase();
    
    // Use lean() to get a plain JavaScript object instead of Mongoose document
    // Fetch active products OR products without status (treat missing status as active)
    // Select only needed fields for better performance
    let product = await Product.findOne({
      _id: id,
      $or: [
        { status: 'active' },
        { status: { $exists: false } },
        { status: null },
        { status: '' }
      ]
    })
      .select('_id name description price category image sizes colors packs variantPricing stockQty rating reviews createdAt updatedAt')
      .lean() as any;

    // Fallback to any status to prevent intermittent 404s for existing products
    if (!product) {
      product = await Product.findById(id)
        .select('_id name description price category image sizes colors packs variantPricing stockQty rating reviews createdAt updatedAt')
        .lean() as any;
    }
    
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
        ? product.variantPricing.map((v: any) => {
            // Normalize image path - ensure it starts with / if it's a relative path
            let imagePath = v.image ? String(v.image) : undefined;
            if (imagePath && !imagePath.startsWith('/') && !imagePath.startsWith('http') && !imagePath.startsWith('data:')) {
              imagePath = `/${imagePath}`;
            }
            
            return {
              size: v.size ? String(v.size) : undefined,
              color: v.color ? String(v.color) : undefined,
              pack: v.pack ? String(v.pack) : undefined,
              quality: v.quality ? String(v.quality) : undefined,
              quantity: v.quantity ? String(v.quantity) : undefined,
              price: Number(v.price || 0),
              stockQty: Number(v.stockQty || 0),
              inStock: Boolean(v.inStock),
              sku: v.sku ? String(v.sku) : undefined,
              image: imagePath
            };
          })
        : [],
      inStock: Boolean(calculatedInStock),
      stockQty: Number(product.stockQty || 0),
      rating: Number(product.rating || 4.5),
      reviews: Number(product.reviews || 0),
      createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString()
    };
    
    // Log for debugging
    console.log(`[Product Detail Page] Product: ${productData.name}`);
    console.log(`[Product Detail Page] Variants: ${productData.variantPricing.length}`);
    if (productData.variantPricing.length > 0) {
      console.log(`[Product Detail Page] First variant:`, {
        size: productData.variantPricing[0].size,
        color: productData.variantPricing[0].color,
        pack: productData.variantPricing[0].pack,
        image: productData.variantPricing[0].image,
        price: productData.variantPricing[0].price
      });
    }
    
    return productData;
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
      description: 'The requested product could not be found.',
    robots: {
        index: false,
        follow: false,
      },
    };
  }

  const rawDescription = product.description || `Buy ${product.name} from Shree Balaji Enterprises.`;
  const description = rawDescription.replace(/\s+/g, ' ').trim().slice(0, 160);
  const canonical = `https://www.balajisphere.com/products/${product.id}`;
  const primaryImage = product.image || product.variantPricing?.[0]?.image || '/banner.png';

  return {
    title: `${product.name} | Shree Balaji Enterprises`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${product.name} | Shree Balaji Enterprises`,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Shree Balaji Enterprises`,
      description,
      images: [primaryImage],
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