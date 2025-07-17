import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FAQAccordion from './FAQAccordion';
import FAQStructuredData from './FAQStructuredData';

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Shree Balaji Enterprises",
  description: "Find answers to common questions about garment accessories, ordering process, shipping, and more. Get help with buttons, zippers, elastic, and cords.",
  keywords: "FAQ, frequently asked questions, garment accessories, ordering, shipping, buttons, zippers, elastic, cords",
  openGraph: {
    title: "FAQ - Frequently Asked Questions | Shree Balaji Enterprises",
    description: "Find answers to common questions about garment accessories and ordering.",
    type: 'website',
  },
};

export default function FAQPage() {
  const faqData = [
    // General Questions
    {
      question: "What types of garment accessories do you offer?",
      answer: "We offer a comprehensive range of garment accessories including buttons (metal, plastic, wooden), zippers (nylon coil, invisible, decorative), elastic bands (various widths), and cords (cotton, satin, drawstrings). All products are designed for professional garment making."
    },
    {
      question: "Where are you located?",
      answer: "We are located in Mumbai, Maharashtra, India. Our address is C Wing 704, Grit Height, G.M Link Road, Opposite Indian Oil Nagar, Near Shankara Colony, Chembur West, Mumbai - 400043."
    },
    {
      question: "What are your business hours?",
      answer: "Our business hours are Monday to Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM. We are closed on Sundays and public holidays."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship our products internationally. We have experience serving customers across India and can arrange shipping to other countries based on your requirements. Please contact us for specific shipping details and costs."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including bank transfers, UPI, and cash on delivery for local orders. For international orders, we accept bank transfers and other secure payment methods. Please contact us for specific payment options."
    },
    // Product Questions
    {
      question: "What sizes of buttons do you have?",
      answer: "We offer buttons in various sizes ranging from 12mm to 22mm diameter. Our most popular sizes are 15mm, 18mm, and 20mm. We also have specialty buttons for specific applications. Contact us for detailed size charts and recommendations."
    },
    {
      question: "Do you have color options for zippers?",
      answer: "Yes, we offer zippers in multiple colors including black, white, navy, red, beige, and other popular colors. We can also arrange custom colors for bulk orders. Please specify your color requirements when placing orders."
    },
    {
      question: "What widths of elastic bands are available?",
      answer: "We offer elastic bands in various widths including 1/2 inch, 1 inch, and other custom widths. Our elastic bands are available in white and black colors, with excellent stretch and recovery properties suitable for waistbands, cuffs, and other applications."
    },
    {
      question: "Are your products suitable for children's clothing?",
      answer: "Yes, many of our products are suitable for children's clothing. We offer child-safe buttons, soft elastic bands, and non-toxic materials. Our plastic snap buttons are particularly popular for baby clothes and children's garments."
    },
    {
      question: "Do you offer sample products?",
      answer: "Yes, we can provide sample products for evaluation. This is especially useful for bulk orders to ensure the products meet your specific requirements. Please contact us to arrange sample orders."
    },
    // Ordering & Shipping
    {
      question: "What is the minimum order quantity?",
      answer: "Minimum order quantities vary by product type. For buttons, we typically require a minimum of 100 pieces per style. For zippers, elastic, and cords, minimum quantities depend on the specific product. Contact us for detailed MOQ information."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times depend on your location and the shipping method chosen. Within Mumbai, we can arrange same-day or next-day delivery. For other parts of India, delivery typically takes 2-7 business days. International shipping times vary by destination."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer attractive bulk discounts for large orders. Discount rates increase with order quantity. We also offer special pricing for regular customers and long-term partnerships. Contact us for detailed pricing information."
    },
    {
      question: "Can I customize products for my specific needs?",
      answer: "Yes, we offer customization services for bulk orders. This includes custom colors, sizes, materials, and packaging. Custom orders may require longer lead times and minimum quantities. Please discuss your requirements with our team."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns for defective products or incorrect shipments. Returns must be reported within 7 days of receipt. Products must be in original condition and packaging. We will arrange replacement or refund for valid returns."
    },
    // Technical Support
    {
      question: "How do I choose the right button for my garment?",
      answer: "Button selection depends on fabric type, garment style, and intended use. For heavy fabrics like denim, choose metal buttons. For lightweight fabrics, plastic or wooden buttons work well. Consider the garment's washing requirements and style when selecting."
    },
    {
      question: "What type of zipper should I use for different applications?",
      answer: "For dresses and formal wear, use invisible zippers. For jackets and bags, nylon coil zippers are ideal. Metal zippers are best for heavy-duty applications. Consider the fabric weight and garment type when selecting zipper type."
    },
    {
      question: "How do I measure elastic for waistbands?",
      answer: "Measure the waist circumference and subtract 2-4 inches depending on the desired fit. The elastic should be 75-80% of the waist measurement for a comfortable fit. Always test the stretch before cutting."
    },
    {
      question: "Can you provide technical specifications for products?",
      answer: "Yes, we provide detailed technical specifications for all our products including material composition, dimensions, weight, and performance characteristics. These specifications are available on request and help ensure you choose the right products for your application."
    },
    {
      question: "Do you offer installation guidance?",
      answer: "Yes, we provide installation guidance and tips for our products. Our team can advise on the best practices for attaching buttons, installing zippers, and working with elastic and cords. We also offer training sessions for bulk customers."
    }
  ];

  return (
    <>
      <FAQStructuredData faqData={faqData} />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Find answers to common questions about our products, ordering process, 
            and services. Can&apos;t find what you&apos;re looking for? Contact us directly.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* General Questions */}
          <div>
            <h2 className="text-2xl font-bold mb-6">General Questions</h2>
            <FAQAccordion 
              items={faqData.slice(0, 5)}
            />
          </div>

          {/* Product Questions */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Product Questions</h2>
            <FAQAccordion 
              items={faqData.slice(5, 10)}
            />
          </div>
        </div>

        {/* Ordering & Shipping */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Ordering & Shipping</h2>
          <FAQAccordion 
            items={faqData.slice(10, 15)}
          />
        </div>

        {/* Technical Support */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Technical Support</h2>
          <FAQAccordion 
            items={faqData.slice(15, 20)}
          />
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-blue-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-900 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our team is here to help you 
            with any specific questions about our products or services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
            <a 
              href="https://wa.me/919372268410" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
} 