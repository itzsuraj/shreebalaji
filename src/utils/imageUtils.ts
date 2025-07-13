export const getProductImage = (product: { image?: string; category: string }) => {
  // If product has a specific image, use it
  if (product.image && !product.image.includes('icon.svg')) {
    return product.image;
  }
  
  // Otherwise, use category-based fallback icons
  const categoryIcons: Record<string, string> = {
    'buttons': '/button-icon.svg',
    'zippers': '/zipper-icon.svg',
    'elastic': '/elastic-icon.svg',
    'cords': '/cord-icon.svg',
  };
  
  return categoryIcons[product.category] || '/button-icon.svg';
};

export const getCategoryIcon = (category: string) => {
  const categoryIcons: Record<string, string> = {
    'buttons': '/button-icon.svg',
    'zippers': '/zipper-icon.svg',
    'elastic': '/elastic-icon.svg',
    'cords': '/cord-icon.svg',
  };
  
  return categoryIcons[category] || '/button-icon.svg';
}; 