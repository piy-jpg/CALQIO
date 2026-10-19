/**
 * CALQIO Dynamic Sitemap Generator
 * Extracts all 286+ calculators from registry.js and categories from taxonomy.js
 * Generates production-ready sitemap.xml with canonical URLs and priorities.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CALCULATORS_LIST } from '../js/registry.js';
import { TOP_LEVEL_CATEGORIES, MASTER_TAXONOMY } from '../js/taxonomy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const BASE_URL = 'https://calqio.townhub.site';
const TODAY = new Date().toISOString().split('T')[0];

const urls = [];

// 1. Core Platform Pages
urls.push({
  loc: `${BASE_URL}/`,
  lastmod: TODAY,
  changefreq: 'daily',
  priority: '1.0'
});

urls.push({
  loc: `${BASE_URL}/favorites`,
  lastmod: TODAY,
  changefreq: 'weekly',
  priority: '0.6'
});

urls.push({
  loc: `${BASE_URL}/history`,
  lastmod: TODAY,
  changefreq: 'weekly',
  priority: '0.5'
});

// 2. Top-Level Category Pages
const seenCategories = new Set();
for (const [key, cat] of Object.entries(TOP_LEVEL_CATEGORIES)) {
  const slug = cat.slug || key;
  if (!seenCategories.has(slug)) {
    seenCategories.add(slug);
    urls.push({
      loc: `${BASE_URL}/category/${slug}`,
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: '0.9'
    });
  }
}

// 3. Domain Categories
for (const [key, domain] of Object.entries(MASTER_TAXONOMY)) {
  const slug = domain.id || key;
  if (!seenCategories.has(slug)) {
    seenCategories.add(slug);
    urls.push({
      loc: `${BASE_URL}/category/${slug}`,
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: '0.85'
    });
  }
}

// 4. All 286+ Individual Calculators
const popularCalcs = new Set([
  'basic', 'scientific', 'percentage', 'emi', 'loan', 'gst', 'bmi', 'age',
  'ohms_law', 'beam_deflection_stress', 'torque_calc', 'quadratic_equation',
  'binary_converter', 'molarity', 'cgpa', 'unit_converter', 'matrix_addition',
  'fraction', 'pythagorean_theorem', 'sin_cos_tan'
]);

for (const calc of CALCULATORS_LIST) {
  const isPop = popularCalcs.has(calc.id);
  urls.push({
    loc: `${BASE_URL}/calc/${calc.id}`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: isPop ? '0.9' : '0.8'
  });
}

// 5. Build XML String
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const outputPath = path.join(rootDir, 'sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`Generated sitemap.xml with ${urls.length} URLs (including ${CALCULATORS_LIST.length} solvers)!`);
