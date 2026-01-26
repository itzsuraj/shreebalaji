'use client';

import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Toast from '@/components/ui/Toast';

interface ProductActionsProps {
  productName: string;
  productId: string;
  price: number;
  image?: string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  packs?: string[];
  variantPricing?: Array<{
    size?: string;
    color?: string;
    pack?: string;
    price: number;
    stockQty?: number;
    inStock?: boolean;
    sku?: string;
  }>;
}

export default function ProductActions({ productName, productId, price, image, category, sizes = [], colors = [], packs = [], variantPricing = [] }: ProductActionsProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || '');
  const [selectedPack, setSelectedPack] = useState<string>(packs[0] || '');
  const [qty, setQty] = useState<number>(1);

  // Resolve selected variant
  const getSelectedVariant = () => {
    if (variantPricing.length === 0) return undefined;
    return variantPricing.find(variant => 
      variant.size === selectedSize && 
      variant.color === selectedColor && 
      variant.pack === selectedPack
    );
  };

  const selectedVariant = getSelectedVariant();

  // Calculate current price based on variant selection
  const getCurrentPrice = () => {
    if (variantPricing.length === 0) {
      return price;
    }

    return selectedVariant ? selectedVariant.price : price;
  };

  const currentPrice = getCurrentPrice();
  const availableStock = typeof selectedVariant?.stockQty === 'number' ? selectedVariant!.stockQty! : undefined;
  const isVariantInStock = selectedVariant ? (selectedVariant.inStock ?? (Number(availableStock) > 0)) : false;
  const isActionDisabled = variantPricing.length > 0 && (!selectedVariant || !isVariantInStock || (availableStock !== undefined && qty > availableStock));

  const handleAddToCart = () => {
    addItem({ productId, name: productName, price: currentPrice, quantity: qty, image, category, size: selectedSize, color: selectedColor, pack: selectedPack, sku: selectedVariant?.sku });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = () => {
    addItem({ productId, name: productName, price: currentPrice, quantity: qty, image, category, size: selectedSize, color: selectedColor, pack: selectedPack, sku: selectedVariant?.sku });
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col space-y-3 relative">
      {/* Dynamic Price Display */}
      {variantPricing.length > 0 && (
        <div className="bg-primary-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Selected Variant Price:</div>
          <div className="text-2xl font-bold text-primary-600">₹{currentPrice.toLocaleString()}</div>
          {currentPrice !== price && (
            <div className="text-sm text-gray-500">
              Base price: ₹{price.toLocaleString()}
            </div>
          )}
        </div>
      )}
      {sizes.length > 0 && (
        <div>
          <span className="block text-sm font-medium mb-1">Size</span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const isActive = s === selectedSize;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`px-3 py-1.5 rounded border text-sm transition-colors ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400'}`}
                  aria-pressed={isActive}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {colors.length > 0 && (
        <div>
          <span className="block text-sm font-medium mb-1">Color</span>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const isActive = c === selectedColor;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`px-3 py-1.5 rounded border text-sm transition-colors ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400'}`}
                  aria-pressed={isActive}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {packs.length > 0 && (
        <div>
          <span className="block text-sm font-medium mb-1">Contains</span>
          <div className="flex flex-wrap gap-2">
            {packs.map((p) => {
              const isActive = p === selectedPack;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPack(p)}
                  className={`px-3 py-1.5 rounded border text-sm transition-colors ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400'}`}
                  aria-pressed={isActive}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantity</span>
        <div className="inline-flex items-center border rounded">
          <button type="button" className="px-3 py-1" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
          <span className="px-4 select-none">{qty}</span>
          <button type="button" className="px-3 py-1" onClick={() => setQty(q => availableStock !== undefined ? Math.min(availableStock, q + 1) : q + 1)}>+</button>
        </div>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={handleAddToCart}
          aria-live="polite"
          disabled={isActionDisabled}
          className={`flex-1 ${added ? 'bg-green-700 ring-2 ring-green-200 scale-[1.02] animate-pulse' : 'bg-green-600'} text-white py-3 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center ${isActionDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {added ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </>
          )}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={isActionDisabled}
          className={`flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all ${isActionDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Buy Now
        </button>
      </div>
      <Toast message={`${productName} added to cart`} isVisible={added} onClose={() => setAdded(false)} />
    </div>
  );
} 