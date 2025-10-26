'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import { Star, ShoppingCart, ArrowLeft, Check, Search, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductImage } from '@/utils/imageUtils';
import Toast from '@/components/ui/Toast';

interface ProductsClientProps {
  products: Product[];
  searchQuery?: string;
  initialCategory?: string;
}

// Memoized ProductCard component for better performance
const ProductCard = memo(({ product, addedId, handleAddToCart, handleBuyNow }: {
  product: Product;
  addedId: string | null;
  handleAddToCart: (product: Product) => void;
  handleBuyNow: (product: Product) => void;
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <Link href={`/products/${product.id}`}>
      <div className="relative h-48">
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          quality={75}
        />
      </div>
      <div className="p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 leading-tight line-clamp-2">{product.name}</h3>
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="ml-1 text-sm text-gray-700 font-medium">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
        <p className="text-blue-600 font-bold text-lg mb-2">₹{product.price.toLocaleString()}</p>
      </div>
    </Link>
    <div className="px-4 pb-4 relative">
      {/* Stock badge */}
      <div className={`absolute -top-3 left-4 text-xs px-2 py-0.5 rounded-full shadow ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {product.inStock ? 'In stock' : 'Out of stock'}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {product.variantPricing && product.variantPricing.length > 0 ? (
          <Link 
            href={`/products/${product.id}`}
            className="col-span-2 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors font-medium text-center"
          >
            View options
          </Link>
        ) : (
          <>
            <button 
              onClick={() => handleAddToCart(product)}
              aria-live="polite"
              disabled={!product.inStock}
              className={`${addedId===product.id ? 'bg-green-700' : 'bg-green-600'} ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''} text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-1 font-medium ${addedId===product.id ? 'scale-[0.98]' : ''}`}
            >
              {addedId===product.id ? (
                <>
                  <Check className="h-3 w-3" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3 w-3" />
                  Add to Cart
                </>
              )}
            </button>
            <button 
              onClick={() => handleBuyNow(product)}
              disabled={!product.inStock}
              className={`bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors font-medium ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Buy Now
            </button>
          </>
        )}
      </div>
      <Toast message={`${product.name} added to cart`} isVisible={addedId===product.id} onClose={() => {}} />
    </div>
  </div>
));

ProductCard.displayName = 'ProductCard';

