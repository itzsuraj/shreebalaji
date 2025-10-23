'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Package, ShoppingCart, Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductImage } from '@/utils/imageUtils';

interface ProductVariant {
  size?: string;
  color?: string;
  pack?: string;
  price: number;
  stock: number;
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
  // const [showShareModal, setShowShareModal] = useState(false);

  const images = product.images || [product.image];
  const hasVariants = product.variantPricing && product.variantPricing.length > 0;

  // Calculate current price
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : (product.inStock ? 100 : 0);

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

  const handleAddToCart = () => {
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
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  disabled={currentImageIndex === 0}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 disabled:opacity-50"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                  disabled={currentImageIndex === images.length - 1}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 disabled:opacity-50"
                >
                  →
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square relative rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Product Title & Rating */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {renderStars(product.rating)}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2 rounded-full ${
                    isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {/* setShowShareModal(true) */}}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900">
            {formatPrice(currentPrice)}
            {hasVariants && selectedVariant && (
              <span className="text-lg text-gray-500 ml-2">
                / {selectedVariant.size || selectedVariant.color || selectedVariant.pack}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {currentStock > 0 ? (
              <div className="flex items-center text-green-600">
                <Check className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  {currentStock > 10 ? 'In Stock' : `Only ${currentStock} left`}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Out of Stock</span>
              </div>
            )}
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

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= currentStock}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={currentStock === 0 || (hasVariants && !selectedVariant)}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700">
                Buy Now
              </button>
            </div>
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

      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
              Description
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Specifications
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Reviews ({product.reviews})
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Shipping & Returns
            </button>
          </nav>
        </div>

        <div className="py-8">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
            
            {product.specifications && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="font-medium text-gray-700 capitalize w-32">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
