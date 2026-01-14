import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    await connectToDatabase();
    
    // Only return active products for storefront, or all products if none are active
    // Limit fields to only what's needed for better performance
    let products = await Product.find({ status: 'active' })
      .select('_id name description price category image sizes colors packs variantPricing stockQty rating reviews createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean()
      .limit(100); // Limit to 100 products for performance
    
    // If no active products, fetch all products (for debugging/development)
    if (!products || products.length === 0) {
      products = await Product.find({})
        .select('_id name description price category image sizes colors packs variantPricing stockQty rating reviews createdAt updatedAt')
        .sort({ createdAt: -1 })
        .lean()
        .limit(100);
    }
    
    const response = NextResponse.json({ 
      success: true, 
      products: products.map(product => {
        // Recalculate inStock based on actual stock
        const hasVariants = product.variantPricing && product.variantPricing.length > 0;
        let calculatedInStock = false;
        
        if (hasVariants) {
          // Check if any variant has stock
          calculatedInStock = product.variantPricing.some((v: any) => 
            (v.stockQty ?? 0) > 0 || v.inStock === true
          );
        } else {
          // Check product-level stock
          calculatedInStock = (product.stockQty ?? 0) > 0;
        }
        
        return {
          _id: product._id,
          id: product._id, // For compatibility with frontend
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          sizes: product.sizes || [],
          colors: product.colors || [],
          packs: product.packs || [],
          variantPricing: (product.variantPricing || []).map((v: any) => ({
            size: v.size || undefined,
            color: v.color || undefined,
            pack: v.pack || undefined,
            quality: v.quality || undefined,
            quantity: v.quantity || undefined,
            price: v.price || 0,
            stockQty: v.stockQty || 0,
            inStock: v.inStock || false,
            sku: v.sku || undefined,
            image: v.image || undefined,
          })),
          inStock: calculatedInStock,
          stockQty: product.stockQty || 0,
          rating: product.rating || 4.5,
          reviews: product.reviews || 0,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        };
      })
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch products' 
    }, { status: 500 });
  }
}




