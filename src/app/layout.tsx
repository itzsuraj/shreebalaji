import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { EnquiryProvider } from "@/context/EnquiryContext";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shree Balaji Enterprises - Premium Garment Accessories | Buttons, Zippers, Elastic & Cords",
  description: "Leading manufacturer and supplier of premium garment accessories in Mumbai. Quality buttons, zippers, elastic bands, and cotton cords for professional garment making. Bulk orders welcome. Contact: +91 9372268410",
  keywords: "garment accessories, buttons, zippers, elastic, cords, Mumbai, manufacturer, supplier, textile industry, garment making, bulk orders",
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
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
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
        <StructuredData />
      </head>
      <body className={inter.className}>
        <EnquiryProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </EnquiryProvider>
      </body>
    </html>
  );
}
