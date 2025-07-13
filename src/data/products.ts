import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Metal Buttons - 18mm',
    description: 'High-quality metal buttons perfect for jackets, coats, and heavy-duty garments. Available in various finishes including antique brass, silver, and gunmetal.',
    price: 249,
    category: 'buttons',
    image: '/button-icon.svg',
    rating: 4.8,
    reviews: 156,
    inStock: true,
    features: [
      '18mm diameter',
      'Metal construction',
      'Multiple finishes available',
      'Suitable for heavy fabrics',
      'Professional finish'
    ],
    specifications: {
      'Material': 'Metal',
      'Size': '18mm',
      'Pack Size': '12 pieces',
      'Finish': 'Antique Brass/Silver/Gunmetal',
      'Weight': '5g per button'
    }
  },
  {
    id: '2',
    name: 'Nylon Coil Zipper - 5"',
    description: 'Durable nylon coil zipper with metal slider, perfect for bags, jackets, and various garment applications. Smooth operation and reliable performance.',
    price: 124,
    category: 'zippers',
    image: '/zipper-icon.svg',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    features: [
      'Nylon coil construction',
      'Metal slider',
      '5-inch length',
      'Smooth operation',
      'Multiple colors available'
    ],
    specifications: {
      'Material': 'Nylon Coil',
      'Length': '5 inches',
      'Slider': 'Metal',
      'Colors': 'Black/White/Navy/Red',
      'Pack Size': '10 pieces'
    }
  },
  {
    id: '3',
    name: 'Elastic Band - 1/2" Width',
    description: 'High-quality elastic band with excellent stretch and recovery. Perfect for waistbands, cuffs, and other garment applications requiring flexibility.',
    price: 82,
    category: 'elastic',
    image: '/elastic-icon.svg',
    rating: 4.7,
    reviews: 234,
    inStock: true,
    features: [
      '1/2 inch width',
      'Excellent stretch',
      'Good recovery',
      'Soft feel',
      'Washable'
    ],
    specifications: {
      'Width': '1/2 inch',
      'Material': 'Polyester/Rubber',
      'Length': '10 yards',
      'Color': 'White/Black',
      'Stretch': '2.5x'
    }
  },
  {
    id: '4',
    name: 'Cotton Cord - 3mm Thickness',
    description: 'Natural cotton cord perfect for drawstrings, ties, and decorative applications. Soft, durable, and available in various colors.',
    price: 107,
    category: 'cords',
    image: '/cord-icon.svg',
    rating: 4.5,
    reviews: 167,
    inStock: true,
    features: [
      'Natural cotton',
      '3mm thickness',
      'Soft texture',
      'Multiple colors',
      'Washable'
    ],
    specifications: {
      'Material': '100% Cotton',
      'Thickness': '3mm',
      'Length': '50 yards',
      'Colors': 'Natural/Black/White/Navy',
      'Weight': 'Light'
    }
  },
  {
    id: '5',
    name: 'Plastic Snap Buttons - 15mm',
    description: 'Versatile plastic snap buttons with easy installation. Perfect for baby clothes, casual wear, and lightweight garments.',
    price: 166,
    category: 'buttons',
    image: '/button-icon.svg',
    rating: 4.4,
    reviews: 98,
    inStock: true,
    features: [
      '15mm diameter',
      'Easy installation',
      'Lightweight',
      'Multiple colors',
      'Child-safe'
    ],
    specifications: {
      'Material': 'Plastic',
      'Size': '15mm',
      'Pack Size': '20 pieces',
      'Colors': 'White/Black/Red/Blue',
      'Installation': 'Snap-on'
    }
  },
  {
    id: '6',
    name: 'Invisible Zipper - 7"',
    description: 'Professional invisible zipper for seamless garment construction. Perfect for dresses, skirts, and formal wear.',
    price: 207,
    category: 'zippers',
    image: '/zipper-icon.svg',
    rating: 4.9,
    reviews: 123,
    inStock: true,
    features: [
      'Invisible installation',
      '7-inch length',
      'Professional finish',
      'Smooth operation',
      'Multiple colors'
    ],
    specifications: {
      'Type': 'Invisible',
      'Length': '7 inches',
      'Material': 'Polyester',
      'Colors': 'Black/White/Navy/Beige',
      'Pack Size': '5 pieces'
    }
  },
  {
    id: '7',
    name: 'Wide Elastic Band - 1" Width',
    description: 'Wide elastic band perfect for waistbands, sports wear, and heavy-duty applications. Excellent stretch and durability.',
    price: 149,
    category: 'elastic',
    image: '/elastic-icon.svg',
    rating: 4.6,
    reviews: 145,
    inStock: true,
    features: [
      '1-inch width',
      'Heavy-duty',
      'Excellent stretch',
      'Durable construction',
      'Washable'
    ],
    specifications: {
      'Width': '1 inch',
      'Material': 'Polyester/Rubber',
      'Length': '5 yards',
      'Color': 'White/Black',
      'Stretch': '3x'
    }
  },
  {
    id: '8',
    name: 'Braided Cotton Cord - 5mm',
    description: 'Thick braided cotton cord ideal for drawstrings, bag handles, and decorative applications. Strong and durable construction.',
    price: 157,
    category: 'cords',
    image: '/cord-icon.svg',
    rating: 4.3,
    reviews: 78,
    inStock: true,
    features: [
      'Braided construction',
      '5mm thickness',
      'Strong and durable',
      'Natural material',
      'Multiple colors'
    ],
    specifications: {
      'Material': '100% Cotton',
      'Thickness': '5mm',
      'Length': '25 yards',
      'Colors': 'Natural/Black/White/Brown',
      'Construction': 'Braided'
    }
  },
  {
    id: '9',
    name: 'Wooden Buttons - 20mm',
    description: 'Elegant wooden buttons perfect for eco-friendly and natural garment designs. Lightweight and stylish.',
    price: 291,
    category: 'buttons',
    image: '/button-icon.svg',
    rating: 4.7,
    reviews: 112,
    inStock: true,
    features: [
      'Natural wood',
      '20mm diameter',
      'Eco-friendly',
      'Lightweight',
      'Unique grain patterns'
    ],
    specifications: {
      'Material': 'Natural Wood',
      'Size': '20mm',
      'Pack Size': '8 pieces',
      'Finish': 'Natural/Stained',
      'Weight': 'Light'
    }
  },
  {
    id: '10',
    name: 'Decorative Zipper Pulls',
    description: 'Stylish decorative zipper pulls to customize and enhance your zipper applications. Available in various designs and finishes.',
    price: 66,
    category: 'zippers',
    image: '/zipper-icon.svg',
    rating: 4.5,
    reviews: 89,
    inStock: true,
    features: [
      'Decorative designs',
      'Easy installation',
      'Multiple styles',
      'Metal construction',
      'Customizable'
    ],
    specifications: {
      'Material': 'Metal',
      'Pack Size': '15 pieces',
      'Styles': 'Geometric/Animal/Abstract',
      'Finish': 'Silver/Gold/Bronze',
      'Installation': 'Snap-on'
    }
  }
]; 