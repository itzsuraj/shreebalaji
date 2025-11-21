#!/usr/bin/env node

/**
 * SEO Audit Script for Balaji Sphere
 * Checks basic SEO elements and provides recommendations
 */

import https from 'https';
import { URL } from 'url';

const WEBSITE_URL = 'https://www.balajisphere.com';

// SEO checks to perform
const seoChecks = [
  {
    name: 'Meta Title',
    check: (html) => {
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      return {
        found: !!titleMatch,
        value: titleMatch ? titleMatch[1] : null,
        score: titleMatch && titleMatch[1].length > 30 && titleMatch[1].length < 60 ? 100 : 50
      };
    }
  },
  {
    name: 'Meta Description',
    check: (html) => {
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
      return {
        found: !!descMatch,
        value: descMatch ? descMatch[1] : null,
        score: descMatch && descMatch[1].length > 120 && descMatch[1].length < 160 ? 100 : 50
      };
    }
  },
  {
    name: 'Open Graph Tags',
    check: (html) => {
      const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*>/i);
      const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*>/i);
      const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*>/i);
      return {
        found: !!(ogTitle && ogDesc && ogImage),
        value: { ogTitle: !!ogTitle, ogDesc: !!ogDesc, ogImage: !!ogImage },
        score: (ogTitle && ogDesc && ogImage) ? 100 : 33
      };
    }
  },
  {
    name: 'Structured Data',
    check: (html) => {
      const jsonLd = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis);
      return {
        found: !!jsonLd,
        value: jsonLd ? jsonLd.length : 0,
        score: jsonLd ? 100 : 0
      };
    }
  },
  {
    name: 'Heading Structure',
    check: (html) => {
      const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
      const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
      return {
        found: h1Count > 0,
        value: { h1: h1Count, h2: h2Count },
        score: h1Count === 1 ? 100 : 50
      };
    }
  },
  {
    name: 'Alt Text for Images',
    check: (html) => {
      const imgTags = html.match(/<img[^>]*>/gi) || [];
      const imgWithAlt = imgTags.filter(img => img.includes('alt='));
      return {
        found: imgTags.length > 0,
        value: { total: imgTags.length, withAlt: imgWithAlt.length },
        score: imgTags.length > 0 ? (imgWithAlt.length / imgTags.length) * 100 : 0
      };
    }
  }
];

async function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function runSEOAudit() {
  console.log('🔍 SEO Audit for Balaji Sphere');
  console.log('================================\n');

  try {
    console.log('📡 Fetching website content...');
    const html = await fetchHTML(WEBSITE_URL);
    
    console.log('✅ Website is accessible\n');
    
    let totalScore = 0;
    const results = [];

    for (const check of seoChecks) {
      const result = check.check(html);
      results.push({ name: check.name, ...result });
      totalScore += result.score;
    }

    const averageScore = Math.round(totalScore / seoChecks.length);

    console.log('📊 SEO Audit Results:');
    console.log('====================\n');

    results.forEach(result => {
      const status = result.score >= 80 ? '✅' : result.score >= 50 ? '⚠️' : '❌';
      console.log(`${status} ${result.name}: ${result.score}/100`);
      
      if (result.value !== null) {
        if (typeof result.value === 'object') {
          console.log(`   Details: ${JSON.stringify(result.value)}`);
        } else if (result.value) {
          console.log(`   Value: ${result.value}`);
        }
      }
      console.log('');
    });

    console.log(`🎯 Overall SEO Score: ${averageScore}/100`);
    
    if (averageScore >= 80) {
      console.log('🎉 Excellent SEO! Your website is well-optimized.');
    } else if (averageScore >= 60) {
      console.log('👍 Good SEO! Some improvements needed.');
    } else {
      console.log('⚠️ SEO needs improvement. Consider the recommendations above.');
    }

    console.log('\n📈 Next Steps:');
    console.log('1. Set up Google Search Console');
    console.log('2. Submit sitemap: https://www.balajisphere.com/sitemap.xml');
    console.log('3. Monitor rankings with free tools');
    console.log('4. Track performance with Google Analytics');

  } catch (error) {
    console.error('❌ Error running SEO audit:', error.message);
    console.log('\n💡 Make sure your website is deployed and accessible.');
  }
}

runSEOAudit();







