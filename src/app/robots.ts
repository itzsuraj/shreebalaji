import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/admin/', '/api/', '/_next/', '/static/'],
      },
    ],
    sitemap: 'https://www.balajisphere.com/sitemap.xml',
    host: 'https://www.balajisphere.com',
  }
} 