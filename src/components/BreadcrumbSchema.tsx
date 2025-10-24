import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  showVisualBreadcrumb?: boolean;
}

export default function BreadcrumbSchema({ items, showVisualBreadcrumb = true }: BreadcrumbSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Visual Breadcrumb Navigation */}
      {showVisualBreadcrumb && (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 py-2" aria-label="Breadcrumb">
          <Link 
            href="/" 
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {index === items.length - 1 ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link 
                  href={item.url} 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      )}
    </>
  );
} 