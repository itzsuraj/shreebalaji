'use client';

import { useState } from 'react';
import { Trash2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export default function RemoveUrlsPage() {
  const [urls, setUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');
  // const [removalStatus, setRemovalStatus] = useState<Record<string, string>>({});

  const addUrl = () => {
    if (newUrl.trim() && !urls.includes(newUrl.trim())) {
      setUrls([...urls, newUrl.trim()]);
      setNewUrl('');
    }
  };

  const removeUrl = (urlToRemove: string) => {
    setUrls(urls.filter(url => url !== urlToRemove));
    // delete removalStatus[urlToRemove];
  };

  const generateRobotsTxt = () => {
    const disallowUrls = urls.map(url => {
      const path = url.replace('https://www.balajisphere.com', '');
      return `Disallow: ${path}`;
    }).join('\n');

    return `User-agent: *
Allow: /

# Block specific URLs from indexing
${disallowUrls}

# Block admin pages
Disallow: /admin/
Disallow: /debug-login/
Disallow: /enquiry-form/

# Block API routes
Disallow: /api/

Sitemap: https://www.balajisphere.com/sitemap.xml`;
  };

  const copyRobotsTxt = () => {
    navigator.clipboard.writeText(generateRobotsTxt());
    alert('Robots.txt content copied to clipboard!');
  };

  const generateGoogleSearchConsoleInstructions = () => {
    return `Google Search Console URL Removal Instructions:

1. Go to Google Search Console (https://search.google.com/search-console)
2. Select your property: www.balajisphere.com
3. Go to "Removals" in the left sidebar
4. Click "New Request"
5. Select "Temporarily remove URL"
6. Add each URL one by one:

${urls.map(url => `- ${url}`).join('\n')}

7. Submit the removal requests
8. Google will process these within 24-48 hours

Note: These are temporary removals. For permanent removal, you need to:
- Add noindex meta tags to the pages
- Update robots.txt file
- Remove from sitemap.xml`;
  };

  const copyInstructions = () => {
    navigator.clipboard.writeText(generateGoogleSearchConsoleInstructions());
    alert('Google Search Console instructions copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Remove URLs from Google</h1>
            <p className="text-gray-600">
              Remove specific URLs from Google search results and prevent future indexing.
            </p>
          </div>

          {/* Add URL Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add URLs to Remove</h2>
            <div className="flex space-x-4">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://www.balajisphere.com/products/8"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addUrl}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add URL
              </button>
            </div>
          </div>

          {/* URL List */}
          {urls.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">URLs to Remove ({urls.length})</h2>
              <div className="space-y-2">
                {urls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">#{index + 1}</span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        {url}
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                    <button
                      onClick={() => removeUrl(url)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Removal Methods */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Removal Methods</h2>

            {/* Method 1: Robots.txt */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Method 1: Update robots.txt</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Add disallow rules to prevent Google from crawling these URLs.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">{generateRobotsTxt()}</pre>
              </div>
              <button
                onClick={copyRobotsTxt}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Copy robots.txt Content
              </button>
            </div>

            {/* Method 2: Google Search Console */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Method 2: Google Search Console</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Use Google Search Console to request immediate removal of URLs from search results.
              </p>
              <button
                onClick={copyInstructions}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Copy Instructions
              </button>
            </div>

            {/* Method 3: No-Index Meta Tags */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Method 3: No-Index Meta Tags</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Add noindex meta tags to individual pages to prevent indexing.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm text-gray-800">{`<meta name="robots" content="noindex, nofollow">
<meta name="googlebot" content="noindex, nofollow">`}</pre>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setUrls([
                    'https://www.balajisphere.com/products/8',
                    'https://www.balajisphere.com/products/9',
                    'https://www.balajisphere.com/products/10',
                    'https://www.balajisphere.com/products/11',
                    'https://www.balajisphere.com/products/12'
                  ]);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Common Product URLs
              </button>
              <button
                onClick={() => setUrls([])}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear All URLs
              </button>
              <button
                onClick={() => window.open('https://search.google.com/search-console', '_blank')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Open Google Search Console
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
