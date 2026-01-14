'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItemVariant, updateQuantity, clear, subtotalInPaise, count } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  const handleQuantityChange = (item: typeof items[0], delta: number) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    // Find the item and update its quantity
    const itemToUpdate = items.find(i => 
      i.productId === item.productId && 
      i.size === item.size && 
      i.color === item.color && 
      i.pack === item.pack && 
      i.sku === item.sku
    );
    if (itemToUpdate) {
      updateQuantity(item.productId, newQuantity);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Shopping Cart
              </h2>
              <p className="text-sm text-gray-600">
                {mounted ? `${count} ${count === 1 ? 'item' : 'items'}` : '0 items'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-700 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-0">
          {!mounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to your cart</p>
              <Link
                href="/products"
                onClick={onClose}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-3 pb-0">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size || ''}-${item.color || ''}-${item.pack || ''}-${item.sku || ''}`}
                  className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <Link
                    href={`/products/${item.productId}`}
                    onClick={onClose}
                    className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      onClick={onClose}
                      className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2 mb-1"
                    >
                      {item.name}
                    </Link>
                    {(item.size || item.color || item.pack) && (
                      <p className="text-xs text-gray-500 mb-1">
                        {[item.size, item.color, item.pack].filter(Boolean).join(', ')}
                      </p>
                    )}
                    <p className="text-primary-600 font-semibold text-sm mb-2">₹{item.price.toLocaleString()} each</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3 text-gray-600" />
                        </button>
                        <span className="w-10 text-center font-semibold text-gray-900 py-1">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3 text-gray-600" />
                        </button>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 ml-auto">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                      <button
                        onClick={() => removeItemVariant(item)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove item"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total and Actions */}
        {mounted && items.length > 0 && (
          <div className="border-t-2 border-gray-200 px-6 pt-4 pb-6 bg-gradient-to-br from-gray-50 to-primary-50">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-700">Subtotal:</span>
                <span className="text-xl font-bold text-primary-600">
                  ₹{(subtotalInPaise / 100).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Shipping and taxes calculated at checkout
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3.5 px-4 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Go to Secure Checkout
              </button>
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 py-3 px-4 rounded-lg transition-all duration-200 font-semibold text-center"
              >
                View Full Cart
              </Link>
              <button
                onClick={clear}
                className="w-full text-red-600 hover:text-red-700 py-2 text-sm font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
