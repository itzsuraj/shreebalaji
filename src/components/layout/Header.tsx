'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WhatsAppIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

// Sample product data for search (you can import from your actual data)
interface SearchProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}

const sampleProducts: SearchProduct[] = [
  { id: '1', name: '18l chalk button 2h shiny (DD)', category: 'buttons', price: 249, description: 'High-quality metal buttons perfect for jackets, coats, and heavy-duty garments.' },
  { id: '2', name: 'Nylon Coil Zipper - 5"', category: 'zippers', price: 124, description: 'Durable nylon coil zipper with metal slider, perfect for bags, jackets.' },
  { id: '3', name: 'Elastic Band - 1 inch Width', category: 'elastic', price: 82, description: 'High-quality elastic band with excellent stretch and recovery.' },
  { id: '4', name: 'Cotton Cord - 3mm Thickness', category: 'cords', price: 107, description: 'Natural cotton cord perfect for drawstrings, ties, and decorative applications.' },
  { id: '5', name: 'Metal Snap Buttons - 15mm', category: 'buttons', price: 166, description: 'Versatile plastic snap buttons with easy installation.' },
  { id: '6', name: 'Invisible Zipper - 7"', category: 'zippers', price: 207, description: 'Professional invisible zipper for seamless garment construction.' },
  { id: '7', name: 'Satin Cord - 3mm Multiple Colors', category: 'cords', price: 189, description: 'Premium 3mm satin cords available in a wide range of vibrant colors.' },
  { id: '8', name: 'Wooden Buttons - 11mm', category: 'buttons', price: 291, description: 'Elegant wooden buttons perfect for eco-friendly and natural garment designs.' },
];

// Smart search function with natural language processing
const smartSearch = (query: string, products: SearchProduct[]): SearchProduct[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  
  // Natural language processing for common queries
  const naturalLanguageMap = {
    'button': 'buttons',
    'buttons': 'buttons',
    'zipper': 'zippers',
    'zippers': 'zippers',
    'elastic': 'elastic',
    'cord': 'cords',
    'cords': 'cords',
    'denim': 'metal',
    'heavy': 'metal',
    'light': 'plastic',
    'wood': 'wooden',
    'invisible': 'invisible',
    'nylon': 'nylon',
    'cotton': 'cotton',
    'satin': 'satin',
    'metal': 'metal',
    'plastic': 'plastic',
  };

  // Enhanced search with multiple criteria and scoring
  const scoredProducts = products.map(product => {
    let score = 0;
    const productName = product.name.toLowerCase();
    const productDescription = product.description.toLowerCase();
    const productCategory = product.category.toLowerCase();
    
    // Exact name match (highest priority)
    if (productName === searchTerm) {
      score += 1000;
    }
    
    // Starts with search term
    if (productName.startsWith(searchTerm)) {
      score += 500;
    }
    
    // Contains search term in name
    if (productName.includes(searchTerm)) {
      score += 100;
    }
    
    // Category match
    if (productCategory.includes(searchTerm)) {
      score += 50;
    }
    
    // Description match
    if (productDescription.includes(searchTerm)) {
      score += 25;
    }
    
    // Natural language processing (only for specific queries, not product names)
    const isProductNameQuery = searchTerm.length > 10 || searchTerm.includes('(') || searchTerm.includes(')');
    if (!isProductNameQuery) {
      const naturalLanguageMatch = Object.entries(naturalLanguageMap).some(([key, value]) => {
        if (searchTerm.includes(key)) {
          return productName.includes(value) || 
                 productDescription.includes(value) ||
                 productCategory.includes(value);
        }
        return false;
      });
      if (naturalLanguageMatch) {
        score += 30;
      }
    }

    // Price range queries
    if (searchTerm.includes('cheap') || searchTerm.includes('budget')) {
      if (product.price < 150) score += 20;
    } else if (searchTerm.includes('premium') || searchTerm.includes('luxury')) {
      if (product.price > 200) score += 20;
    }

    return { product, score };
  });

  // Filter products with score > 0 and sort by score (highest first)
  return scoredProducts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
};

