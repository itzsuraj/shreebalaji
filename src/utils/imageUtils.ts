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
    'elastic': '/elastic-icon.svg',
    'cords': '/cord-icon.svg',
  };
  
  return categoryIcons[product.category] || '/button-icon.svg';
};

export const getCategoryIcon = (category: string) => {
  const categoryIcons: Record<string, string> = {
    'buttons': '/button-icon.svg',
    'zippers': '/zipper.png',
    'elastic': '/elastic-icon.svg',
    'cords': '/cord-icon.svg',
  };
  
  return categoryIcons[category] || '/button-icon.svg';
}; 