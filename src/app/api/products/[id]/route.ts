import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    
    const product = await Product.findById(resolvedParams.id);
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
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
        variantPricing: product.variantPricing || [],
        inStock: product.inStock !== false,
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
