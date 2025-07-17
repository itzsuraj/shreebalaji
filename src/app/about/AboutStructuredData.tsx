export default function AboutStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shree Balaji Enterprises",
    "alternateName": "Balaji Sphere",
    "description": "Leading manufacturer and supplier of premium garment accessories in Mumbai, serving the textile industry with quality and reliability since 2024",
    "url": "https://www.balajisphere.com",
    "logo": "https://www.balajisphere.com/next.svg",
    "foundingDate": "2024",
    "industry": "Garment Accessories Manufacturing",
    "slogan": "Quality Garment Accessories for Professional Results",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "C Wing 704, Grit Height, G.M Link Road, Opposite Indian Oil Nagar, Near Shankara Colony, Chembur West",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400043",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9372268410",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi", "Marathi"],
      "areaServed": "IN"
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
            "@type": "Product",
            "name": "Buttons",
            "description": "Metal, plastic, and wooden buttons for all types of garments"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Zippers",
            "description": "Nylon coil, invisible, and decorative zippers"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Elastic",
            "description": "High-quality elastic bands for waistbands and cuffs"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Cords",
            "description": "Cotton cords and drawstrings for various applications"
          }
        }
      ]
    },
    "sameAs": [
      "https://wa.me/919372268410"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 