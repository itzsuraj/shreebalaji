import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { EnquiryProvider } from "@/context/EnquiryContext";
import { CartProvider } from "@/context/CartContext";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ClientSupportWidget from '@/components/ClientSupportWidget';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shree Balaji Enterprises - Garment Accessories Mumbai",
  description: "Leading manufacturer of premium garment accessories in Mumbai. Quality buttons, zippers, elastic & cords. Bulk orders welcome. Contact +91 9372268410",
  keywords: "garment accessories manufacturer Mumbai, button manufacturer Mumbai, zipper supplier Mumbai, elastic band manufacturer India, cotton cord supplier Mumbai, garment accessories wholesale Mumbai, metal buttons for garments, nylon coil zippers, invisible zippers, waistband elastic, drawstring cords, garment accessories bulk order, textile industry supplier, garment making accessories, quality buttons Mumbai, professional zippers supplier, elastic bands wholesale, cotton cords manufacturer, garment accessories India, Mumbai textile accessories",
  authors: [{ name: "Shree Balaji Enterprises" }],
  creator: "Shree Balaji Enterprises",
  publisher: "Shree Balaji Enterprises",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.balajisphere.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo.png',
  },
  openGraph: {
    title: "Shree Balaji Enterprises - Premium Garment Accessories",
    description: "Leading manufacturer and supplier of premium garment accessories in Mumbai. Quality buttons, zippers, elastic bands, and cotton cords.",
    url: 'https://www.balajisphere.com',
    siteName: 'Shree Balaji Enterprises',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'Shree Balaji Enterprises - Garment Accessories',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shree Balaji Enterprises - Premium Garment Accessories",
    description: "Leading manufacturer and supplier of premium garment accessories in Mumbai.",
    images: ['/banner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-site-verification': process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION || '',
    'msvalidate.01': process.env.BING_WEBMASTER_VERIFICATION || '',
  },
  verification: {
    google: process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION || '', // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <StructuredData />
        {/* Expose public Razorpay key to client */}
        {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && (
          <meta name="razorpay-key" content={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID} />
        )}
        {/* Google Analytics - Load immediately for SEO detection */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && !process.env.NEXT_PUBLIC_GTM_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-blue-700 px-3 py-2 rounded shadow">Skip to content</a>
        <GoogleAnalytics />
        <EnquiryProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-white">
              <Header />
              <main id="main-content" className="flex-grow bg-white">
                {children}
              </main>
              <Footer />
              <ClientSupportWidget />
            </div>
          </CartProvider>
        </EnquiryProvider>
      </body>
    </html>
  );
}
