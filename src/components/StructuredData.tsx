export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shree Balaji Enterprises",
    "description": "Leading manufacturer and supplier of premium garment accessories in Mumbai",
    "url": "https://www.balajisphere.com",
    "logo": "https://www.balajisphere.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9372268410",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": "English, Hindi"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "C Wing 704, Grit Height, G.M Link Road, Opposite Indian Oil Nagar, Near Shankara Colony, Chembur West",
      "addressLocality": "Mumbai",
      "postalCode": "400043",
      "addressCountry": "IN"
    },
    "sameAs": [
      // Add your social media URLs here when you have them
    ],
    "foundingDate": "2024",
    "areaServed": "India",
    "serviceArea": {
      "@type": "Country",
      "name": "India"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 