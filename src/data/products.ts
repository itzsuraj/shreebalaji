import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: '18l chalk button 2h shiny (DD)',
    description: 'High-quality metal buttons perfect for jackets, coats, and heavy-duty garments. Available in various finishes including antique brass, silver, and gunmetal.',
    price: 249,
    category: 'buttons',
    image: '/shiny-button.webp',
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
    name: 'Elastic Band - 1 inch" Width',
    description: 'High-quality elastic band with excellent stretch and recovery. Perfect for waistbands, cuffs, and other garment applications requiring flexibility.',
    price: 82,
    category: 'elastic',
    image: '/woven-elastic.png',
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
    image: '/cotton-cord.png',
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
    name: 'Satin Cord - 3mm Multiple Colors',
    description: 'Premium 3mm satin cords available in a wide range of vibrant colors. Perfect for drawstrings, decorative applications, and garment accessories. Features a luxurious satin finish with subtle metallic sheen.',
    price: 189,
    category: 'cords',
    image: '/satin-tape.png',
    rating: 4.5,
    reviews: 92,
    inStock: true,
    features: [
      '3mm thickness',
      'Satin finish',
      'Metallic sheen',
      'Wide color range',
      'Premium quality'
    ],
    specifications: {
      'Material': 'Satin',
      'Thickness': '3mm',
      'Length': '30 yards',
      'Colors': 'White, Lime Green, Teal, Peach, Yellow, Pink, Fuchsia, Red, Purple & more',
      'Finish': 'Satin with metallic sheen'
    }
  },
  {
    id: '8',
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
    id: '9',
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
    id: '10',
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
    id: '11',
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
    id: '12',
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
    id: '13',
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
    id: '14',
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
    id: '15',
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
    id: '16',
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
    id: '17',
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
    id: '18',
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
    id: '19',
    name: 'Nylon Stylish Tassels',
    description: 'Due to our enormous understanding and massive knowledge of this business, we are involved in offering Stylish Decorative Tassels. Perfect for ladies tops, scarves, and various decorative applications.',
    price: 12,
    category: 'cords',
    image: '/fancy-tassel.png',
    rating: 4.8,
    reviews: 67,
    inStock: true,
    features: [
      '5.2 inch size',
      'Polyester material',
      'Decorative use',
      'Plain pattern',
      'Lightweight design'
    ],
    specifications: {
      'Size': '5.2"',
      'Material': 'Polyester',
      'Use': 'Decoration',
      'Packaging Type': 'Packet',
      'Pattern': 'Plain',
      'Weight (Gram)': '10',
      'Usage': 'Ladies Top, Scarf'
    }
  },
  {
    id: '20',
    name: 'White Round Galaxy Plastic Button',
    description: 'Beautiful white round galaxy plastic buttons with a unique pearl-like finish. Perfect for adding a touch of elegance to garments, especially formal wear and decorative applications.',
    price: 1,
    category: 'buttons',
    image: '/galaxy-pearl-button.png',
    rating: 4.8,
    reviews: 45,
    inStock: true,
    features: [
      '2.5mm diameter',
      'Galaxy pearl finish',
      'White color',
      'Round shape',
      'Plastic material'
    ],
    specifications: {
      'Color': 'White',
      'Shape': 'Round',
      'Size/Dimension': '2.5mm(D)',
      'Material': 'Plastic',
      'Usage/Application': 'Garments',
      'Packing Type': 'Loose',
      'Product Shape': 'Galaxy'
    }
  },
  {
    id: '21',
    name: 'Multicolor Fabric Cover Button',
    description: 'Versatile multicolor fabric cover buttons perfect for garments. These self-covered buttons can be customized with your own fabric to match your garment perfectly. Available in various sizes from 9-15mm with 2-hole design.',
    price: 100,
    category: 'buttons',
    image: '/fabric-cover-button.png',
    rating: 4.7,
    reviews: 78,
    inStock: true,
    features: [
      '9-15mm size range',
      '2-hole design',
      'Multicolor options',
      'Fabric coverable',
      'Garment compatible'
    ],
    specifications: {
      'Color': 'Multi Colour',
      'Usage/Application': 'Garments',
      'Packaging Type': 'Packet',
      'Shape': 'Round',
      'Quantity Per Pack': '10 gross',
      'Size/Dimension': '9-15mm',
      'Product Type': 'Button',
      'Material': 'Fabric, Steel, Plastic',
      'No Of Holes': '2',
      'Hole Type': '2 hole',
      'Usage': 'Garments'
    }
  },
  {
    id: '22',
    name: 'Round Plastic Transparent Button',
    description: 'ALL SIZES DYEABLE TPT BUTTON DYEABLE. High-quality transparent plastic buttons perfect for garments. These dyeable buttons can be customized to match any fabric color, making them extremely versatile for various garment applications.',
    price: 288,
    category: 'buttons',
    image: '/transparent-button.png',
    rating: 4.6,
    reviews: 92,
    inStock: true,
    features: [
      '18L size',
      'Transparent property',
      'Dyeable material',
      '4-hole design',
      '1728 pieces per pack'
    ],
    specifications: {
      'Shape': 'Round',
      'Size/Dimension': '18L',
      'Material': 'Plastic',
      'Usage/Application': 'Garments',
      'Packaging Type': 'Packet',
      'Property': 'Transparent',
      'Packet Content': '1728 Pieces',
      'No of Holes': '4'
    }
  },
  
]; 