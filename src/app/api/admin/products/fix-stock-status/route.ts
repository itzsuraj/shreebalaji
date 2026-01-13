import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get all products
    const products = await Product.find();
    
    let fixedCount = 0;
    
    // Fix each product's inStock status
    for (const product of products) {
      const hasVariants = product.variantPricing && product.variantPricing.length > 0;
      
      let shouldBeInStock = false;
      
      if (hasVariants) {
        // Check if any variant has stock
        shouldBeInStock = product.variantPricing.some((v: any) => 
          (v.stockQty ?? 0) > 0 || v.inStock === true
        );
      } else {
        // Check product-level stock
        shouldBeInStock = (product.stockQty ?? 0) > 0;
      }
      
      // Update if different
      if (product.inStock !== shouldBeInStock) {
        product.inStock = shouldBeInStock;
        await product.save();
        fixedCount++;
      }
    }
    
    // Revalidate cache
    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath('/admin/products');
    
    return NextResponse.json({ 
      success: true, 
      fixedCount,
      message: `Fixed stock status for ${fixedCount} product(s)` 
    });
  } catch (error) {
    console.error('Error fixing stock statuses:', error);
    return NextResponse.json(
      { error: 'Failed to fix stock statuses' }, 
      { status: 500 }
    );
  }
}

