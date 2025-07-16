import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: '18l chalk button 2h shiny (DD)',
    description: 'High-quality metal buttons perfect for jackets, coats, and heavy-duty garments. Available in various finishes including antique brass, silver, and gunmetal.',
    price: 249,
    category: 'buttons',
    image: '/IMG-20250713-WA0021.jpg',
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
    image: '/zipper.png',
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
    name: 'metal Snap Buttons - 15mm',
    description: 'Versatile plastic snap buttons with easy installation. Perfect for baby clothes, casual wear, and lightweight garments.',
    price: 166,
    category: 'buttons',
    image: '/plastic-snap-buttons-15mm.jpg',
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
    image: '/zipper.png',
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
    name: 'Wooden Buttons - 11mm',
    description: 'Elegant wooden buttons perfect for eco-friendly and natural garment designs. Lightweight and stylish.',
    price: 291,
    category: 'buttons',
    image: '/wooden-buttons-20mm.jpg',
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
    image: '/zipper.png',
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
  },
  {
    id: '11',
    name: 'Elastic cord bundel',
    description: 'Beautiful decorative metal buttons with intricate designs, perfect for formal wear, coats, and premium garments.',
    price: 324,
    category: 'buttons',
    image: '/decorative-metal-buttons-22mm.jpg',
    rating: 4.9,
    reviews: 203,
    inStock: true,
    features: [
      'Elastic construction',
      'White color',
      'Flexible material',
      'Multiple uses',
      'Durable'
    ],
    specifications: {
      'Material': 'Elastic',
      'Color': 'White',
      'Length': '100 yards',
      'Thickness': '2mm',
      'Use': 'Drawstrings/Ties'
    }
  },
  {
    id: '12',
    name: 'Pant Buttons - 15mm',
    description: 'Classic shirt buttons perfect for formal shirts, blouses, and professional attire. Clean and professional appearance.',
    price: 89,
    category: 'buttons',
    image: '/shirt-buttons-12mm.jpg',
    rating: 4.6,
    reviews: 178,
    inStock: true,
    features: [
      '15mm diameter',
      'Classic design',
      'Professional finish',
      'Easy to sew',
      'Multiple colors'
    ],
    specifications: {
      'Material': 'Metal',
      'Size': '15mm',
      'Pack Size': '25 pieces',
      'Colors': 'White/Black/Navy',
      'Style': 'Classic'
    }
  },
  {
    id: '13',
    name: 'Fashion Buttons - 16mm',
    description: 'Trendy fashion buttons with modern designs, perfect for contemporary clothing and fashion-forward garments.',
    price: 198,
    category: 'buttons',
    image: '/fashion-buttons-16mm.jpg',
    rating: 4.7,
    reviews: 145,
    inStock: true,
    features: [
      '16mm diameter',
      'Modern design',
      'Fashion-forward',
      'Multiple styles',
      'Trendy colors'
    ],
    specifications: {
      'Material': 'Mixed',
      'Size': '16mm',
      'Pack Size': '15 pieces',
      'Styles': 'Geometric/Abstract',
      'Colors': 'Various'
    }
  },
  {
    id: '14',
    name: '18l 2h rainbow shell buttons',
    description: 'Vintage-inspired buttons with classic designs, perfect for retro clothing and nostalgic fashion pieces.',
    price: 267,
    category: 'buttons',
    image: '/vintage-style-buttons-18mm.jpg',
    rating: 4.8,
    reviews: 167,
    inStock: true,
    features: [
      '18mm diameter',
      'Vintage design',
      'Classic style',
      'Retro appeal',
      'Unique patterns'
    ],
    specifications: {
      'Material': 'Metal/Plastic',
      'Size': '18mm',
      'Pack Size': '12 pieces',
      'Style': 'Vintage',
      'Finish': 'Antique'
    }
  },
  {
    id: '15',
    name: '18l 4h horn buttons (112)',
    description: 'Premium luxury buttons with sophisticated designs, perfect for high-end garments and designer clothing.',
    price: 456,
    category: 'buttons',
    image: '/luxury-buttons-20mm.jpg',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    features: [
      '20mm diameter',
      'Luxury finish',
      'Sophisticated design',
      'Premium quality',
      'Designer grade'
    ],
    specifications: {
      'Material': 'Premium Metal',
      'Size': '20mm',
      'Pack Size': '8 pieces',
      'Finish': 'Luxury',
      'Quality': 'Designer'
    }
  },
  {
    id: '16',
    name: 'Chalk Buttons - 16mm',
    description: 'Elegant chalk-finish buttons with a sophisticated matte appearance, perfect for modern and minimalist garment designs.',
    price: 189,
    category: 'buttons',
    image: '/chalk-buttons-16mm.jpg',
    rating: 4.6,
    reviews: 134,
    inStock: true,
    features: [
      '16mm diameter',
      'Chalk finish',
      'Matte appearance',
      'Modern design',
      'Minimalist style'
    ],
    specifications: {
      'Material': 'Metal',
      'Size': '16mm',
      'Pack Size': '15 pieces',
      'Finish': 'Chalk',
      'Style': 'Modern'
    }
  },
  {
    id: '17',
    name: 'Down Hole Metal Buttons - 11mm',
    description: 'Professional down hole metal buttons with secure attachment, ideal for heavy-duty garments and outdoor wear.',
    price: 278,
    category: 'buttons',
    image: '/down-hole-metal-buttons-18mm.jpg',
    rating: 4.8,
    reviews: 156,
    inStock: true,
    features: [
      '18mm diameter',
      'Down hole design',
      'Secure attachment',
      'Heavy-duty',
      'Professional finish'
    ],
    specifications: {
      'Material': 'Metal',
      'Size': '18mm',
      'Pack Size': '12 pieces',
      'Design': 'Down Hole',
      'Use': 'Heavy-duty'
    }
  },
  {
    id: '18',
    name: 'Polyester Buttons White - 15mm',
    description: 'Clean white polyester buttons perfect for formal shirts, medical uniforms, and professional attire.',
    price: 95,
    category: 'buttons',
    image: '/polyester-buttons-white-15mm.jpg',
    rating: 4.5,
    reviews: 223,
    inStock: true,
    features: [
      '15mm diameter',
      'Pure white color',
      'Professional finish',
      'Easy to clean',
      'Formal appearance'
    ],
    specifications: {
      'Material': 'Polyester',
      'Size': '15mm',
      'Pack Size': '30 pieces',
      'Color': 'White',
      'Use': 'Formal wear'
    }
  },
  {
    id: '19',
    name: 'Elastic Cord White',
    description: 'High-quality white elastic cord perfect for drawstrings, ties, and various garment applications requiring flexibility.',
    price: 73,
    category: 'cords',
    image: '/elastic-cord-white.jpg',
    rating: 4.7,
    reviews: 189,
    inStock: true,
    features: [
      'Elastic construction',
      'White color',
      'Flexible material',
      'Multiple uses',
      'Durable'
    ],
    specifications: {
      'Material': 'Elastic',
      'Color': 'White',
      'Length': '100 yards',
      'Thickness': '2mm',
      'Use': 'Drawstrings/Ties'
    }
  },
  {
    id: '20',
    name: 'Fancy Tassel - Decorative',
    description: 'Elegant decorative tassels perfect for adding a touch of luxury to garments, bags, and accessories. Available in various colors and styles.',
    price: 45,
    category: 'cords',
    image: '/IMG-20250713-WA0010.jpg',
    rating: 4.8,
    reviews: 67,
    inStock: true,
    features: [
      'Decorative design',
      'Multiple colors',
      'Luxury finish',
      'Versatile use',
      'High-quality material'
    ],
    specifications: {
      'Material': 'Silk/Cotton Blend',
      'Length': '8 inches',
      'Pack Size': '12 pieces',
      'Colors': 'Gold/Silver/Red/Blue/Green',
      'Use': 'Decorative Accessories'
    }
  }
]; 