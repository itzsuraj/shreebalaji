import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/shop/:path*',
        destination: '/products/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
