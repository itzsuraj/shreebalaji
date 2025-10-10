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
  sizes?: string[]; // e.g., ["10mm (16L)", "11mm (18L)", "12mm (20L)", "15mm (24L)"]
  variants?: Record<string, string[]>; // e.g., { size: ["10mm (16L)", ...] }
  colors?: string[]; // e.g., ["Brown", "Black", "White"]
  packs?: string[]; // e.g., ["24 Pieces", "200 Pieces"]
}

export interface CartItem extends Product {
  quantity: number;
} 