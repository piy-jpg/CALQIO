import bcrypt from 'bcryptjs';
import { initDatabase, query } from '../config/database.js';
import { TOP_LEVEL_CATEGORIES, MASTER_TAXONOMY, getParentCategoryForDomain } from '../../js/taxonomy.js';

async function seed() {
  console.log('--- CALQIO Database Seeder Starting ---');
  await initDatabase();

  // 1. Seed Categories (14 Top-Level Categories)
  console.log('Seeding Top-Level Categories...');
  let order = 1;
  for (const [key, cat] of Object.entries(TOP_LEVEL_CATEGORIES)) {
    const slug = cat.slug || key;
    await query(
      `INSERT INTO categories (slug, name, icon, description, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO UPDATE SET name = $2, icon = $3, description = $4, sort_order = $5`,
      [slug, cat.name, cat.icon || 'grid', cat.description || '', order++]
    );
  }
  console.log(` Seeded ${Object.keys(TOP_LEVEL_CATEGORIES).length} top-level categories.`);

  // 2. Seed Domains / Subcategories (42 Domains)
  console.log('Seeding 42 Domains...');
  let domainOrder = 1;
  for (const [key, domain] of Object.entries(MASTER_TAXONOMY)) {
    const slug = domain.id || key;
    const parentCatSlug = getParentCategoryForDomain(slug);
    await query(
      `INSERT INTO domains (slug, category_slug, name, icon, description, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (slug) DO UPDATE SET category_slug = $2, name = $3, icon = $4, description = $5, sort_order = $6`,
      [slug, parentCatSlug, domain.name, domain.icon || 'grid', domain.description || '', domainOrder++]
    );
  }
  console.log(` Seeded ${Object.keys(MASTER_TAXONOMY).length} domains.`);

  // 3. Seed Calculators Catalog
  console.log('Seeding Calculators Catalog...');
  const seededCalcs = new Set();
  
  for (const [domainKey, domain] of Object.entries(MASTER_TAXONOMY)) {
    const parentCatSlug = getParentCategoryForDomain(domainKey);
    
    if (domain.subcategories) {
      for (const sub of domain.subcategories) {
        if (sub.items) {
          for (const calcSlug of sub.items) {
            if (!seededCalcs.has(calcSlug)) {
              seededCalcs.add(calcSlug);
              const formattedName = calcSlug
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

              await query(
                `INSERT INTO calculators (slug, category_slug, domain_slug, name, description, icon, tags, popular_score)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (slug) DO UPDATE SET category_slug = $2, domain_slug = $3, name = $4, description = $5, icon = $6, tags = $7`,
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
  console.log(` Seeded ${seededCalcs.size} calculators into catalog.`);

  // 4. Seed Demo Users
  console.log('Seeding Default Users...');
  const adminHash = await bcrypt.hash('admin123', 10);
  const demoHash = await bcrypt.hash('demo123', 10);

  // Admin User
  const adminRes = await query(
    `INSERT INTO users (email, password_hash, name, avatar, role)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE SET name = $3, role = $5
     RETURNING id, email`,
    ['admin@calqio.com', adminHash, 'CALQIO Admin', 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin', 'admin']
  );
  const adminId = adminRes.rows[0]?.id || 1;

  // Demo Standard User
  const demoRes = await query(
    `INSERT INTO users (email, password_hash, name, avatar, role)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE SET name = $3, role = $5
     RETURNING id, email`,
    ['demo@calqio.com', demoHash, 'Demo User', 'https://api.dicebear.com/7.x/bottts/svg?seed=Demo', 'user']
  );
  const demoId = demoRes.rows[0]?.id || 2;

  // 5. Seed User Settings
  await query(
    `INSERT INTO user_settings (user_id, currency, decimals, history_retention, sound_effects, theme)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id) DO NOTHING`,
    [adminId, '₹', 2, true, false, 'light']
  );

  await query(
    `INSERT INTO user_settings (user_id, currency, decimals, history_retention, sound_effects, theme)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id) DO NOTHING`,
    [demoId, '₹', 2, true, false, 'light']
  );

  // 6. Seed Default Favorites for Demo User
  for (const fav of ['basic', 'percentage', 'emi', 'bmi', 'gst', 'age']) {
    await query(
      `INSERT INTO favorites (user_id, calculator_slug)
       VALUES ($1, $2)
       ON CONFLICT (user_id, calculator_slug) DO NOTHING`,
      [demoId, fav]
    );
  }

  // 7. Seed Demo Calculation History
  await query(
    `INSERT INTO calculation_history (user_id, calculator_slug, calc_name, expression, result, inputs_json)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [demoId, 'percentage', 'Percentage Calculator', '15% of 2500', '375', JSON.stringify({ percent: 15, value: 2500 })]
  );
  await query(
    `INSERT INTO calculation_history (user_id, calculator_slug, calc_name, expression, result, inputs_json)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [demoId, 'emi', 'EMI Calculator', '₹5,00,000 @ 8.5% for 5 yrs', '₹10,258 / mo', JSON.stringify({ principal: 500000, rate: 8.5, tenure: 5 })]
  );

  console.log('--- CALQIO Database Seeding Completed Successfully ---');
}

// Run seeder if executed directly
seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
