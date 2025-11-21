export const getProductImage = (product: { image?: string; category: string }) => {
  // If product has a specific image, use it
  if (product.image && !product.image.includes('icon.svg')) {
    // Ensure the image path starts with / if it's a local path
    let imagePath = product.image;
    
    const isAbsolutePath = imagePath.startsWith('http') || imagePath.startsWith('/') || imagePath.startsWith('data:') || imagePath.startsWith('blob:');
    // If it's a local path (not a full URL or data/blob URI), ensure it starts with /
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