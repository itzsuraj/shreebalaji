'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Star, Heart, Truck, Shield, RotateCcw, Package, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductImage, normalizeImagePath } from '@/utils/imageUtils';

interface ProductVariant {
  size?: string;
  color?: string;
  pack?: string;
  quality?: string;
  quantity?: string;
  price: number;
  stockQty: number;
  sku: string;
  image?: string;
}

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  sizes: string[];
  colors: string[];
  packs: string[];
  variantPricing: ProductVariant[];
  inStock: boolean;
  stockQty: number;
  rating: number;
  reviews: number;
  specifications?: {
    material?: string;
    dimensions?: string;
    weight?: string;
    finish?: string;
    application?: string;
  };
  shipping?: {
    freeShipping?: boolean;
    estimatedDelivery?: string;
    processingTime?: string;
  };
}

interface EnhancedProductDetailProps {
  product: Product;
}

export default function EnhancedProductDetail({ product }: EnhancedProductDetailProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedPack, setSelectedPack] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    itemDetails: true, // Keep first accordion open by default
  });
  const [added, setAdded] = useState(false);
  // const [showShareModal, setShowShareModal] = useState(false);

  // Memoize expensive calculations
  const productImage = useMemo(() => getProductImage(product), [product.image, product.category]);
  const images = useMemo(() => {
    const mainImage = productImage;
    if (product.images && product.images.length > 0) {
      // Normalize all image paths
      return product.images
        .map(img => normalizeImagePath(img) || img)
        .filter((img): img is string => !!img);
    }
    return [mainImage];
  }, [product.images, productImage]);
  
  // Collect all variant images - ensure no duplicates and exclude product main image
  const allVariantImages = useMemo(() => {
    const variantImages = new Set<string>();
    const normalizedProductImage = normalizeImagePath(product.image);
    
    if (Array.isArray(product.variantPricing)) {
      product.variantPricing.forEach((v) => {
        const normalizedImage = normalizeImagePath(v.image);
        // Only add if image path is valid and not the same as product main image
        if (normalizedImage && 
            normalizedImage !== normalizedProductImage &&
            (normalizedImage.startsWith('/') || 
             normalizedImage.startsWith('http') || 
             normalizedImage.startsWith('data:') || 
             normalizedImage.startsWith('blob:'))
        ) {
          variantImages.add(normalizedImage);
        }
      });
    }
    return Array.from(variantImages);
  }, [product.variantPricing, product.image]);
  
  const displayImages = useMemo(() => {
    // If we have variant images, ONLY show variant images (don't include main product images)
    if (allVariantImages.length > 0) {
      // Exclude product main image from consideration
      const normalizedProductImage = normalizeImagePath(product.image);
      
      // Start with all variant images (prioritize selected variant's image first)
      const variantImage = normalizeImagePath(selectedVariant?.image);
      // Only prioritize variant image if it's valid, exists in allVariantImages, and is not the product image
      const isValidVariantImage = variantImage && 
        variantImage !== normalizedProductImage &&
        (variantImage.startsWith('/') || variantImage.startsWith('http') || variantImage.startsWith('data:') || variantImage.startsWith('blob:')) &&
        allVariantImages.includes(variantImage);
      
      const variantImagesList = isValidVariantImage
        ? [variantImage, ...allVariantImages.filter(img => img !== variantImage && img !== normalizedProductImage)]
        : allVariantImages.filter(img => img !== normalizedProductImage && !!img);
      
      // Remove duplicates and filter out any invalid images or product image
      // Note: data URLs are allowed but will be handled with regular img tags
      const unique = Array.from(new Set(variantImagesList)).filter(img => {
        // Ensure image path is valid and not the product main image
        if (!img || img === normalizedProductImage) return false;
        // Allow data URLs but prefer regular paths
        return img.startsWith('/') || img.startsWith('http') || img.startsWith('data:') || img.startsWith('blob:');
      });
      
      // Return only variant images - no fallback to productImage
      return unique;
    }
    
    // If no variant images, use main product images
    const mainImages = images
      .map(img => normalizeImagePath(img) || img)
      .filter((img): img is string => {
        // Filter out invalid paths
        if (!img) return false;
        // Ensure path is valid (starts with / or http)
        return img.startsWith('/') || img.startsWith('http') || img.startsWith('data:') || img.startsWith('blob:');
      });
    
    // Remove duplicates and filter out any invalid images
    const unique = Array.from(new Set(mainImages)).filter(img => {
      // Ensure image path is valid
      return img && (img.startsWith('/') || img.startsWith('http') || img.startsWith('data:') || img.startsWith('blob:'));
    });
    
    // If no images at all, fallback to product image
    return unique.length > 0 ? unique : [productImage];
  }, [images, selectedVariant?.image, allVariantImages, productImage]);
  const variantImageMap = useMemo(() => {
    const map = new Map<string, ProductVariant[]>();
    if (Array.isArray(product.variantPricing)) {
      product.variantPricing.forEach((v) => {
        const normalizedImage = normalizeImagePath(v.image);
        if (normalizedImage) {
          const list = map.get(normalizedImage) || [];
          list.push(v);
          map.set(normalizedImage, list);
        }
      });
    }
    return map;
  }, [product.variantPricing]);
  // Store variantPricing in a ref to avoid dependency issues
  const variantPricingRef = useRef(product.variantPricing);
  useEffect(() => {
    variantPricingRef.current = product.variantPricing;
  }, [product.variantPricing?.length]);

  const hasVariants = useMemo(() => {
    return Array.isArray(product.variantPricing) && product.variantPricing.length > 0;
  }, [product.variantPricing?.length]);

  const variantCount = useMemo(() => {
    return Array.isArray(product.variantPricing) ? product.variantPricing.length : 0;
  }, [product.variantPricing?.length]);

  // Extract unique sizes, colors, and packs from variantPricing
  const availableSizes = useMemo(() => {
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes;
    }
    if (hasVariants && product.variantPricing) {
      const sizes = new Set<string>();
      product.variantPricing.forEach((v: any) => {
        if (v.size) sizes.add(String(v.size));
      });
      return Array.from(sizes);
    }
    return [];
  }, [product.sizes?.length, hasVariants, product.variantPricing?.length]);

  const availableColors = useMemo(() => {
    if (product.colors && product.colors.length > 0) {
      return product.colors;
    }
    if (hasVariants && product.variantPricing) {
      const colors = new Set<string>();
      product.variantPricing.forEach((v: any) => {
        if (v.color) colors.add(String(v.color));
      });
      return Array.from(colors);
    }
    return [];
  }, [product.colors?.length, hasVariants, product.variantPricing?.length]);

  const availablePacks = useMemo(() => {
    if (product.packs && product.packs.length > 0) {
      return product.packs;
    }
    if (hasVariants && product.variantPricing) {
      const packs = new Set<string>();
      product.variantPricing.forEach((v: any) => {
        const matchesSize = !selectedSize || v.size === selectedSize;
        const matchesColor = !selectedColor || v.color === selectedColor;
        const matchesQuantity = product.category !== 'zipper' || !selectedQuantity || (v as any).quantity === selectedQuantity;
        if (matchesSize && matchesColor && matchesQuantity && v.pack) {
          packs.add(String(v.pack));
        }
      });
      return Array.from(packs);
    }
    return [];
  }, [
    product.packs?.length,
    hasVariants,
    product.variantPricing?.length,
    selectedSize,
    selectedColor,
    selectedQuantity,
    product.category,
  ]);

  const availableQuantities = useMemo(() => {
    if (hasVariants && product.variantPricing && product.category === 'zipper') {
      const quantities = new Set<string>();
      product.variantPricing.forEach((v: any) => {
        if (v.quantity) quantities.add(String(v.quantity));
      });
      return Array.from(quantities);
    }
    return [];
  }, [hasVariants, product.variantPricing?.length, product.category]);
  const [imageError, setImageError] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState<Set<number>>(new Set());

  // Calculate current price and stock
  const currentPrice = useMemo(
    () => (selectedVariant ? selectedVariant.price : product.price),
    [selectedVariant, product.price],
  );
  const currentStock = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.stockQty || 0;
    }
    // For simple products, use stockQty directly (API now recalculates inStock correctly)
    // If stockQty is not available, check inStock flag as fallback
    let stock = product.stockQty;
    
    // If stockQty is undefined/null but inStock is true, assume we have stock
    // This handles edge cases where stockQty might not be set
    if ((stock === undefined || stock === null) && product.inStock) {
      stock = 999; // Set a high number to indicate "in stock" but unknown quantity
    } else if (stock === undefined || stock === null) {
      stock = 0;
    }
    
    return stock || 0;
  }, [selectedVariant, product.stockQty, product.inStock]);


  // Initialize default selected variant (first available) on load
  useEffect(() => {
    if (!hasVariants) return;
    if (!variantPricingRef.current || variantPricingRef.current.length === 0) return;
    if (selectedVariant) return; // Already initialized

    const first = variantPricingRef.current[0];

    // Set option selections so UI buttons highlight correctly
    if (first.size) {
      setSelectedSize(first.size);
    }
    if (first.color) {
      setSelectedColor(first.color);
    }
    if (first.pack) {
      setSelectedPack(first.pack);
    }
    if (product.category === 'zipper' && (first as any).quantity) {
      setSelectedQuantity(String((first as any).quantity));
    }

    setSelectedVariant(first);
  }, [hasVariants, selectedVariant]);

  // Update selected variant when options change
  useEffect(() => {
    if (hasVariants && variantPricingRef.current) {
      // Find the variant that matches ALL selected options
      const variant = variantPricingRef.current.find(v => {
        // For size, color, pack - must match if selected, or variant doesn't have that field
        const matchesSize = !selectedSize || (v.size === selectedSize || !v.size);
        const matchesColor = !selectedColor || (v.color === selectedColor || !v.color);
        const matchesPack = !selectedPack || (v.pack === selectedPack || !v.pack);
        // For quantity (zipper category), must match exactly if selected
        const matchesQuantity = product.category !== 'zipper' || !selectedQuantity || (v as any).quantity === selectedQuantity;
        return matchesSize && matchesColor && matchesPack && matchesQuantity;
      });
      
      // Only update if variant actually changed to prevent infinite loops
      setSelectedVariant(prev => {
        if (!variant) {
          // If no variant found, try to find the first variant that matches at least one selected option
          const fallbackVariant = variantPricingRef.current?.find(v => {
            return (selectedSize && v.size === selectedSize) ||
                   (selectedColor && v.color === selectedColor) ||
                   (selectedPack && v.pack === selectedPack);
          });
          return fallbackVariant || prev;
        }
        const prevKey = prev ? `${prev.size}-${prev.color}-${prev.pack}-${product.category === 'zipper' ? (prev as any).quantity : ''}` : '';
        const newKey = `${variant.size}-${variant.color}-${variant.pack}-${product.category === 'zipper' ? (variant as any).quantity : ''}`;
        return prevKey === newKey ? prev : variant;
      });
    } else if (!hasVariants) {
      setSelectedVariant(null);
    }
  }, [selectedSize, selectedColor, selectedPack, selectedQuantity, hasVariants, product.category]);

  useEffect(() => {
    if (selectedPack && availablePacks.length > 0 && !availablePacks.includes(selectedPack)) {
      setSelectedPack(availablePacks[0] || '');
    }
  }, [availablePacks, selectedPack]);

  useEffect(() => {
    // When variant changes, reset to first image and clear errors
    setImageError(false);
    setCurrentImageIndex(0);
    setThumbnailErrors(new Set());
  }, [selectedVariant]);

  // Reset image error when switching to a different image
  useEffect(() => {
    setImageError(false);
  }, [currentImageIndex]);

  // Reset thumbnail errors when displayImages change
  useEffect(() => {
    setThumbnailErrors(new Set());
    // Ensure currentImageIndex is within bounds
    if (currentImageIndex >= displayImages.length && displayImages.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [displayImages.length, currentImageIndex]);
  const applyVariantSelections = useCallback((variant: ProductVariant) => {
    if (variant.size) setSelectedSize(variant.size);
    if (variant.color) setSelectedColor(variant.color);
    if (variant.pack) setSelectedPack(variant.pack);
    if (product.category === 'zipper' && (variant as any).quantity) {
      setSelectedQuantity(String((variant as any).quantity));
    }
    setSelectedVariant(variant);
  }, [product.category]);

  // Update image index when variant changes to show variant's image first
  useEffect(() => {
    if (!selectedVariant) return;
    
    const variantImage = normalizeImagePath(selectedVariant.image);
    if (variantImage && displayImages.length > 0) {
      const imageIndex = displayImages.findIndex(img => img === variantImage);
      if (imageIndex >= 0 && imageIndex !== currentImageIndex) {
        setCurrentImageIndex(imageIndex);
      } else if (imageIndex < 0 && currentImageIndex > 0) {
        // If variant image not found in displayImages, reset to first image
        setCurrentImageIndex(0);
      }
    }
  }, [selectedVariant, displayImages, currentImageIndex]);

  const handleAddToCart = useCallback(() => {
    if (hasVariants && !selectedVariant) {
      alert('Please select all required options');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      quantity,
      image: normalizeImagePath(selectedVariant?.image) || getProductImage(product),
      category: product.category
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }, [hasVariants, selectedVariant, addItem, product, currentPrice, quantity]);

  const toggleSection = useCallback((section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images - Etsy Style */}
        <div className="space-y-4">
          {/* Main Image with Bestseller Badge */}
          <div className="relative">
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
              {(() => {
                const imageSrc = imageError ? getProductImage({ category: product.category, image: undefined }) : (displayImages[currentImageIndex] || productImage);
                const isDataUrl = imageSrc?.startsWith('data:');
                
                // Use regular img tag for data URLs (Next.js Image doesn't handle them well)
                if (isDataUrl) {
                  return (
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Main image failed to load:', imageSrc);
                        if (!imageError) {
                          setImageError(true);
                          // Try to move to next image if available
                          if (displayImages.length > 1 && currentImageIndex < displayImages.length - 1) {
                            setCurrentImageIndex(currentImageIndex + 1);
                            setImageError(false);
                          }
                        }
                      }}
                      onLoad={() => {
                        if (imageError) {
                          setImageError(false);
                        }
                      }}
                    />
                  );
                }
                
                // Use Next.js Image for regular URLs
                return (
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => {
                      console.error('Main image failed to load:', imageSrc);
                      if (!imageError) {
                        setImageError(true);
                        // Try to move to next image if available
                        if (displayImages.length > 1 && currentImageIndex < displayImages.length - 1) {
                          setCurrentImageIndex(currentImageIndex + 1);
                          setImageError(false); // Reset error to try next image
                        }
                      }
                    }}
                    onLoad={() => {
                      // Reset error state if image loads successfully
                      if (imageError) {
                        setImageError(false);
                      }
                    }}
                  />
                );
              })()}
              {/* Bestseller Badge */}
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Star className="h-4 w-4 mr-1 fill-current" />
                Bestseller
              </div>
              {/* Heart Icon */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </button>
              {/* Image Navigation */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                    disabled={currentImageIndex === 0}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 disabled:opacity-50 transition-all"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(Math.min(displayImages.length - 1, currentImageIndex + 1))}
                    disabled={currentImageIndex === displayImages.length - 1}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 disabled:opacity-50 transition-all"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Thumbnail Images - Vertical Stack */}
          {displayImages.length > 1 && (
            <div className="flex space-x-2">
              {displayImages.map((image, index) => {
                const hasError = thumbnailErrors.has(index);
                const fallbackImage = getProductImage({ category: product.category, image: undefined });
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      // If this image belongs to a variant, switch to that variant
                      const image = displayImages[index];
                      if (image) {
                        const variants = variantImageMap.get(image);
                        if (variants && variants.length > 0) {
                          // Prefer exact match with current selections, otherwise use first variant
                          const exactMatch = variants.find(v => 
                            (!selectedSize || v.size === selectedSize) &&
                            (!selectedColor || v.color === selectedColor) &&
                            (!selectedPack || v.pack === selectedPack)
                          );
                          if (exactMatch) {
                            applyVariantSelections(exactMatch);
                          } else if (variants.length === 1) {
                            applyVariantSelections(variants[0]);
                          }
                        }
                      }
                    }}
                    className={`w-16 h-16 relative rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {(() => {
                      const imageSrc = hasError ? fallbackImage : image;
                      const isDataUrl = imageSrc?.startsWith('data:');
                      
                      // Use regular img tag for data URLs
                      if (isDataUrl) {
                        return (
                          <img
                            src={imageSrc}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => {
                              if (!thumbnailErrors.has(index)) {
                                setThumbnailErrors(prev => new Set(prev).add(index));
                              }
                            }}
                          />
                        );
                      }
                      
                      // Use Next.js Image for regular URLs
                      return (
                        <Image
                          src={imageSrc}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                          onError={() => {
                            if (!thumbnailErrors.has(index)) {
                              setThumbnailErrors(prev => new Set(prev).add(index));
                            }
                          }}
                        />
                      );
                    })()}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Information - Etsy Style */}
        <div className="space-y-6">
          {/* Product Title and key details */}
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              {/* Stock Badge */}
              {currentStock > 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  {currentStock} available
                </span>
              )}
            </div>

            {/* Key attributes just below title */}
            {(() => {
              const variant = Array.isArray(product.variantPricing) && product.variantPricing.length > 0 ? product.variantPricing[0] : null;
              
              // Debug: Log variant data (remove in production)
              if (process.env.NODE_ENV === 'development' && variant) {
                console.log('Product Variant Data:', {
                  category: product.category,
                  variant: variant,
                  size: variant.size,
                  color: variant.color,
                  quality: (variant as any).quality,
                  quantity: (variant as any).quantity,
                  pack: variant.pack
                });
              }
              
              // Helper function to check if a value is valid
              const isValidValue = (val: any): boolean => {
                if (!val) return false;
                const strVal = String(val).trim();
                return strVal !== '' && strVal !== '0' && strVal !== 'undefined' && strVal !== 'null';
              };
              
              if (variant) {
                // Type assertion to access quality and quantity fields
                const variantAny = variant as any;
                
                // Check if we have at least one valid value for elastic category
                if (product.category === 'elastic') {
                  const hasValidSize = isValidValue(variant.size);
                  const hasValidQuality = isValidValue(variantAny.quality);
                  const hasValidColor = isValidValue(variant.color);
                  const hasValidQuantity = isValidValue(variantAny.quantity);
                  
                  if (hasValidSize || hasValidQuality || hasValidColor || hasValidQuantity) {
                    return (
                      <div className={`mb-2 text-sm text-gray-700 ${hasVariants ? 'space-x-3 flex flex-wrap' : 'grid grid-cols-1 md:grid-cols-4 gap-2'}`}>
                        {hasValidSize && <span><strong>Size:</strong> {String(variant.size)}</span>}
                        {hasValidQuality && <span><strong>Quality:</strong> {String(variantAny.quality)}</span>}
                        {hasValidColor && <span><strong>Color:</strong> {String(variant.color)}</span>}
                        {hasValidQuantity && <span><strong>Roll:</strong> {String(variantAny.quantity)}</span>}
                      </div>
                    );
                  }
                } else {
                  // For other categories
                  const hasValidSize = isValidValue(variant.size);
                  const hasValidColor = isValidValue(variant.color);
                  const hasValidPack = isValidValue(variant.pack);
                  
                  if (hasValidSize || hasValidColor || hasValidPack) {
                    return (
                      <div className={`mb-2 text-sm text-gray-700 ${hasVariants ? 'space-x-3 flex flex-wrap' : 'grid grid-cols-1 md:grid-cols-4 gap-2'}`}>
                        {hasValidSize && <span><strong>Size:</strong> {String(variant.size)}</span>}
                        {hasValidColor && <span><strong>Color:</strong> {String(variant.color)}</span>}
                        {hasValidPack && <span><strong>Pack:</strong> {String(variant.pack)}</span>}
                      </div>
                    );
                  }
                }
              }
              
              // Fallback for non-variant products
              const isValidBaseValue = (val: any): boolean => {
                if (!val) return false;
                const strVal = String(val).trim();
                return strVal !== '' && strVal !== '0' && strVal !== 'undefined' && strVal !== 'null';
              };
              
              const hasValidBaseSize = isValidBaseValue(product.sizes?.[0]);
              const hasValidBaseColor = isValidBaseValue(product.colors?.[0]);
              const hasValidBasePack = isValidBaseValue(product.packs?.[0]);
              
              if (hasValidBaseSize || hasValidBaseColor || hasValidBasePack) {
                return (
                  <div className="mb-2 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-4 gap-2">
                    {hasValidBaseSize && <span><strong>Size:</strong> {String(product.sizes[0])}</span>}
                    {hasValidBaseColor && <span><strong>Color:</strong> {String(product.colors[0])}</span>}
                    {hasValidBasePack && <span><strong>Pack:</strong> {String(product.packs[0])}</span>}
                  </div>
                );
              }
              
              return null;
            })()}

            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price Section - Etsy Style */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(currentPrice)}
              </span>
              {/* For products with variants, treat the variant price as the real price
                  and ignore any default/base price coming from the backend. */}
              {!hasVariants && product.price > currentPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    New markdown!
                  </span>
                </>
              )}
            </div>
            {!hasVariants && product.price > currentPrice && (
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-medium">
                  {Math.round(((product.price - currentPrice) / product.price) * 100)}% off
                </span>
                <span className="text-sm text-gray-500">Sale ends in 1 day</span>
              </div>
            )}
            <p className="text-xs text-gray-500">Local taxes included (where applicable)</p>
          </div>

          {/* Seller Information hidden for now */}

          {/* Returns & Exchanges */}
          <div className="flex items-center text-sm text-gray-600">
            <Check className="h-4 w-4 mr-2 text-green-600" />
            <span>Returns & exchanges accepted</span>
          </div>

          {/* Product Options */}
          {hasVariants && (
            <div className="space-y-2">
              {/* Size and Color Selection - Side by Side */}
              <div className={`grid grid-cols-1 gap-4 ${variantCount === 1 ? 'md:grid-cols-4' : 'md:grid-cols-1'}`}>
                {/* Size Selection */}
                {availableSizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all ${
                            selectedSize === size
                              ? 'border-purple-500 bg-white text-purple-600'
                              : 'border-gray-300 hover:border-gray-400 text-gray-700'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {availableColors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all ${
                            selectedColor === color
                              ? 'border-purple-500 bg-white text-purple-600'
                              : 'border-gray-300 hover:border-gray-400 text-gray-700'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Selection - For zipper */}
              {availableQuantities.length > 0 && product.category === 'zipper' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableQuantities.map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setSelectedQuantity(qty)}
                        className={`px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all ${
                          selectedQuantity === qty
                            ? 'border-purple-500 bg-white text-purple-600'
                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pack Selection - Not for zipper or elastic */}
              {availablePacks.length > 0 && product.category !== 'zipper' && product.category !== 'elastic' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pack Size <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availablePacks.map((pack) => (
                      <button
                        key={pack}
                        onClick={() => setSelectedPack(pack)}
                        className={`px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all ${
                          selectedPack === pack
                            ? 'border-purple-500 bg-white text-purple-600'
                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        {pack}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="inline-flex items-center border-2 border-gray-300 rounded-lg overflow-hidden mb-4">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || currentStock === 0}
                  className="px-4 py-2 text-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed border-r border-gray-300"
                >
                  −
                </button>
                <div className="px-6 py-2 min-w-[3rem] text-center text-base font-medium text-gray-900 bg-white">
                  {currentStock === 0 ? 0 : quantity}
                </div>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= currentStock || currentStock === 0}
                  className="px-4 py-2 text-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed border-l border-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button - Etsy Style */}
            <button
              onClick={handleAddToCart}
              disabled={currentStock === 0 || (hasVariants && !selectedVariant)}
              className={`w-full text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl ${
                added
                  ? 'bg-green-600 ring-2 ring-green-200 scale-[1.02] animate-pulse'
                  : 'bg-primary-500 hover:bg-primary-600 hover:-translate-y-0.5'
              }`}
            >
              {added ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Check className="h-5 w-5" />
                  Added to cart
                </span>
              ) : (
                'Add to cart'
              )}
            </button>
          </div>

          {/* Shipping & Trust Signals */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                <span>
                  {product.shipping?.freeShipping ? 'Free Shipping' : 'Standard Shipping'}
                </span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-4 w-4 mr-2" />
                <span>Easy Returns</span>
              </div>
            </div>

            {product.shipping?.estimatedDelivery && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center text-blue-800">
                  <Package className="h-4 w-4 mr-2" />
                  <span className="font-medium">
                    Estimated Delivery: {product.shipping.estimatedDelivery}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details - Etsy Style Collapsible Sections */}
      <div className="mt-12">
        <div className="max-w-4xl">
          {/* Item Details Section */}
          <div className="border-b border-gray-200 py-4">
            <button 
              onClick={() => toggleSection('itemDetails')}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded"
            >
              <h3 className="text-lg font-medium text-gray-900">Item details</h3>
              <span className="text-gray-500 transform transition-transform duration-200">
                {openSections.itemDetails ? '−' : '+'}
              </span>
            </button>
            {openSections.itemDetails && (
              <div className="mt-4 text-sm text-gray-600 animate-fadeIn">
                <p className="mb-2">
                  You will get high-quality garment accessories including buttons, zippers, elastic, and cords. 
                  These come in various sizes and colors, perfect for professional garment making and textile industry.
                </p>
                <p className="mb-2">
                  The main materials are plastic, metal, and elastic, designed for durability and professional use.
                  These accessories are very suitable for sewing, clothing making, and the production of various garments.
                </p>
                <p>
                  We maintain consistent quality standards and keep updating our inventory, ensuring you get the best 
                  products for your manufacturing needs.
                </p>
              </div>
            )}
          </div>

          {/* Highlights Section */}
          <div className="border-b border-gray-200 py-4">
            <button 
              onClick={() => toggleSection('highlights')}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded"
            >
              <h3 className="text-lg font-medium text-gray-900">Highlights</h3>
              <span className="text-gray-500 transform transition-transform duration-200">
                {openSections.highlights ? '−' : '+'}
              </span>
            </button>
            {openSections.highlights && (
              <div className="mt-4 animate-fadeIn">
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Sourced by Shree Balaji Enterprises</li>
                  <li>• Supplies for making garments</li>
                  <li>• Materials: Plastic, Metal, Elastic</li>
                  <li>• Professional quality standards</li>
                  <li>• Suitable for bulk manufacturing</li>
                </ul>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="border-b border-gray-200 py-4">
            <button 
              onClick={() => toggleSection('reviews')}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded"
            >
              <h3 className="text-lg font-medium text-gray-900">Reviews ({product.reviews})</h3>
              <span className="text-gray-500 transform transition-transform duration-200">
                {openSections.reviews ? '−' : '+'}
              </span>
            </button>
            {openSections.reviews && (
              <div className="mt-4 animate-fadeIn">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {renderStars(4.6)}
                    <span className="ml-2 text-sm text-gray-600">4.6 out of 5</span>
                  </div>
                  <span className="text-sm text-gray-500">All reviews are from verified buyers</span>
                </div>
                
                {/* Sample Reviews */}
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-sm">Manufacturer123</span>
                      <div className="flex">{renderStars(5)}</div>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      &quot;Excellent quality buttons for our garment production. Fast delivery and great customer service!&quot;
                    </p>
                    <div className="mt-2">
                      <span className="text-xs text-green-600">✓ This item recommends</span>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-sm">TextileCo</span>
                      <div className="flex">{renderStars(5)}</div>
                      <span className="text-xs text-gray-500">1 week ago</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      &quot;Perfect for our bulk orders. Consistent quality and reliable supplier. Highly recommended for professional use.&quot;
                    </p>
                    <div className="mt-2">
                      <span className="text-xs text-green-600">✓ This item recommends</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
