import { Product } from '@/types/product';
import { getProductImage } from '@/utils/imageUtils';

interface ProductsStructuredDataProps {
  products: Product[];
}

export default function ProductsStructuredData({ products }: ProductsStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Garment Accessories Collection",
    "description": "Complete collection of premium garment accessories including buttons, zippers, elastic bands, and cotton cords.",
    "url": "https://www.balajisphere.com/products",
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
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
          "priceValidUntil": "2026-07-20",
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "IN",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 7,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "INR"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 1,
                "maxValue": 2,
                "unitCode": "DAY"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 2,
                "maxValue": 5,
                "unitCode": "DAY"
              }
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "IN"
            }
          }
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
            "value": product.specifications?.Material || "Various"
          },
          {
            "@type": "PropertyValue",
            "name": "Category",
            "value": product.category
          }
        ]
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 