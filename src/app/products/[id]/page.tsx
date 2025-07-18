import Image from 'next/image';
import { Star, ArrowLeft } from 'lucide-react';
import { products } from '@/data/products';
import { notFound } from 'next/navigation';
import { getProductImage } from '@/utils/imageUtils';
import ProductActions from './ProductActions';
import Link from 'next/link';
import { Metadata } from 'next';
import ProductStructuredData from './ProductStructuredData';
import ZoomableImage from '@/components/ui/ZoomableImage';
import Accordion from '@/components/ui/Accordion';

// Generate metadata for each product
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = products.find(p => p.id === resolvedParams.id);

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
  const product = products.find(p => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <ZoomableImage
            src={getProductImage(product)}
            alt={product.name}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
              <p className="text-2xl font-semibold text-blue-600">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            <p className="text-gray-600">{product.description}</p>

            {/* Action Buttons */}
            <ProductActions productName={product.name} productId={product.id} />

            {/* Features and Specifications in Accordion */}
            <div className="space-y-4">
              {/* Features Accordion */}
              {product.features && (
                <Accordion title="Key Features" defaultOpen={true}>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Accordion>
              )}

              {/* Specifications Accordion */}
              {product.specifications && (
                <Accordion title="Specifications">
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </Accordion>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(related => (
                <Link
                  key={related.id}
                  href={`/products/${related.id}`}
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={getProductImage(related)}
                      alt={related.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 truncate">{related.name}</h3>
                    <p className="text-blue-600 font-bold">₹{related.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
} 