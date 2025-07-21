import { Metadata } from 'next';
import { ArrowLeft, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Quality Standards in Garment Accessories Manufacturing - Shree Balaji Enterprises",
  description: "Understanding the importance of quality standards and how they impact your final product. Expert insights on garment accessories quality control.",
  keywords: "quality standards garment accessories, manufacturing quality control, button quality standards, zipper quality standards, elastic quality standards, garment accessories quality, textile quality standards, manufacturing standards, quality control process, garment accessories testing, quality assurance, textile industry standards",
  alternates: {
    canonical: 'https://www.balajisphere.com/blog/quality-standards',
  },
  openGraph: {
    title: "Quality Standards in Garment Accessories Manufacturing - Shree Balaji Enterprises",
    description: "Understanding the importance of quality standards and how they impact your final product.",
    url: 'https://www.balajisphere.com/blog/quality-standards',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Quality Standards in Garment Accessories Manufacturing - Shree Balaji Enterprises",
    description: "Understanding the importance of quality standards and how they impact your final product.",
  },
};

export default function QualityStandardsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog
      </Link>

      <article className="prose prose-lg max-w-none">
        <header className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
              Industry
            </span>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              January 1, 2024
            </div>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              8 min read
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Quality Standards in Garment Accessories Manufacturing</h1>
          <p className="text-xl text-gray-600">
            Understanding the importance of quality standards and how they impact your final product.
          </p>
        </header>

        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Takeaways</h2>
          <ul className="space-y-2">
            <li>• Quality standards ensure consistency and reliability</li>
            <li>• Different accessories have specific quality requirements</li>
            <li>• Testing and certification processes are crucial</li>
            <li>• Quality impacts both performance and customer satisfaction</li>
          </ul>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Quality Standards Matter</h2>
          
          <p className="mb-4">
            In the garment accessories industry, quality standards are not just guidelines—they are essential 
            requirements that ensure the reliability, durability, and performance of every component. 
            These standards protect both manufacturers and end consumers by establishing clear expectations 
            for product quality.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold mb-3 text-green-800">For Manufacturers</h3>
              <ul className="text-sm space-y-2">
                <li>• Consistent product quality</li>
                <li>• Reduced returns and complaints</li>
                <li>• Enhanced brand reputation</li>
                <li>• Competitive advantage</li>
                <li>• Regulatory compliance</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">For End Users</h3>
              <ul className="text-sm space-y-2">
                <li>• Reliable product performance</li>
                <li>• Longer garment lifespan</li>
                <li>• Better user experience</li>
                <li>• Safety and comfort</li>
                <li>• Value for money</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quality Standards by Product Category</h2>
          
          <h3 className="text-xl font-semibold mb-3">Button Quality Standards</h3>
          <p className="mb-4">
            Buttons must meet specific standards for strength, durability, and appearance. 
            Quality buttons should withstand repeated use and maintain their appearance over time.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h4 className="text-lg font-semibold mb-3">Button Testing Parameters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-sm mb-2">Physical Tests</h5>
                <ul className="text-sm space-y-1">
                  <li>• Tensile strength testing</li>
                  <li>• Impact resistance</li>
                  <li>• Abrasion resistance</li>
                  <li>• Colorfastness</li>
                  <li>• Size consistency</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-sm mb-2">Chemical Tests</h5>
                <ul className="text-sm space-y-1">
                  <li>• pH level testing</li>
                  <li>• Heavy metal content</li>
                  <li>• Formaldehyde testing</li>
                  <li>• Dye migration</li>
                  <li>• Chemical resistance</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3">Zipper Quality Standards</h3>
          <p className="mb-4">
            Zippers are critical components that must function smoothly and reliably. 
            Quality standards ensure proper operation and durability.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h4 className="text-lg font-semibold mb-3">Zipper Testing Parameters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-sm mb-2">Functional Tests</h5>
                <ul className="text-sm space-y-1">
                  <li>• Slider operation smoothness</li>
                  <li>• Teeth engagement strength</li>
                  <li>• Pull strength testing</li>
                  <li>• Lock mechanism reliability</li>
                  <li>• End stop durability</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-sm mb-2">Durability Tests</h5>
                <ul className="text-sm space-y-1">
                  <li>• Cyclic testing (open/close)</li>
                  <li>• Temperature resistance</li>
                  <li>• UV light resistance</li>
                  <li>• Salt spray testing</li>
                  <li>• Washing durability</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3">Elastic Quality Standards</h3>
          <p className="mb-4">
            Elastic bands must maintain their stretch and recovery properties over time. 
            Quality standards ensure consistent performance and comfort.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h4 className="text-lg font-semibold mb-3">Elastic Testing Parameters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-sm mb-2">Physical Properties</h5>
                <ul className="text-sm space-y-1">
                  <li>• Stretch ratio measurement</li>
                  <li>• Recovery percentage</li>
                  <li>• Tensile strength</li>
                  <li>• Width consistency</li>
                  <li>• Thickness uniformity</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-sm mb-2">Performance Tests</h5>
                <ul className="text-sm space-y-1">
                  <li>• Cyclic stretch testing</li>
                  <li>• Heat resistance</li>
                  <li>• UV degradation</li>
                  <li>• Chemical resistance</li>
                  <li>• Colorfastness</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">International Quality Standards</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">ISO Standards</h3>
              <p className="mb-3">
                The International Organization for Standardization (ISO) provides globally recognized 
                standards for garment accessories.
              </p>
              <ul className="text-sm space-y-1">
                <li>• <strong>ISO 9001:</strong> Quality Management Systems</li>
                <li>• <strong>ISO 14001:</strong> Environmental Management</li>
                <li>• <strong>ISO 45001:</strong> Occupational Health and Safety</li>
                <li>• <strong>ISO 26000:</strong> Social Responsibility</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">ASTM Standards</h3>
              <p className="mb-3">
                American Society for Testing and Materials (ASTM) provides specific testing methods 
                for textile accessories.
              </p>
              <ul className="text-sm space-y-1">
                <li>• <strong>ASTM D123:</strong> Standard Terminology for Textiles</li>
                <li>• <strong>ASTM D1683:</strong> Standard Test Method for Failure in Sewn Seams</li>
                <li>• <strong>ASTM D2050:</strong> Standard Test Method for Zipper Strength</li>
                <li>• <strong>ASTM D4964:</strong> Standard Test Method for Tension and Elongation of Elastic Fabrics</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">AATCC Standards</h3>
              <p className="mb-3">
                American Association of Textile Chemists and Colorists (AATCC) provides standards 
                for colorfastness and chemical testing.
              </p>
              <ul className="text-sm space-y-1">
                <li>• <strong>AATCC 8:</strong> Colorfastness to Crocking</li>
                <li>• <strong>AATCC 16:</strong> Colorfastness to Light</li>
                <li>• <strong>AATCC 61:</strong> Colorfastness to Laundering</li>
                <li>• <strong>AATCC 107:</strong> Colorfastness to Water</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quality Control Process</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Raw Material Inspection</h3>
                <p className="text-gray-600">
                  All incoming raw materials are inspected for quality, specifications, and compliance 
                  with required standards before being accepted for production.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">In-Process Quality Checks</h3>
                <p className="text-gray-600">
                  Regular quality checks are performed during the manufacturing process to ensure 
                  consistency and catch any issues early in production.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Final Product Testing</h3>
                <p className="text-gray-600">
                  Completed products undergo comprehensive testing to verify they meet all quality 
                  standards and specifications before being approved for shipment.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Documentation and Certification</h3>
                <p className="text-gray-600">
                  Quality certificates and test reports are provided with each shipment, 
                  documenting compliance with relevant standards and specifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Common Quality Issues and Solutions</h2>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-800">Button Issues</h3>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Problem:</strong> Buttons breaking during use</li>
                    <li>• <strong>Solution:</strong> Use higher-grade materials and proper testing</li>
                    <li>• <strong>Prevention:</strong> Regular tensile strength testing</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-800">Zipper Issues</h3>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Problem:</strong> Zippers getting stuck or breaking</li>
                    <li>• <strong>Solution:</strong> Proper teeth alignment and slider quality</li>
                    <li>• <strong>Prevention:</strong> Cyclic testing and smoothness checks</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-800">Elastic Issues</h3>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Problem:</strong> Elastic losing stretch over time</li>
                    <li>• <strong>Solution:</strong> High-quality rubber content and proper curing</li>
                    <li>• <strong>Prevention:</strong> Recovery testing and UV resistance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Benefits of High-Quality Standards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-green-800">For Manufacturers</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Reduced product returns</li>
                    <li>• Enhanced brand reputation</li>
                    <li>• Increased customer loyalty</li>
                    <li>• Higher profit margins</li>
                    <li>• Competitive advantage</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-blue-800">For End Consumers</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Longer garment lifespan</li>
                    <li>• Better performance</li>
                    <li>• Improved comfort</li>
                    <li>• Value for money</li>
                    <li>• Safety assurance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Quality You Can Trust</h2>
          <p className="mb-6">
            At Shree Balaji Enterprises, we maintain the highest quality standards in all our products. 
            Our commitment to quality ensures reliable, durable, and high-performing garment accessories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Our Products
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
} 