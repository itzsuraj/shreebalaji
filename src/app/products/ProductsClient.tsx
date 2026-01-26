'use client';

import { useState, useMemo, memo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import { Star, ArrowLeft, Search, X, Eye, Heart, Filter, SlidersHorizontal } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductImage, getProductDisplayImage } from '@/utils/imageUtils';
import QuickViewModal from '@/components/ui/QuickViewModal';

interface ProductsClientProps {
  products: Product[];
  searchQuery?: string;
  initialCategory?: string;
}

// Enhanced ProductCard with modern UI/UX
const ProductCard = memo(({ product, onQuickView }: {
  product: Product;
  onQuickView: (product: Product) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(getProductDisplayImage(product));

  return (
    <div 
      className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Hover Effects */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <Link href={`/products/${product.id}`} prefetch={true}>
          <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-105">
            {!imageError ? (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                quality={85}
                onError={() => {
                  // Fallback to category icon if image fails to load
                  setImageError(true);
                  setImageSrc(getProductImage({ category: product.category, image: undefined }));
                }}
              />
            ) : (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                quality={85}
              />
            )}
          </div>
        </Link>
        
        {/* Stock Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
          product.inStock 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } ${isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"
          >
            <Eye className="h-4 w-4" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <Link href={`/products/${product.id}`} prefetch={true}>
          <h3 className="text-lg font-bold mb-2 text-gray-900 leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Key attributes (show first variant summary or base fields) */}
        {product.variantPricing && product.variantPricing.length > 0 && product.variantPricing[0] ? (
          <div className="mb-3 text-xs text-gray-600 space-y-1">
            {product.category === 'elastic' ? (
              <>
                {product.variantPricing[0].size && product.variantPricing[0].size !== '0' && (
                  <div>Size: {product.variantPricing[0].size}</div>
                )}
                {product.variantPricing[0].quality && product.variantPricing[0].quality !== '0' && (
                  <div>Quality: {product.variantPricing[0].quality}</div>
                )}
                {product.variantPricing[0].color && product.variantPricing[0].color !== '0' && (
                  <div>Color: {product.variantPricing[0].color}</div>
                )}
                {product.variantPricing[0].quantity && product.variantPricing[0].quantity !== '0' && (
                  <div>Roll: {product.variantPricing[0].quantity}</div>
                )}
              </>
            ) : (
              <>
                {product.variantPricing[0].size && product.variantPricing[0].size !== '0' && (
                  <div>Size: {product.variantPricing[0].size}</div>
                )}
                {product.variantPricing[0].color && product.variantPricing[0].color !== '0' && (
                  <div>Color: {product.variantPricing[0].color}</div>
                )}
                {product.variantPricing[0].pack && product.variantPricing[0].pack !== '0' && (
                  <div>Pack: {product.variantPricing[0].pack}</div>
                )}
              </>
            )}
          </div>
        ) : (
          !!(product.sizes?.length || product.colors?.length || product.packs?.length) && (
            <div className="mb-3 text-xs text-gray-600 space-y-1">
              {product.sizes?.[0] && product.sizes[0] !== '0' && <div>Size: {product.sizes[0]}</div>}
              {product.colors?.[0] && product.colors[0] !== '0' && <div>Color: {product.colors[0]}</div>}
              {product.packs?.[0] && product.packs[0] !== '0' && <div>Pack: {product.packs[0]}</div>}
            </div>
          )
        )}
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-600 font-medium">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-primary-600">
            ₹{product.price.toLocaleString()}
          </span>
        </div>

        <Link 
          href={`/products/${product.id}`}
          className="block w-full bg-primary-500 text-white py-3 px-4 rounded-lg text-sm font-semibold text-center hover:bg-primary-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          View Product
        </Link>
      </div>
    </div>
  );
});

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
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

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

  // Calculate price range from products
  const productPriceRange = useMemo(() => {
    if (products.length === 0) return [0, 10000];
    const prices = products.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  // Memoize filtered products to avoid recalculation on every render
  const filteredProducts = useMemo(() => {
    return smartSearch(searchTerm, products)
      .filter(product => {
        // Category filter - case-insensitive comparison
        if (selectedCategory.toLowerCase().trim() !== 'all' && 
            product.category.toLowerCase().trim() !== selectedCategory.toLowerCase().trim()) {
          return false;
        }
        // Price range filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
        return true;
      })
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
  }, [smartSearch, searchTerm, products, selectedCategory, sortBy, priceRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = useMemo(() => 
    filteredProducts.slice(startIndex, endIndex), 
    [filteredProducts, startIndex, endIndex]
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const handleQuickViewAddToCart = useCallback((product: Product) => {
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, image: getProductDisplayImage(product), category: product.category });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  }, [addItem]);

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

  // Initialize price range
  useEffect(() => {
    if (productPriceRange[1] > 0) {
      setPriceRange([productPriceRange[0], productPriceRange[1]]);
    }
  }, [productPriceRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
      <Link 
        href="/" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors text-sm sm:text-base font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
      
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'All Products'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products... (e.g., 'buttons for denim jackets')"
              className="w-full pl-12 pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-3 flex items-center space-x-2">
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
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Advanced Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full lg:w-80 flex-shrink-0`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 sticky top-6">
              {/* Categories Filter */}
          <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary-600" />
                  Categories
                </h2>
            <div className="space-y-2">
              {categories.map(category => {
                const isSelected = selectedCategory.toLowerCase().trim() === category.toLowerCase().trim();
                return (
                <button
                  key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary-500 text-white shadow-md transform scale-[1.02]'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
                );
              })}
            </div>
          </div>

              {/* Price Range Filter */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-primary-600" />
                  Price Range
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Min</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        min={productPriceRange[0]}
                        max={productPriceRange[1]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Max</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        min={productPriceRange[0]}
                        max={productPriceRange[1]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Sort By */}
          <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Sort By</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm font-semibold bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
            </select>
          </div>

              {/* Clear Filters */}
              {(selectedCategory !== 'all' || priceRange[0] !== productPriceRange[0] || priceRange[1] !== productPriceRange[1]) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([productPriceRange[0], productPriceRange[1]]);
                    setSortBy('featured');
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              )}
        </div>
          </aside>

        {/* Product Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="text-gray-400 mb-6">
                  <svg className="mx-auto h-16 w-16 sm:h-20 sm:w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {searchTerm ? `No products found for "${searchTerm}"` : 'No products available'}
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto">
                  {searchTerm 
                    ? 'Try different keywords or browse our categories below.'
                    : 'Please check back later or contact us for specific requirements.'
                  }
                </p>
                {searchTerm && (
                  <div className="space-y-4">
                    <button
                      onClick={clearSearch}
                      className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                    >
                      Clear Search
                    </button>
                    <div className="text-sm text-gray-500">
                      <p className="mb-3 font-medium">Try searching for:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['buttons', 'zippers', 'elastic', 'cords', 'metal', 'plastic', 'wooden'].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setSearchTerm(suggestion)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors font-medium"
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
                  {paginatedProducts.map(product => (
                    <ProductCard
                key={product.id}
                      product={product}
                      onQuickView={handleQuickView}
                    />
                  ))}
                  </div>

                {/* Pagination Controls */}
                {filteredProducts.length > itemsPerPage && (
                  <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 font-medium">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                                currentPage === pageNum
                                  ? 'bg-primary-500 text-white shadow-md'
                                  : 'text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
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
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                        Next
                  </button>
                </div>
              </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setQuickViewProduct(null);
        }}
        onAddToCart={handleQuickViewAddToCart}
        addedToCart={quickViewProduct ? addedId === quickViewProduct.id : false}
      />
    </div>
  );
} 

export default memo(ProductsClient); 