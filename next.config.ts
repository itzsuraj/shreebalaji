import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
