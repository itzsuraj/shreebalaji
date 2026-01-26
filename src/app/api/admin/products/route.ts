import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    // Skip rate limiting for GET requests to avoid production issues
    // This can be re-enabled later if needed

    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('[Admin Products API] Database connection failed:', dbError);
      const errorMessage = process.env.NODE_ENV === 'production'
        ? 'Database connection failed'
        : (dbError instanceof Error ? dbError.message : 'Database connection failed');
      return NextResponse.json({ 
        error: errorMessage,
        products: [] 
      }, { status: 500 });
    }
    
    // Fetch products with error handling
    let products;
    try {
      products = await Product.find().sort({ createdAt: -1 }).limit(200).lean();
    } catch (queryError) {
      console.error('[Admin Products API] Database query failed:', queryError);
      const errorMessage = process.env.NODE_ENV === 'production'
        ? 'Failed to query products'
        : (queryError instanceof Error ? queryError.message : 'Failed to query products');
      return NextResponse.json({ 
        error: errorMessage,
        products: [] 
      }, { status: 500 });
    }
    
    // Handle case where products is null or undefined
    if (!products) {
      console.warn('[Admin Products API] Products query returned null/undefined');
      return NextResponse.json({ products: [] });
    }
    
    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Admin Products API] Found ${products.length || 0} products in database`);
    }
    
    // Ensure all products have required fields and proper serialization
    let serializedProducts: Array<{
      _id: string;
      name: string;
      category: string;
      price: number;
      description: string;
      image: string;
      inStock: boolean;
      status: string;
      stockQty: number;
      sizes: string[];
      colors: string[];
      packs: string[];
      variantPricing: any[];
      createdAt: string;
      updatedAt: string;
    }> = [];
    try {
      serializedProducts = products.map((p: any) => {
        try {
          return {
            _id: String(p._id),
            name: p.name || 'Unnamed Product',
            category: p.category || 'uncategorized',
            price: p.price || 0,
            description: p.description || '',
            image: p.image || '',
            inStock: p.inStock ?? true,
            status: p.status || 'active', // Default to active if missing
            stockQty: p.stockQty || 0,
            sizes: p.sizes || [],
            colors: p.colors || [],
            packs: p.packs || [],
            variantPricing: p.variantPricing || [],
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
          };
        } catch (serializeError) {
          console.error('[Admin Products API] Error serializing product:', p?._id, serializeError);
          // Return a minimal valid product object
          return {
            _id: p?._id ? String(p._id) : 'unknown',
            name: p?.name || 'Unnamed Product',
            category: p?.category || 'uncategorized',
            price: 0,
            description: '',
            image: '',
            inStock: false,
            status: 'active',
            stockQty: 0,
            sizes: [],
            colors: [],
            packs: [],
            variantPricing: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
      });
    } catch (mapError) {
      console.error('[Admin Products API] Error mapping products:', mapError);
      // Return empty array if mapping fails
      serializedProducts = [];
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Admin Products API] Serialized ${serializedProducts.length} products`);
    }
    
    return NextResponse.json({ products: serializedProducts || [] });
  } catch (error) {
    console.error('[Admin Products API] Error fetching products:', error);
    const errorMessage = process.env.NODE_ENV === 'production'
      ? 'Failed to fetch products'
      : (error instanceof Error ? error.message : 'Failed to fetch products');
    return NextResponse.json({ 
      error: errorMessage,
      products: [] 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Import security modules dynamically to avoid import errors
    let rateLimiters: any;
    let validateCSRFRequest: any;
    let sanitizeObject: any;
    let sanitizeText: any;
    let sanitizeHTML: any;

    try {
      const rateLimitModule = await import('@/lib/rateLimit');
      rateLimiters = rateLimitModule.rateLimiters;
    } catch (e) {
      console.warn('[Admin Products API] Rate limit module not available');
    }

    try {
      const csrfModule = await import('@/lib/csrf');
      validateCSRFRequest = csrfModule.validateCSRFRequest;
    } catch (e) {
      console.warn('[Admin Products API] CSRF module not available');
    }

    try {
      const sanitizeModule = await import('@/lib/sanitize');
      sanitizeObject = sanitizeModule.sanitizeObject;
      sanitizeText = sanitizeModule.sanitizeText;
      sanitizeHTML = sanitizeModule.sanitizeHTML;
    } catch (e) {
      console.warn('[Admin Products API] Sanitize module not available');
    }

    // Rate limiting
    if (rateLimiters) {
      try {
        const rateLimitResult = rateLimiters.adminAPI(req);
        if (!rateLimitResult.allowed) {
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
          );
        }
      } catch (rateLimitError) {
        console.warn('[Admin Products API] Rate limiting failed:', rateLimitError);
      }
    }

    // Authentication
    const adminToken = req.cookies.get('admin_token')?.value;
    const expectedToken = process.env.ADMIN_TOKEN;
    if (!adminToken || !expectedToken || adminToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // CSRF protection
    if (validateCSRFRequest && !validateCSRFRequest(req)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    await connectToDatabase();
    let body = await req.json();
    
    // Sanitize text fields to prevent XSS
    if (sanitizeObject && sanitizeText && sanitizeHTML) {
      const sanitizedBody = sanitizeObject(body, ['name', 'description']);
      if (sanitizedBody.name) {
        sanitizedBody.name = sanitizeText(sanitizedBody.name);
      }
      if (sanitizedBody.description) {
        sanitizedBody.description = sanitizeHTML(sanitizedBody.description);
      }
      body = sanitizedBody;
    }
    // Derive inStock from stock fields
    type VariantInput = { stockQty?: number; inStock?: boolean };
    const doc = { ...body } as { stockQty?: number; inStock?: boolean; variantPricing?: VariantInput[] };
    const variantHasStock = Array.isArray(doc.variantPricing) && doc.variantPricing.some((v) => (v?.stockQty ?? 0) > 0 || v?.inStock === true);
    const productHasStock = (doc.stockQty ?? 0) > 0;
    doc.inStock = Boolean(productHasStock || variantHasStock);
    // Default status to active if not provided
    // (admin UI will send 'active' or 'draft')
    if (!('status' in doc) || !doc.status) {
      // @ts-expect-error - status exists in schema
      doc.status = 'active';
    }
    const created = await Product.create(doc);
    
    // Revalidate cache after creating new product
    revalidatePath('/products');
    revalidatePath('/');
    
    return NextResponse.json({ product: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}









