/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Selecting the Perfect Elastic for Waistbands - Shree Balaji Enterprises",
  description: "A comprehensive guide to choosing the right elastic type and width for different waistband applications. Expert tips for garment manufacturers.",
  keywords: "elastic selection guide, waistband elastic, elastic types, elastic width, garment elastic, elastic for clothing, waistband elastic guide, elastic band selection, garment accessories elastic, professional elastic guide, elastic manufacturer guide, textile elastic guide",
  alternates: {
    canonical: 'https://www.balajisphere.com/blog/elastic-selection',
  },
  openGraph: {
    title: "Selecting the Perfect Elastic for Waistbands - Shree Balaji Enterprises",
    description: "A comprehensive guide to choosing the right elastic type and width for different waistband applications.",
    url: 'https://www.balajisphere.com/blog/elastic-selection',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Selecting the Perfect Elastic for Waistbands - Shree Balaji Enterprises",
    description: "A comprehensive guide to choosing the right elastic type and width for different waistband applications.",
  },
};

export default function ElasticSelectionPage() {
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
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              Elastic
            </span>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              January 5, 2024
            </div>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              6 min read
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Selecting the Perfect Elastic for Waistbands</h1>
          <p className="text-xl text-gray-600">
            A comprehensive guide to choosing the right elastic type and width for different waistband applications.
          </p>
        </header>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Takeaways</h2>
          <ul className="space-y-2">
            <li>• Understand different elastic types and their properties</li>
            <li>• Choose the right width based on garment type</li>
            <li>• Consider stretch ratio and recovery for durability</li>
            <li>• Match elastic to fabric weight and usage</li>
          </ul>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Types of Elastic for Waistbands</h2>
          
          <h3 className="text-xl font-semibold mb-3">1. Braided Elastic</h3>
          <p className="mb-4">
            Braided elastic is the most common type used in waistbands. It&apos;s made by braiding rubber strands with polyester or cotton yarns. 
            This type offers excellent stretch and recovery, making it ideal for most waistband applications.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Excellent stretch and recovery</li>
            <li>Available in various widths (1/4" to 3")</li>
            <li>Suitable for most fabric types</li>
            <li>Cost-effective option</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2. Knitted Elastic</h3>
          <p className="mb-4">
            Knitted elastic is softer and more comfortable against the skin. It&apos;s made by knitting rubber strands with synthetic fibers, 
            creating a more flexible and breathable elastic.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Softer and more comfortable</li>
            <li>Better for sensitive skin</li>
            <li>Ideal for children's clothing</li>
            <li>Good for lightweight fabrics</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">3. Woven Elastic</h3>
          <p className="mb-4">
            Woven elastic is the strongest and most durable type. It&apos;s made by weaving rubber strands with cotton or polyester yarns, 
            creating a very stable elastic that doesn&apos;t lose its shape easily.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Highest durability and stability</li>
            <li>Maintains shape over time</li>
            <li>Ideal for heavy fabrics</li>
            <li>Best for high-stress applications</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Choosing the Right Width</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Narrow Widths (1/4" - 1/2")</h3>
              <ul className="text-sm space-y-1">
                <li>• Children's clothing</li>
                <li>• Lightweight summer garments</li>
                <li>• Delicate fabrics</li>
                <li>• Cuffs and sleeves</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Medium Widths (3/4" - 1")</h3>
              <ul className="text-sm space-y-1">
                <li>• Standard waistbands</li>
                <li>• Most adult clothing</li>
                <li>• Casual wear</li>
                <li>• Everyday garments</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Wide Widths (1.5" - 3")</h3>
              <ul className="text-sm space-y-1">
                <li>• Athletic wear</li>
                <li>• Heavy fabrics</li>
                <li>• High-stress applications</li>
                <li>• Professional uniforms</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Extra Wide (3"+)</h3>
              <ul className="text-sm space-y-1">
                <li>• Maternity wear</li>
                <li>• Medical garments</li>
                <li>• Specialized applications</li>
                <li>• Comfort-focused designs</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Stretch Ratio and Recovery</h2>
          
          <p className="mb-4">
            The stretch ratio determines how much the elastic can stretch relative to its original length. 
            Most waistband elastics have a stretch ratio of 2:1 to 3:1, meaning they can stretch to 2-3 times their original length.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-3">Stretch Ratio Guidelines</h3>
            <ul className="space-y-2">
              <li><strong>2:1 Ratio:</strong> Light stretch, good for structured garments</li>
              <li><strong>2.5:1 Ratio:</strong> Medium stretch, most common for waistbands</li>
              <li><strong>3:1 Ratio:</strong> High stretch, good for comfort-focused designs</li>
            </ul>
          </div>
          
          <p className="mb-4">
            Recovery refers to how well the elastic returns to its original length after stretching. 
            High-quality elastic should recover to at least 95% of its original length.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Matching Elastic to Fabric</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Fabric Type</th>
                  <th className="border border-gray-300 p-3 text-left">Recommended Elastic</th>
                  <th className="border border-gray-300 p-3 text-left">Width</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">Lightweight Cotton</td>
                  <td className="border border-gray-300 p-3">Knitted or Braided</td>
                  <td className="border border-gray-300 p-3">1/2" - 3/4"</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Denim</td>
                  <td className="border border-gray-300 p-3">Woven or Braided</td>
                  <td className="border border-gray-300 p-3">1" - 1.5"</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Heavy Canvas</td>
                  <td className="border border-gray-300 p-3">Woven</td>
                  <td className="border border-gray-300 p-3">1.5" - 2"</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Silk/Satin</td>
                  <td className="border border-gray-300 p-3">Knitted</td>
                  <td className="border border-gray-300 p-3">1/4" - 1/2"</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Athletic Fabric</td>
                  <td className="border border-gray-300 p-3">Braided or Woven</td>
                  <td className="border border-gray-300 p-3">1" - 2"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Installation Tips</h2>
          
          <div className="bg-yellow-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
            <ul className="space-y-2">
              <li>• Cut elastic slightly shorter than the waistband opening (usually 2-3 inches shorter)</li>
              <li>• Use a zigzag stitch for sewing elastic to prevent breakage</li>
              <li>• Stretch the elastic while sewing for proper tension</li>
              <li>• Test the stretch and recovery before final installation</li>
              <li>• Consider using elastic thread for very lightweight fabrics</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quality Considerations</h2>
          
          <p className="mb-4">
            When selecting elastic for waistbands, consider these quality factors:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Rubber Content:</strong> Higher rubber content generally means better stretch and recovery</li>
            <li><strong>Covering Material:</strong> Polyester covers are more durable than cotton</li>
            <li><strong>Heat Resistance:</strong> Important for garments that will be ironed or dried at high temperatures</li>
            <li><strong>UV Resistance:</strong> Consider for outdoor or frequently washed garments</li>
            <li><strong>Colorfastness:</strong> Ensure the elastic won't bleed or fade</li>
          </ul>
        </section>

        <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Need Quality Elastic for Your Projects?</h2>
          <p className="mb-6">
            Shree Balaji Enterprises offers premium elastic bands in various widths and types. 
            Contact us for bulk orders and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products?category=elastic" 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Elastic Products
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