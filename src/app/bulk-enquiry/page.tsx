import { Metadata } from 'next';
import BulkEnquiryClient from './BulkEnquiryClient';

export const metadata: Metadata = {
  title: "Bulk Enquiry - Garment Accessories | Shree Balaji Enterprises",
  description: "Get competitive pricing for large quantities of garment accessories. Bulk discounts, fast delivery, and dedicated support for wholesale orders.",
  keywords: "bulk enquiry, wholesale, garment accessories, bulk discounts, Mumbai, manufacturer, supplier",
  alternates: {
    canonical: 'https://www.balajisphere.com/bulk-enquiry',
  },
  openGraph: {
    title: "Bulk Enquiry - Garment Accessories | Shree Balaji Enterprises",
    description: "Get competitive pricing for large quantities of garment accessories. Bulk discounts and fast delivery.",
    url: 'https://www.balajisphere.com/bulk-enquiry',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bulk Enquiry - Garment Accessories | Shree Balaji Enterprises",
    description: "Get competitive pricing for large quantities of garment accessories.",
  },
};

export default function BulkEnquiryPage() {
  return <BulkEnquiryClient />;
} 