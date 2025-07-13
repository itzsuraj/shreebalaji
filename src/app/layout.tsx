import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { EnquiryProvider } from "@/context/EnquiryContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Garment Accessories Pro - Quality Buttons, Zippers, Elastic & Cords",
  description: "Premium garment accessories including buttons, zippers, elastic bands, and cotton cords for professional garment making and textile industry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
