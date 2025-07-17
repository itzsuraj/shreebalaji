import { Product } from '@/types/product';
import { getProductImage } from '@/utils/imageUtils';

interface ProductStructuredDataProps {
  product: Product;
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": getProductImage(product),
    "brand": {
      "@type": "Brand",
      "name": "Shree Balaji Enterprises"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Shree Balaji Enterprises",
        "url": "https://www.balajisphere.com"
      },
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews,
      "bestRating": 5,
      "worstRating": 1
    },
    "category": product.category,
    "manufacturer": {
      "@type": "Organization",
      "name": "Shree Balaji Enterprises",
      "url": "https://www.balajisphere.com"
    },
    "mpn": product.id,
    "sku": product.id,
    "url": `https://www.balajisphere.com/products/${product.id}`,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Material",
        "value": product.specifications?.Material || "High Quality"
      },
      {
        "@type": "PropertyValue", 
        "name": "Category",
        "value": product.category
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 