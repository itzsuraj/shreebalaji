import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "Shree Balaji Enterprises - Garment Accessories Mumbai",
  description: "Leading manufacturer of premium garment accessories in Mumbai. Quality buttons, zippers, elastic bands & cotton cords. Bulk orders welcome. Contact +91 9372268410",
  keywords: "garment accessories manufacturer Mumbai, button manufacturer Mumbai, zipper supplier Mumbai, elastic band manufacturer India, cotton cord supplier Mumbai, garment accessories wholesale Mumbai, metal buttons for garments, nylon coil zippers, invisible zippers, waistband elastic, drawstring cords, garment accessories bulk order, textile industry supplier, garment making accessories, quality buttons Mumbai, professional zippers supplier, elastic bands wholesale, cotton cords manufacturer, garment accessories India, Mumbai textile accessories",
  alternates: {
    canonical: 'https://www.balajisphere.com',
  },
  openGraph: {
    title: "Shree Balaji Enterprises - Premium Garment Accessories Manufacturer",
    description: "Leading manufacturer of premium garment accessories in Mumbai. Quality buttons, zippers, elastic bands, and cotton cords.",
    url: 'https://www.balajisphere.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shree Balaji Enterprises - Premium Garment Accessories Manufacturer",
    description: "Leading manufacturer of premium garment accessories in Mumbai.",
  },
};

export default function Home() {
  return <HomeClient />;
}
