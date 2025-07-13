export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  features?: string[];
  specifications?: Record<string, string>;
}

export interface CartItem extends Product {
  quantity: number;
} 