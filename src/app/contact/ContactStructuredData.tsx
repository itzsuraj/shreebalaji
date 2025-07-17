export default function ContactStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shree Balaji Enterprises",
    "description": "Leading manufacturer and supplier of premium garment accessories in Mumbai",
    "url": "https://www.balajisphere.com",
    "logo": "https://www.balajisphere.com/next.svg",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-9372268410",
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi", "Marathi"],
        "areaServed": "IN"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+91-9372268410",
        "contactType": "sales",
        "availableLanguage": ["English", "Hindi", "Marathi"],
        "areaServed": "IN"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "C Wing 704, Grit Height, G.M Link Road, Opposite Indian Oil Nagar, Near Shankara Colony, Chembur West",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400043",
      "addressCountry": "IN"
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