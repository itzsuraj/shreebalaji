import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';
import { normalizeImagePath } from '@/utils/imageUtils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    
    // Only return active products for storefront
    const product = await Product.findOne({ _id: resolvedParams.id, status: 'active' });
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }
    
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
    
    return NextResponse.json({ 
      success: true, 
      product: {
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
          image: v.image ? normalizeImagePath(v.image) || v.image : undefined,
        })),
        inStock: calculatedInStock,
        stockQty: product.stockQty || 0,
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch product' 
    }, { status: 500 });
  }
}








