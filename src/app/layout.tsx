import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { EnquiryProvider } from "@/context/EnquiryContext";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <StructuredData />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <EnquiryProvider>
          <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow bg-white">
              {children}
            </main>
            <Footer />
          </div>
        </EnquiryProvider>
      </body>
    </html>
  );
}