// Search suggestions
const getSearchSuggestions = (query: string): string[] => {
  const suggestions = [
    'buttons for denim jackets',
    'invisible zippers for dresses',
    'elastic bands for waistbands',
    'cotton cords for drawstrings',
    'metal buttons for coats',
    'nylon zippers for bags',
    'wooden buttons for shirts',
    'satin cords for decoration',
    'cheap buttons',
    'premium zippers',
    'bulk elastic',
    'wholesale cords'
  ];
  
  if (!query) return suggestions.slice(0, 6);
  
  return suggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello! I'm interested in your garment accessories. Please provide more information.");
    window.open(`https://wa.me/919372268410?text=${message}`, '_blank');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSearchSuggestions(getSearchSuggestions(''));
      setShowSuggestions(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = smartSearch(query, sampleProducts);
      setSearchResults(results);
      setSearchSuggestions(getSearchSuggestions(query));
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setSearchSuggestions(getSearchSuggestions(''));
      setShowSuggestions(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    const results = smartSearch(suggestion, sampleProducts);
    setSearchResults(results);
    setShowSuggestions(false);
  };

  const handleResultClick = (product: SearchProduct) => {
    router.push(`/products/${product.id}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow relative">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <div className="relative w-16 h-16">
                <Image
                  src="/logo.png"
                  alt="Shree Balaji Enterprises Logo"
                  fill
                  className="object-contain"
                  />
              </div>
              <span className="text-xl font-bold text-gray-900 italic">Shree Balaji Enterprises</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-blue-600 transition-colors">
              FAQ
            </Link>
            
            {/* Search Button */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              title="Search products"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleWhatsAppClick}
              className="p-2 text-green-600 hover:text-green-700 transition-colors"
              title="Contact us on WhatsApp"
            >
              <WhatsAppIcon />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              title="Search products"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="p-2 text-green-600 hover:text-green-700 transition-colors"
              title="Contact us on WhatsApp"
            >
              <WhatsAppIcon />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Smart Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 p-4">
            <div className="max-w-4xl mx-auto" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search for buttons, zippers, elastic, cords... (e.g., 'buttons for denim jackets')"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
                
                {/* Search Suggestions and Results */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto">
                    {/* Search Suggestions */}
                    {searchSuggestions.length > 0 && (
                      <div className="p-4 border-b border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Searches:</h4>
                        <div className="space-y-1">
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Products:</h4>
                        <div className="space-y-2">
                          {searchResults.slice(0, 5).map((product) => (
                            <button
                              key={product.id}
                              onClick={() => handleResultClick(product)}
                              className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-gray-900">{product.name}</h5>
                                  <p className="text-sm text-gray-600">{product.description}</p>
                                  <span className="text-xs text-blue-600 capitalize">{product.category}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">₹{product.price}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                        {searchResults.length > 5 && (
                          <button
                            onClick={performSearch}
                            className="w-full mt-2 text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View all {searchResults.length} results →
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* No Results */}
                    {searchQuery && searchResults.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        <p>No products found for &quot;{searchQuery}&quot;</p>
                        <p className="text-sm mt-1">Try different keywords or browse our categories</p>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
            <div className="px-4 py-6 space-y-4">
              <Link 
                href="/products" 
                className="block text-gray-700 hover:text-blue-600 transition-colors py-2 text-lg"
                onClick={closeMenu}
              >
                Products
              </Link>
              <Link 
                href="/about" 
                className="block text-gray-700 hover:text-blue-600 transition-colors py-2 text-lg"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link 
                href="/blog" 
                className="block text-gray-700 hover:text-blue-600 transition-colors py-2 text-lg"
                onClick={closeMenu}
              >
                Blog
              </Link>
              <Link 
                href="/contact" 
                className="block text-gray-700 hover:text-blue-600 transition-colors py-2 text-lg"
                onClick={closeMenu}
              >
                Contact
              </Link>
              <Link 
                href="/faq" 
                className="block text-gray-700 hover:text-blue-600 transition-colors py-2 text-lg"
                onClick={closeMenu}
              >
                FAQ
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Quick Contact:</p>
                <a 
                  href="tel:+919372268410"
                  className="block text-blue-600 hover:text-blue-800 transition-colors py-1"
                >
                  +91 9372268410
                </a>
                <a 
                  href="mailto:shreebalajienterprises400077@gmail.com"
                  className="block text-blue-600 hover:text-blue-800 transition-colors py-1"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 