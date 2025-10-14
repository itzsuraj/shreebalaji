'use client';

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { useCart } from '@/context/CartContext';
import { getProductImage } from "@/utils/imageUtils";
import type { Product } from "@/types/product";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function HomeClient({ initialProducts = [] as Product[] }: { initialProducts?: Product[] }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Array<{
    _id: string;
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    sizes: string[];
    colors: string[];
    packs: string[];
    variantPricing: Array<{
      size?: string;
      color?: string;
      pack?: string;
      price: number;
    }>;
    inStock: boolean;
    rating: number;
    reviews: number;
  }>>([]);
  const [loading, setLoading] = useState(initialProducts.length === 0);

  // Fetch products from database
  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts as unknown as typeof products);
      setLoading(false);
      return;
    }
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialProducts]);

  // Memoize product filtering to avoid recalculation
  const { featuredProducts, buttonProducts, zipperProducts, elasticProducts, cordProducts } = useMemo(() => ({
    featuredProducts: products.slice(0, 8),
    buttonProducts: products.filter(p => p.category === 'buttons').slice(0, 3),
    zipperProducts: products.filter(p => p.category === 'zippers').slice(0, 3),
    elasticProducts: products.filter(p => p.category === 'elastic').slice(0, 3),
    cordProducts: products.filter(p => p.category === 'cords').slice(0, 3),
  }), [products]);

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, image: getProductImage(product), category: product.category });
  };

  const handleBuyNow = (product: typeof products[0]) => {
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, image: getProductImage(product), category: product.category });
    router.push('/checkout');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no products
  if (products.length === 0) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/banner.png"
              alt="Shree Balaji Enterprises Banner"
              fill
              className="object-cover shadow-2xl"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className="absolute inset-0 bg-black opacity-40 shadow-inner"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Premium Garment Accessories
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
              Leading manufacturer of quality buttons, zippers, elastic bands, and cotton cords for the garment industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products" 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View Products
              </Link>
              <Link 
                href="/contact" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* No Products Message */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Products Coming Soon</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We&apos;re currently setting up our product catalog. Please contact us for specific requirements or check back soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Contact Sales
              </Link>
              <Link 
                href="/enquiries" 
                className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Submit Enquiry
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner.png"
            alt="Shree Balaji Enterprises Banner"
            fill
            className="object-cover shadow-2xl"
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
            quality={70}
          />
          <Image
            src="/banner.png"
            alt="Shree Balaji Enterprises Banner"
            fill
            className="object-cover shadow-2xl"
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
            quality={70}
          />
          <div className="absolute inset-0 bg-black opacity-40 shadow-inner"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Quality Garment Accessories
          </h1>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed">
            Premium buttons, zippers, elastic, and cords for professional garment making
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-base sm:text-lg shadow-lg"
          >
            Browse Products
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900">
            Our Product Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Buttons</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">Metal, plastic, and wooden buttons for all garment types</p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Zippers</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">Nylon coil, invisible, and decorative zippers</p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Elastic</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">High-quality elastic bands for waistbands and cuffs</p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Cords</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">Cotton cords and drawstrings for various applications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-48">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      priority={false}
                      quality={80}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">₹{product.price.toLocaleString()}</p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-green-600 text-white py-2.5 px-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1 font-medium"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                    <button 
                      onClick={() => handleBuyNow(product)}
                      className="bg-blue-600 text-white py-2.5 px-2 rounded text-sm hover:bg-blue-700 transition-colors font-medium"
                    >
                      <span className="hidden sm:inline">Buy Now</span>
                      <span className="sm:hidden">Buy</span>
                    </button>
                    <Link 
                      href={`/products/${product._id}`}
                      className="bg-gray-600 text-white py-2.5 px-2 rounded text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-1 font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">View</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* View All Products Button */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
            >
              View All Products
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="text-gray-600 mt-4">
              Explore our complete collection of {products.length} premium garment accessories
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900">
            Why Choose Our Accessories?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Premium Quality</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">All our accessories meet the highest quality standards for professional garment making.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">Quick processing and delivery to keep your production schedule on track.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Expert Support</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">Our team of experts is here to help you choose the right accessories for your projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Product Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Explore by Category
          </h2>
          
          {/* Buttons Category */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">Premium Buttons</h3>
              <Link href="/products?category=buttons" className="text-blue-600 hover:text-blue-800 font-semibold">
                View All Buttons →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {buttonProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-40">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={80}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2 text-gray-900">{product.name}</h4>
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                      <p className="text-gray-600">₹{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-600 text-white py-2.5 px-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1 font-medium"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                      <button 
                        onClick={() => handleBuyNow(product)}
                        className="bg-blue-600 text-white py-2.5 px-2 rounded text-sm hover:bg-blue-700 transition-colors font-medium"
                      >
                        <span className="hidden sm:inline">Buy Now</span>
                        <span className="sm:hidden">Buy</span>
                      </button>
                      <Link 
                        href={`/products/${product._id}`}
                        className="bg-gray-600 text-white py-2.5 px-2 rounded text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-1 font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zippers Category */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">Quality Zippers</h3>
              <Link href="/products?category=zippers" className="text-blue-600 hover:text-blue-800 font-semibold">
                View All Zippers →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {zipperProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-40">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={80}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2 text-gray-900">{product.name}</h4>
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                      <p className="text-gray-600">₹{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-600 text-white py-2.5 px-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1 font-medium"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                      <button 
                        onClick={() => handleBuyNow(product)}
                        className="bg-blue-600 text-white py-2.5 px-2 rounded text-sm hover:bg-blue-700 transition-colors font-medium"
                      >
                        <span className="hidden sm:inline">Buy Now</span>
                        <span className="sm:hidden">Buy</span>
                      </button>
                      <Link 
                        href={`/products/${product._id}`}
                        className="bg-gray-600 text-white py-2.5 px-2 rounded text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-1 font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Elastic Category */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">Elastic Bands</h3>
              <Link href="/products?category=elastic" className="text-blue-600 hover:text-blue-800 font-semibold">
                View All Elastic →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {elasticProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-40">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={80}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2 text-gray-900">{product.name}</h4>
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                      <p className="text-gray-600">₹{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-600 text-white py-2.5 px-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1 font-medium"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                      <button 
                        onClick={() => handleBuyNow(product)}
                        className="bg-blue-600 text-white py-2.5 px-2 rounded text-sm hover:bg-blue-700 transition-colors font-medium"
                      >
                        <span className="hidden sm:inline">Buy Now</span>
                        <span className="sm:hidden">Buy</span>
                      </button>
                      <Link 
                        href={`/products/${product._id}`}
                        className="bg-gray-600 text-white py-2.5 px-2 rounded text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-1 font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cords Category */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">Cotton Cords</h3>
              <Link href="/products?category=cords" className="text-blue-600 hover:text-blue-800 font-semibold">
                View All Cords →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cordProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-40">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={80}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2 text-gray-900">{product.name}</h4>
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                      <p className="text-gray-600">₹{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-600 text-white py-2.5 px-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1 font-medium"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                      <button 
                        onClick={() => handleBuyNow(product)}
                        className="bg-blue-600 text-white py-2.5 px-2 rounded text-sm hover:bg-blue-700 transition-colors font-medium"
                      >
                        <span className="hidden sm:inline">Buy Now</span>
                        <span className="sm:hidden">Buy</span>
                      </button>
                      <Link 
                        href={`/products/${product._id}`}
                        className="bg-gray-600 text-white py-2.5 px-2 rounded text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-1 font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Expertise Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Mumbai&apos;s Premier Garment Accessories Manufacturer
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                  Serving the Textile Industry Since 1990
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Shree Balaji Enterprises has been at the forefront of garment accessories manufacturing in Mumbai for over three decades. Our commitment to quality, innovation, and customer satisfaction has made us the trusted choice for garment manufacturers across India.
                  </p>
                  <p>
                    We specialize in producing high-quality buttons, zippers, elastic bands, and cotton cords that meet international standards. Our products are used by leading garment manufacturers, fashion houses, and textile companies throughout the country.
                  </p>
                  <p>
                    Located in the heart of Mumbai&apos;s textile district, we offer quick delivery, competitive pricing, and personalized service to meet your specific requirements. Whether you need small quantities for sampling or bulk orders for production, we&apos;ve got you covered.
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-6 text-gray-900">Why Choose Shree Balaji Enterprises?</h4>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Quality Assurance:</strong> All products undergo rigorous quality testing to ensure they meet industry standards
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Bulk Pricing:</strong> Competitive rates for large orders with volume discounts
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Fast Delivery:</strong> Quick processing and shipping to keep your production on schedule
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Expert Support:</strong> Technical guidance and product recommendations from our experienced team
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Custom Solutions:</strong> Tailored products to meet your specific design and quality requirements
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Detail */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Comprehensive Garment Accessories Range
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Buttons Collection</h3>
              <p className="text-gray-700 mb-4">
                Our extensive button collection includes metal buttons, plastic buttons, wooden buttons, and decorative buttons in various sizes from 12mm to 30mm. Perfect for shirts, jackets, pants, and all types of garments.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Metal buttons (18mm, 20mm, 22mm)</li>
                <li>• Plastic snap buttons (15mm, 18mm)</li>
                <li>• Wooden buttons (20mm, 25mm)</li>
                <li>• Decorative fashion buttons</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Zipper Solutions</h3>
              <p className="text-gray-700 mb-4">
                High-quality zippers including nylon coil zippers, invisible zippers, and decorative zippers. Available in various lengths and colors to match your garment requirements.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Nylon coil zippers</li>
                <li>• Invisible zippers</li>
                <li>• Decorative zippers</li>
                <li>• Metal zippers</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Elastic Bands</h3>
              <p className="text-gray-700 mb-4">
                Premium elastic bands for waistbands, cuffs, and various garment applications. Available in different widths and stretch ratios to suit your specific needs.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Waistband elastic</li>
                <li>• Cuff elastic</li>
                <li>• Braided elastic</li>
                <li>• Knitted elastic</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Cotton Cords</h3>
              <p className="text-gray-700 mb-4">
                Natural cotton cords and drawstrings for hoodies, pants, and various garment applications. Available in different thicknesses and colors.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Drawstring cords</li>
                <li>• Hoodie cords</li>
                <li>• Decorative cords</li>
                <li>• Functional cords</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
            Ready to Start Your Project?
          </h2>
          <p className="text-white mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
            Browse our complete range of garment accessories and enquire about bulk pricing for your production needs. Contact us today for expert guidance and competitive quotes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-base sm:text-lg shadow-lg"
            >
              View All Products
            </Link>
            <Link
              href="/contact"
              className="bg-transparent text-white border-2 border-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-base sm:text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 