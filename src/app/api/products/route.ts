import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Only return active products for storefront, or all products if none are active
    let products = await Product.find({ status: 'active' }).sort({ createdAt: -1 });
    
    // If no active products, fetch all products (for debugging/development)
    if (!products || products.length === 0) {
      console.log('API: No active products found, fetching all products...');
      products = await Product.find({}).sort({ createdAt: -1 });
    }
    
    console.log(`API: Returning ${products?.length || 0} products`);
    
    return NextResponse.json({ 
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
          variantPricing: product.variantPricing || [],
          inStock: calculatedInStock,
          stockQty: product.stockQty || 0,
          rating: product.rating || 4.5,
          reviews: product.reviews || 0,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        };
      })
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch products' 
    }, { status: 500 });
  }
}




