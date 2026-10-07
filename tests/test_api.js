import http from 'http';
import { createApp } from '../server/app.js';
import { initDatabase, query } from '../server/config/database.js';
import { TOP_LEVEL_CATEGORIES, MASTER_TAXONOMY, getParentCategoryForDomain } from '../js/taxonomy.js';
import bcrypt from 'bcryptjs';

let app;
let server;
let baseUrl;

async function seedTestData() {
  let order = 1;
  for (const [key, cat] of Object.entries(TOP_LEVEL_CATEGORIES)) {
    const slug = cat.slug || key;
    await query(
      `INSERT INTO categories (slug, name, icon, description, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [slug, cat.name, cat.icon || 'grid', cat.description || '', order++]
    );
  }

  let domainOrder = 1;
  for (const [key, domain] of Object.entries(MASTER_TAXONOMY)) {
    const slug = domain.id || key;
    const parentCatSlug = getParentCategoryForDomain(slug);
    await query(
      `INSERT INTO domains (slug, category_slug, name, icon, description, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [slug, parentCatSlug, domain.name, domain.icon || 'grid', domain.description || '', domainOrder++]
    );
  }

  const seededCalcs = new Set();
  for (const [domainKey, domain] of Object.entries(MASTER_TAXONOMY)) {
    const parentCatSlug = getParentCategoryForDomain(domainKey);
    if (domain.subcategories) {
      for (const sub of domain.subcategories) {
        if (sub.items) {
          for (const calcSlug of sub.items) {
            if (!seededCalcs.has(calcSlug)) {
              seededCalcs.add(calcSlug);
              const formattedName = calcSlug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              await query(
                `INSERT INTO calculators (slug, category_slug, domain_slug, name, description, icon, tags, popular_score)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                  calcSlug,
                  parentCatSlug,
                  domainKey,
                  formattedName,
                  `Fast and accurate ${formattedName} for instant results and step-by-step breakdown.`,
                  domain.icon || 'calculator',
                  [domainKey, sub.name.toLowerCase()],
                  ['basic', 'percentage', 'emi', 'bmi', 'gst', 'age'].includes(calcSlug) ? 100 : 10
                ]
              );
            }
          }
        }
      }
    }
  }
}

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('========================================');
  console.log('CALQIO REST API Integration Tests');
  console.log('========================================\n');

  await initDatabase();
  await seedTestData();
  app = createApp();

  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`PASS: ${testName}`);
      passed++;
    } else {
      console.error(`FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.success === true && health.data.data.status === 'healthy', 'GET /api/health returns healthy status');

    // 2. Auth Registration
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      body: { name: 'Test User', email: testEmail, password: 'password123' }
    });
    assert(regRes.status === 201 && regRes.data.success === true && Boolean(regRes.data.data.token), 'POST /api/auth/register creates user and returns JWT token');
    const userToken = regRes.data.data?.token;

    // 3. Auth Login
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: testEmail, password: 'password123' }
    });
    assert(loginRes.status === 200 && loginRes.data.success === true && Boolean(loginRes.data.data.token), 'POST /api/auth/login succeeds with valid credentials');

    // 4. Invalid Login
    const badLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: testEmail, password: 'wrongpassword' }
    });
    assert(badLoginRes.status === 401 && badLoginRes.data.success === false, 'POST /api/auth/login rejects wrong password');

    // 5. Auth /me
    const meRes = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(meRes.status === 200 && meRes.data.data.user.email === testEmail, 'GET /api/auth/me returns authenticated user details');

    // 6. Categories List
    const catsRes = await request('/api/categories');
    assert(catsRes.status === 200 && catsRes.data.success === true && Array.isArray(catsRes.data.data), 'GET /api/categories returns category hierarchy');

    // 7. Calculators List & Search
    const calcsRes = await request('/api/calculators');
    assert(calcsRes.status === 200 && calcsRes.data.success === true && Array.isArray(calcsRes.data.data.calculators), 'GET /api/calculators returns calculator catalog');

    const popularRes = await request('/api/calculators/popular');
    assert(popularRes.status === 200 && popularRes.data.success === true && Array.isArray(popularRes.data.data), 'GET /api/calculators/popular returns top calculators');

    // 8. Favorites
    const addFavRes = await request('/api/favorites', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: { calculator_slug: 'emi' }
    });
    assert(addFavRes.status === 200 && addFavRes.data.success === true, 'POST /api/favorites adds a favorite');

    const getFavsRes = await request('/api/favorites', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(getFavsRes.status === 200 && getFavsRes.data.data.includes('emi'), 'GET /api/favorites contains newly added favorite');

    const delFavRes = await request('/api/favorites/emi', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(delFavRes.status === 200 && delFavRes.data.success === true, 'DELETE /api/favorites/:slug removes favorite');

    // 9. Calculation History
    const addHistRes = await request('/api/history', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: {
        calcId: 'percentage',
        calcName: 'Percentage Calculator',
        expression: '20% of 500',
        result: '100',
        inputs: { percent: 20, value: 500 }
      }
    });
    assert(addHistRes.status === 201 && addHistRes.data.success === true, 'POST /api/history records calculation');

    const getHistRes = await request('/api/history', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(getHistRes.status === 200 && getHistRes.data.data.length > 0 && getHistRes.data.data[0].expression === '20% of 500', 'GET /api/history returns recorded calculations');

    // 10. User Settings
    const getSettingsRes = await request('/api/settings', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(getSettingsRes.status === 200 && getSettingsRes.data.data.currency === '₹', 'GET /api/settings returns user preferences');

    const putSettingsRes = await request('/api/settings', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userToken}` },
      body: { currency: '$', decimals: 3, theme: 'dark' }
    });
    assert(putSettingsRes.status === 200 && putSettingsRes.data.data.currency === '$' && putSettingsRes.data.data.decimals === 3, 'PUT /api/settings updates user preferences');

    // 11. Search
    const searchRes = await request('/api/search?q=percentage');
    assert(searchRes.status === 200 && searchRes.data.success === true && searchRes.data.data.total > 0, 'GET /api/search?q=percentage returns search matches');

    // 12. Analytics
    const analyticsRes = await request('/api/analytics/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: { event_type: 'calculator_opened', event_data: { calc: 'basic' } }
    });
    assert(analyticsRes.status === 200 && analyticsRes.data.success === true, 'POST /api/analytics/events logs analytics event');

    // 13. Admin Protection
    const userAdminRes = await request('/api/admin/stats', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(userAdminRes.status === 403, 'GET /api/admin/stats blocks regular users with 403 Forbidden');

  } catch (err) {
    console.error('Integration test exception:', err);
    failed++;
  } finally {
    server.close();
  }

  console.log('\n========================================');
  console.log(`API Integration Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  if (failed > 0) process.exit(1);
}

runTests();
