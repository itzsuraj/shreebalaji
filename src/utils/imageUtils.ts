export const getProductImage = (product: { image?: string; category: string }) => {
  // If product has a specific image, use it
  if (product.image && !product.image.includes('icon.svg')) {
    let imagePath = product.image.trim();
    
    const canonicalHosts = [
      'https://www.balajisphere.com',
      'http://www.balajisphere.com',
      'https://balajisphere.com',
      'http://balajisphere.com',
    ];
    
    for (const host of canonicalHosts) {
      if (imagePath.startsWith(host)) {
        imagePath = imagePath.slice(host.length);
        break;
      }
    }
    
    const isAbsolutePath =
      imagePath.startsWith('http') ||
      imagePath.startsWith('/') ||
      imagePath.startsWith('data:') ||
      imagePath.startsWith('blob:');
    
    if (!isAbsolutePath) {
      imagePath = `/${imagePath}`;
    }
    
    return imagePath;
  }
  
  // Otherwise, use category-based fallback icons
  const categoryIcons: Record<string, string> = {
    'buttons': '/button-icon.svg',
    'zippers': '/zipper.png',
    'elastic': '/woven-elastic.png', // Using PNG instead of empty SVG
    'cords': '/cord-icon.svg',
  };
  
  return categoryIcons[product.category] || '/button-icon.svg';
};

export const getCategoryIcon = (category: string) => {
  const categoryIcons: Record<string, string> = {
    'buttons': '/button-icon.svg',
    'zippers': '/zipper.png',
    'elastic': '/woven-elastic.png', // Using PNG instead of empty SVG
    'cords': '/cord-icon.svg',
  };
  
  return categoryIcons[category] || '/button-icon.svg';
};

// Normalize variant image path (same logic as getProductImage)
export const normalizeImagePath = (imagePath?: string): string | undefined => {
  if (!imagePath) return undefined;
  
  let normalized = imagePath.trim();
  if (!normalized || normalized.includes('icon.svg')) return undefined;
  
  const canonicalHosts = [
    'https://www.balajisphere.com',
    'http://www.balajisphere.com',
    'https://balajisphere.com',
    'http://balajisphere.com',
  ];
  
  for (const host of canonicalHosts) {
    if (normalized.startsWith(host)) {
      normalized = normalized.slice(host.length);
      break;
    }
  }
  
  const isAbsolutePath =
    normalized.startsWith('http') ||
    normalized.startsWith('/') ||
    normalized.startsWith('data:') ||
    normalized.startsWith('blob:');
  
  if (!isAbsolutePath) {
    normalized = `/${normalized}`;
  }
  
  return normalized;
};

// Get product display image - prioritizes first variant image if available
export const getProductDisplayImage = (product: { 
  image?: string; 
  category: string;
  variantPricing?: Array<{
    image?: string;
    [key: string]: any;
  }>;
}) => {
  // If product has variants with images, use the first variant's image
  if (product.variantPricing && product.variantPricing.length > 0) {
    const firstVariant = product.variantPricing[0];
    if (firstVariant?.image) {
      const normalizedImage = normalizeImagePath(firstVariant.image);
      if (normalizedImage) {
        return normalizedImage;
      }
    }
  }
  // Otherwise, use the main product image
  return getProductImage(product);
}; 