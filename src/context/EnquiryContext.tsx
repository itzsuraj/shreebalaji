'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/product';

export interface EnquiryItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  message?: string;
  timestamp: Date;
}

interface EnquiryContextType {
  enquiries: EnquiryItem[];
  addEnquiry: (product: Product, quantity: number, message?: string) => void;
  removeEnquiry: (enquiryId: string) => void;
  updateEnquiry: (enquiryId: string, updates: Partial<EnquiryItem>) => void;
  clearEnquiries: () => void;
  totalEnquiries: number;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);

  const addEnquiry = (product: Product, quantity: number, message?: string) => {
    const newEnquiry: EnquiryItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      quantity,
      message,
      timestamp: new Date(),
    };

    setEnquiries(currentEnquiries => [...currentEnquiries, newEnquiry]);
  };

  const removeEnquiry = (enquiryId: string) => {
    setEnquiries(currentEnquiries => 
      currentEnquiries.filter(enquiry => enquiry.id !== enquiryId)
    );
  };

  const updateEnquiry = (enquiryId: string, updates: Partial<EnquiryItem>) => {
    setEnquiries(currentEnquiries =>
      currentEnquiries.map(enquiry =>
        enquiry.id === enquiryId ? { ...enquiry, ...updates } : enquiry
      )
    );
  };

  const clearEnquiries = () => {
    setEnquiries([]);
  };

  const totalEnquiries = enquiries.length;

  return (
    <EnquiryContext.Provider
      value={{
        enquiries,
        addEnquiry,
        removeEnquiry,
        updateEnquiry,
        clearEnquiries,
        totalEnquiries,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (context === undefined) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
} 