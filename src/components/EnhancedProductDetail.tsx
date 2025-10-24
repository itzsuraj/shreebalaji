'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Star, Heart, Truck, Shield, RotateCcw, Package, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductImage } from '@/utils/imageUtils';

interface ProductVariant {
  size?: string;
  color?: string;
  pack?: string;
  price: number;
  stockQty: number;
  sku: string;
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
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    itemDetails: true, // Keep first accordion open by default
  });
  // const [showShareModal, setShowShareModal] = useState(false);

  // Memoize expensive calculations
  const images = useMemo(() => product.images || [product.image], [product.images, product.image]);
  const hasVariants = useMemo(() => product.variantPricing && product.variantPricing.length > 0, [product.variantPricing]);

  // Calculate current price and stock
  const currentPrice = useMemo(() => 
    selectedVariant ? selectedVariant.price : product.price, 
    [selectedVariant, product.price]
  );
  const currentStock = useMemo(() => 
    selectedVariant ? selectedVariant.stockQty : (product.inStock ? (product.stockQty || 0) : 0),
    [selectedVariant, product.inStock, product.stockQty]
  );

  // Update selected variant when options change
  useEffect(() => {
    if (hasVariants) {
      const variant = product.variantPricing.find(v => 
        (!selectedSize || v.size === selectedSize) &&
        (!selectedColor || v.color === selectedColor) &&
        (!selectedPack || v.pack === selectedPack)
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedSize, selectedColor, selectedPack, product.variantPricing, hasVariants]);

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
      image: getProductImage(product),
      category: product.category
    });
  }, [hasVariants, selectedVariant, addItem, product, currentPrice, quantity]);

  const toggleSection = useCallback((section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // const handleQuantityChange = (change: number) => {
  //   const newQuantity = quantity + change;
  //   if (newQuantity >= 1 && newQuantity <= currentStock) {
  //     setQuantity(newQuantity);
  //   }
  // };

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
              <Image
                src={images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
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
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                    disabled={currentImageIndex === 0}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 disabled:opacity-50 transition-all"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                    disabled={currentImageIndex === images.length - 1}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 disabled:opacity-50 transition-all"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Thumbnail Images - Vertical Stack */}
          {images.length > 1 && (
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 relative rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information - Etsy Style */}
        <div className="space-y-6">
          {/* Popularity Indicator */}
          <div className="text-sm text-gray-600">
            In {Math.floor(Math.random() * 20) + 5}+ carts
          </div>

          {/* Product Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
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
              {product.price > currentPrice && (
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
            {product.price > currentPrice && (
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-medium">
                  {Math.round(((product.price - currentPrice) / product.price) * 100)}% off
                </span>
                <span className="text-sm text-gray-500">Sale ends in 1 day</span>
              </div>
            )}
            <p className="text-xs text-gray-500">Local taxes included (where applicable)</p>
          </div>

          {/* Seller Information */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">SB</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Shree Balaji Enterprises</p>
                <div className="flex items-center space-x-1">
                  {renderStars(4.8)}
                  <span className="text-sm text-gray-600">(127 reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Returns & Exchanges */}
          <div className="flex items-center text-sm text-gray-600">
            <Check className="h-4 w-4 mr-2 text-green-600" />
            <span>Returns & exchanges accepted</span>
          </div>

          {/* Product Options */}
          {hasVariants && (
            <div className="space-y-4">
              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                          selectedSize === size
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                          selectedColor === color
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pack Selection */}
              {product.packs.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pack Size <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.packs.map((pack) => (
                      <button
                        key={pack}
                        onClick={() => setSelectedPack(pack)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                          selectedPack === pack
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
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

          {/* Quantity Selector - Etsy Style */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full max-w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={currentStock === 0}
              >
                {currentStock > 0 ? (
                  Array.from({ length: Math.min(10, Math.max(1, currentStock)) }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))
                ) : (
                  <option value="0">Out of Stock</option>
                )}
              </select>
              {currentStock > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {currentStock} available
                </p>
              )}
            </div>

            {/* Add to Cart Button - Etsy Style */}
            <button
              onClick={handleAddToCart}
              disabled={currentStock === 0 || (hasVariants && !selectedVariant)}
              className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add to cart
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
