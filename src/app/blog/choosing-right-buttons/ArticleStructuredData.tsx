export default function ArticleStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Choose the Right Buttons for Your Garment",
    "description": "Learn the essential factors to consider when selecting buttons for different types of garments and fabrics. Expert guide from Shree Balaji Enterprises.",
    "image": "https://www.balajisphere.com/banner.png",
    "author": {
      "@type": "Organization",
      "name": "Shree Balaji Enterprises",
      "url": "https://www.balajisphere.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Shree Balaji Enterprises",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.balajisphere.com/logo.png"
      }
    },
    "datePublished": "2024-01-15",
    "dateModified": "2024-01-15",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.balajisphere.com/blog/choosing-right-buttons"
    },
    "url": "https://www.balajisphere.com/blog/choosing-right-buttons",
    "articleSection": "Garment Accessories",
    "keywords": "button selection, garment buttons, fabric compatibility, button types, garment accessories, Mumbai manufacturer",
    "wordCount": 1200,
    "timeRequired": "PT5M"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 