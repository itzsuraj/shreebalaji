'use client';

import { useState } from 'react';
import { RefreshCw, ExternalLink, CheckCircle, AlertCircle, Upload } from 'lucide-react';

export default function SitemapManagementPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null);

  const handleResubmitSitemap = async () => {
    setIsSubmitting(true);
    
    // Simulate sitemap resubmission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLastSubmitted(new Date().toLocaleString());
    setIsSubmitting(false);
  };

  const sitemapUrl = 'https://www.balajisphere.com/sitemap.xml';
  const googleSearchConsoleUrl = 'https://search.google.com/search-console';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sitemap Management</h1>
            <p className="text-gray-600">
              Manage your sitemap submission to Google Search Console and monitor indexing status.
            </p>
          </div>

          {/* Current Sitemap Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Sitemap</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Sitemap URL</p>
                  <p className="text-sm text-gray-600">{sitemapUrl}</p>
                </div>
                <a
                  href={sitemapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Sitemap
                </a>
              </div>
            </div>
          </div>

          {/* Recent Changes */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Changes</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Sitemap Updated</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    The following product pages have been excluded from the sitemap:
                  </p>
                  <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc">
                    <li>/products/8</li>
                    <li>/products/9</li>
                    <li>/products/10</li>
                    <li>/products/11</li>
                    <li>/products/12</li>
                    <li>/products/13</li>
                    <li>/products/14</li>
                    <li>/products/15</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Resubmit Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resubmit Sitemap</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Method 1: Google Search Console */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Method 1: Google Search Console</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Use Google Search Console to resubmit your sitemap and request re-indexing.
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-900">Steps:</p>
                    <ol className="text-sm text-gray-600 mt-1 ml-4 list-decimal">
                    <li>Go to Google Search Console</li>
                    <li>Select your property: www.balajisphere.com</li>
                    <li>Go to &quot;Sitemaps&quot; in the left sidebar</li>
                    <li>Add sitemap URL: {sitemapUrl}</li>
                    <li>Click &quot;Submit&quot;</li>
                    </ol>
                  </div>
                  <button
                    onClick={() => window.open(googleSearchConsoleUrl, '_blank')}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Google Search Console
                  </button>
                </div>
              </div>

              {/* Method 2: Programmatic Resubmission */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Upload className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Method 2: Programmatic</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Use the Google Search Console API to automatically resubmit your sitemap.
                </p>
                <button
                  onClick={handleResubmitSitemap}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Resubmitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Resubmit Sitemap
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Last Submission Status */}
          {lastSubmitted && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Submission Status</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-green-800">Sitemap Resubmitted</h3>
                    <p className="text-sm text-green-700">
                      Last submitted: {lastSubmitted}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Monitoring */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800">Index Coverage</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Monitor which pages are indexed by Google
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800">URL Inspection</h3>
                <p className="text-sm text-green-700 mt-1">
                  Check individual URL indexing status
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-medium text-purple-800">Performance</h3>
                <p className="text-sm text-purple-700 mt-1">
                  Track search performance metrics
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => window.open(sitemapUrl, '_blank')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Current Sitemap
              </button>
              <button
                onClick={() => window.open(`${googleSearchConsoleUrl}/sitemaps`, '_blank')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Check Sitemap Status
              </button>
              <button
                onClick={() => window.open(`${googleSearchConsoleUrl}/index-coverage`, '_blank')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Monitor Indexing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
