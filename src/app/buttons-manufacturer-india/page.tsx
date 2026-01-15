import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import FAQSchema from '@/components/FAQSchema';

const faqItems = [
  {
    question: 'Do you supply garment buttons across India?',
    answer:
      'Yes, we supply garment buttons across India with reliable logistics for bulk and repeat orders.',
  },
  {
    question: 'What types of buttons do you manufacture?',
    answer:
      'We manufacture metal, plastic, and specialty buttons for shirts, uniforms, fashion wear, and accessories.',
  },
  {
    question: 'Can I place bulk or OEM orders for buttons?',
    answer:
      'Yes. We support bulk and OEM requirements with consistent quality and repeatable production.',
  },
  {
    question: 'How do I request a quote for garment buttons?',
    answer:
      'You can contact us with size, quantity, finish, and usage details and we will share a quote.',
  },
];

export const metadata: Metadata = {
  title: 'Button Manufacturer in India | Shree Balaji Enterprises',
  description:
    'Button manufacturer in India for garment accessories. Bulk supply of metal and plastic buttons with consistent quality and nationwide delivery.',
  keywords:
    'button manufacturer India, garment button supplier India, bulk buttons India, metal buttons manufacturer, plastic buttons supplier, garment accessories India',
  alternates: {
    canonical: 'https://www.balajisphere.com/buttons-manufacturer-india',
  },
  openGraph: {
    title: 'Button Manufacturer in India | Shree Balaji Enterprises',
    description:
      'Bulk supply of garment buttons across India. Reliable quality for apparel brands and manufacturers.',
    url: 'https://www.balajisphere.com/buttons-manufacturer-india',
    type: 'website',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'Button Manufacturer in India - Shree Balaji Enterprises',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Button Manufacturer in India | Shree Balaji Enterprises',
    description:
      'Bulk supply of garment buttons across India with consistent quality and delivery.',
    images: ['/banner.png'],
  },
};

export default function ButtonsManufacturerIndiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQSchema items={faqItems} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BreadcrumbSchema
            items={[
              { name: 'Home', url: '/' },
              { name: 'Buttons', url: '/products?category=buttons' },
              { name: 'Button Manufacturer India', url: '/buttons-manufacturer-india' },
            ]}
            showVisualBreadcrumb={true}
          />
        </div>

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Button Manufacturer in India
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Shree Balaji Enterprises supplies high-quality garment buttons across India.
            We support bulk orders for apparel brands, exporters, and manufacturers with
            consistent quality and dependable delivery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Button Types</h2>
              <ul className="text-gray-700 space-y-1">
                <li>Metal buttons for formal and uniform wear</li>
                <li>Plastic buttons for shirts, blouses, and casual wear</li>
                <li>Custom finishes and sizes on request</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Why Choose Us</h2>
              <ul className="text-gray-700 space-y-1">
                <li>Bulk and OEM supply support</li>
                <li>Consistent quality checks</li>
                <li>Pan India fulfillment</li>
              </ul>
            </div>
          </div>

          <div className="bg-primary-50 border border-primary-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Need a bulk quote?
            </h3>
            <p className="text-gray-700 mb-4">
              Share your size, finish, and quantity requirements and we will get back quickly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products?category=buttons"
                className="bg-primary-500 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-primary-600 transition-colors text-center"
              >
                Browse Buttons
              </Link>
              <Link
                href="/contact"
                className="bg-white text-primary-600 border border-primary-600 px-5 py-2.5 rounded-md font-semibold hover:bg-primary-50 transition-colors text-center"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">FAQs</h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.question} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
