import { getProtectedEmail } from '@/utils/emailProtection';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Shree Balaji Enterprises",
    "description": "Leading manufacturer and supplier of premium garment accessories in Mumbai",
    "url": "https://balajisphere.com",
    "logo": "https://balajisphere.com/logo.png",
    "image": "https://balajisphere.com/banner.png",
    "telephone": "+91-9372268410",
    "email": getProtectedEmail(),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "C Wing 704, Grit Height, G.M Link Road, Opposite Indian Oil Nagar, Near Shankara Colony, Chembur West",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400043",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "₹₹",
    "paymentAccepted": ["Cash", "Bank Transfer", "UPI"],
    "currenciesAccepted": "INR",
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Garment Accessories",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Button Manufacturing & Supply",
            "description": "Metal, plastic, and wooden buttons for all types of garments",
            "provider": {
              "@type": "Organization",
              "name": "Shree Balaji Enterprises"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Zipper Manufacturing & Supply",
            "description": "Nylon coil, invisible, and decorative zippers",
            "provider": {
              "@type": "Organization",
              "name": "Shree Balaji Enterprises"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Elastic Band Manufacturing & Supply",
            "description": "High-quality elastic bands for waistbands and cuffs",
            "provider": {
              "@type": "Organization",
              "name": "Shree Balaji Enterprises"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cord Manufacturing & Supply",
            "description": "Cotton cords and drawstrings for various applications",
            "provider": {
              "@type": "Organization",
              "name": "Shree Balaji Enterprises"
            }
          }
        }
      ]
    },
    "sameAs": [
      "https://wa.me/919372268410"
    ],
    "foundingDate": "2024",
    "numberOfEmployees": "10-50"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 