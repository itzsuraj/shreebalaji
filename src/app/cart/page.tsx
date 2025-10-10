'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotalInPaise } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Your cart is empty.</p>
          <Link href="/products" className="text-blue-600 hover:text-blue-800">Continue shopping →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.productId} className="border rounded p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.size && <div className="text-xs text-gray-500">Size: {item.size}</div>}
                  {item.color && <div className="text-xs text-gray-500">Color: {item.color}</div>}
                  {item.pack && <div className="text-xs text-gray-500">Contains: {item.pack}</div>}
                  <div className="text-sm text-gray-600">₹{item.price} ×</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 py-1 border rounded">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 border rounded">+</button>
                  <button onClick={() => removeItem(item.productId)} className="ml-4 text-red-600">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="border rounded p-4">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>₹{(subtotalInPaise/100).toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">GST 18% and shipping calculated at checkout</p>
              <Link href="/checkout" className="block text-center mt-4 bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


