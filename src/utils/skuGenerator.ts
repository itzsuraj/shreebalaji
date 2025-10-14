/**
 * Generate SKU for product variants
 * Format: {productId}-{size}-{color}-{pack}
 * Example: 507f1f77bcf86cd799439011-10mm-16l-brown-24-pieces
 */
export function generateVariantSKU(
  productId: string, 
  size?: string, 
  color?: string, 
  pack?: string
): string {
  const parts = [
    productId,
    size?.replace(/\s/g, '-').toLowerCase(),
    color?.replace(/\s/g, '-').toLowerCase(),
    pack?.replace(/\s/g, '-').toLowerCase()
  ].filter(Boolean);
  
  return parts.join('-');
}

/**
 * Generate SKU for simple products
 * Format: {productId}-simple
 */
export function generateSimpleProductSKU(productId: string): string {
  return `${productId}-simple`;
}

/**
 * Generate SKU for product variants with fallback
 * If variant has no SKU, generates one based on the combination
 */
export function ensureVariantSKU(
  variant: {
    size?: string;
    color?: string;
    pack?: string;
    sku?: string;
  },
  productId: string,
  index?: number
): string {
  if (variant.sku) {
    return variant.sku;
  }
  
  // Generate SKU based on variant properties
  if (variant.size || variant.color || variant.pack) {
    return generateVariantSKU(productId, variant.size, variant.color, variant.pack);
  }
  
  // Fallback to index-based SKU
  return `${productId}-variant-${(index || 0) + 1}`;
}
