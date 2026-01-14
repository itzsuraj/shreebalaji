'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  clear: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('wishlist:v1');
        if (raw) setItems(JSON.parse(raw));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem('wishlist:v1', JSON.stringify(items));
      } catch {}
    }
  }, [items, mounted]);

  const addItem = (item: WishlistItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some(i => i.productId === productId);
  };

  const toggleItem = (item: WishlistItem) => {
    if (isInWishlist(item.productId)) {
      removeItem(item.productId);
    } else {
      addItem(item);
    }
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.length, [items]);

  const value: WishlistContextValue = { items, addItem, removeItem, isInWishlist, toggleItem, clear, count };
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
