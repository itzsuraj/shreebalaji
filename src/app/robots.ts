import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/shop',
          '/Shree',
          '/bulk-enquiry',
          '/contactus',
          '/web/login',
          '/blog/zipper-installation',
          '/cart',
          '/debug-login/',
          '/enquiry-form/',
          '/checkout',
          '/account',
          '/register',
          '/login',
        ],
      },
    ],
    sitemap: 'https://www.balajisphere.com/sitemap.xml',
    host: 'https://www.balajisphere.com',
  }
} 