import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Non-WWW to WWW redirects (Amazon style)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'balajisphere.com',
          },
        ],
        destination: 'https://www.balajisphere.com/:path*',
        permanent: true,
      },
      {
        source: '/products/',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/shop',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/shop/:path*',
        destination: '/products/:path*',
        permanent: true,
      },
      // Specific old product redirects
      {
        source: '/shop/polyster-button-4',
        destination: '/products/1',
        permanent: true,
      },
      {
        source: '/shop/polyster-button-fabrics-button-polyester-round-ring-with-4-holes-buttons-white-pack-of-100-4',
        destination: '/products/1',
        permanent: true,
      },
      // Canonicalization redirects
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/$',
        destination: '/',
        permanent: true,
      },

      {
        source: '/contact.html',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/about.html',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/products.html',
        destination: '/products',
        permanent: true,
      },
    ];
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.balajisphere.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'balajisphere.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  // Fix hydration issues
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  compiler: {
    // Keep console.error and console.warn in production for debugging
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  generateEtags: true,
};

export default nextConfig;