function ProductsClient({ products, searchQuery = '', initialCategory = '' }: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchTerm, setSearchTerm] = useState<string>(searchQuery);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);

  // Memoize categories to avoid recalculation
  const categories = useMemo(() => 
    ['all', ...new Set(products.map(product => product.category))], 
    [products]
  );

  // Optimized search function with early returns and caching
  const smartSearch = useCallback((query: string, products: Product[]): Product[] => {
    if (!query.trim()) return products;
    
    const searchTerm = query.toLowerCase();
    
    // Early return for very short queries
    if (searchTerm.length < 2) return products;
    
    // Cache for natural language mapping
    const naturalLanguageMap: Record<string, string> = {
      'button': 'buttons', 'buttons': 'buttons',
      'zipper': 'zippers', 'zippers': 'zippers',
      'elastic': 'elastic', 'cord': 'cords', 'cords': 'cords',
      'denim': 'metal', 'heavy': 'metal', 'light': 'plastic',
      'wood': 'wooden', 'invisible': 'invisible', 'nylon': 'nylon',
      'cotton': 'cotton', 'satin': 'satin', 'metal': 'metal', 'plastic': 'plastic',
    };

    // Pre-compute search terms for better performance
    const isProductNameQuery = searchTerm.length > 10 || searchTerm.includes('(') || searchTerm.includes(')');
    const isPriceQuery = searchTerm.includes('cheap') || searchTerm.includes('budget') || 
                        searchTerm.includes('premium') || searchTerm.includes('luxury');

    // Use for loop instead of map for better performance
    const results: Array<{ product: Product; score: number }> = [];
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      let score = 0;
      
      const productName = product.name.toLowerCase();
      const productDescription = product.description.toLowerCase();
      const productCategory = product.category.toLowerCase();
      
      // Exact name match (highest priority) - early return
      if (productName === searchTerm) {
        results.push({ product, score: 1000 });
        continue;
      }
      
      // Starts with search term
      if (productName.startsWith(searchTerm)) {
        score += 500;
      } else if (productName.includes(searchTerm)) {
        // Contains search term in name
        score += 100;
      }
      
      // Category match
      if (productCategory.includes(searchTerm)) {
        score += 50;
      }
      
      // Description match (only if not already found in name)
      if (score < 100 && productDescription.includes(searchTerm)) {
        score += 25;
      }
      
      // Natural language processing (only for specific queries)
      if (!isProductNameQuery && score < 100) {
        for (const [key, value] of Object.entries(naturalLanguageMap)) {
          if (searchTerm.includes(key)) {
            if (productName.includes(value) || productDescription.includes(value) || productCategory.includes(value)) {
              score += 30;
              break;
            }
          }
        }
      }

      // Price range queries
      if (isPriceQuery) {
        if ((searchTerm.includes('cheap') || searchTerm.includes('budget')) && product.price < 150) {
          score += 20;
        } else if ((searchTerm.includes('premium') || searchTerm.includes('luxury')) && product.price > 200) {
          score += 20;
        }
      }

      // Only add if score > 0
      if (score > 0) {
        results.push({ product, score });
      }
    }

    // Sort by score (highest first) and return products
    return results
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);
  }, []);

  // Memoize filtered products to avoid recalculation on every render
  const filteredProducts = useMemo(() => {
    return smartSearch(searchTerm, products)
      .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
  }, [smartSearch, searchTerm, products, selectedCategory, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = useMemo(() => 
    filteredProducts.slice(startIndex, endIndex), 
    [filteredProducts, startIndex, endIndex]
  );

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const handleAddToCart = useCallback((product: Product) => {
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, image: getProductImage(product), category: product.category });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  }, [addItem]);

  const handleBuyNow = useCallback((product: Product) => {
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, image: getProductImage(product), category: product.category });
    router.push('/checkout');
  }, [addItem, router]);

  const updateURL = useCallback((category: string, search?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    if (search) {
      params.set('search', search);
    } else if (searchTerm) {
      params.set('search', searchTerm);
    }
    const newURL = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newURL, { scroll: false });
  }, [searchParams, searchTerm, router]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    updateURL(category);
  }, [updateURL]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsSearching(true);
    
    // Debounce search to avoid too many URL updates
    setTimeout(() => {
      updateURL(selectedCategory, newSearchTerm);
      setIsSearching(false);
    }, 300);
  }, [updateURL, selectedCategory]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    updateURL(selectedCategory, '');
  }, [updateURL, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
      
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900">
        {searchTerm ? `Search Results for "${searchTerm}"` : 'All Products'}
      </h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products... (e.g., 'buttons for denim jackets')"
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="mt-2 flex items-center space-x-2">
            {isSearching ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">Searching...</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} for &quot;{searchTerm}&quot;
              </p>
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Categories</h2>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Sort By</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? `No products found for "${searchTerm}"` : 'No products available'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try different keywords or browse our categories below.'
                  : 'Please check back later or contact us for specific requirements.'
                }
              </p>
              {searchTerm && (
                <div className="space-y-3">
                  <button
                    onClick={clearSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                  <div className="text-sm text-gray-500">
                    <p className="mb-2">Try searching for:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['buttons', 'zippers', 'elastic', 'cords', 'metal', 'plastic', 'wooden'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setSearchTerm(suggestion)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addedId={addedId}
                  handleAddToCart={handleAddToCart}
                  handleBuyNow={handleBuyNow}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredProducts.length > itemsPerPage && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Results info */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductsClient); 