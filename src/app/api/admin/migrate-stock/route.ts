import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function POST() {
  try {
    await connectToDatabase();

    // Find all products that don't have stockQty field
    const productsWithoutStock = await Product.find({
      $or: [
        { stockQty: { $exists: false } },
        { stockQty: null }
      ]
    });

    if (productsWithoutStock.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'All products already have stock fields. Migration not needed.',
        updated: 0 
      });
    }

    // Update each product
    let updatedCount = 0;
    for (const product of productsWithoutStock) {
      const updateData: {
        stockQty: number;
        inStock: boolean;
        variantPricing?: Array<{
          size?: string;
          color?: string;
          pack?: string;
          price: number;
          stockQty: number;
          inStock: boolean;
          sku: string;
        }>;
      } = {
        stockQty: 100, // Default stock for simple products
        inStock: true
      };

      // If product has variantPricing, update those too
      if (product.variantPricing && product.variantPricing.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateData.variantPricing = product.variantPricing.map((variant: any, index: number) => ({
          ...variant.toObject(),
          stockQty: variant.stockQty || 50, // Default stock for variants
          inStock: variant.inStock !== false,
          sku: variant.sku || `${product._id}-variant-${index + 1}` // Generate SKU if missing
        }));
      }

      await Product.findByIdAndUpdate(product._id, updateData);
      updatedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Migration completed! Updated ${updatedCount} products.`,
      updated: updatedCount 
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Migration failed' 
    }, { status: 500 });
  }
}
