import dotenv from 'dotenv';
import { createApp } from './app.js';
import { initDatabase, query } from './config/database.js';
import { TOP_LEVEL_CATEGORIES, MASTER_TAXONOMY, getParentCategoryForDomain } from '../js/taxonomy.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const PORT = process.env.PORT || 3000;
const ALT_PORTS = [3000, 8080];

async function ensureSeedData() {
  try {
    const catsRes = await query('SELECT id FROM categories LIMIT 1');
    if (catsRes.rows.length === 0) {
      console.log(' [DB] Categories empty. Auto-seeding catalog...');
      
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

      const adminHash = await bcrypt.hash('admin123', 10);
      const demoHash = await bcrypt.hash('demo123', 10);

      const adminRes = await query(
        `INSERT INTO users (email, password_hash, name, avatar, role)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        ['admin@calqio.com', adminHash, 'CALQIO Admin', 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin', 'admin']
      );
      const adminId = adminRes.rows[0]?.id || 1;

      const demoRes = await query(
        `INSERT INTO users (email, password_hash, name, avatar, role)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        ['demo@calqio.com', demoHash, 'Demo User', 'https://api.dicebear.com/7.x/bottts/svg?seed=Demo', 'user']
      );
      const demoId = demoRes.rows[0]?.id || 2;

      await query(
        `INSERT INTO user_settings (user_id, currency, decimals, history_retention, sound_effects, theme)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [adminId, '₹', 2, true, false, 'light']
      );
      await query(
        `INSERT INTO user_settings (user_id, currency, decimals, history_retention, sound_effects, theme)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [demoId, '₹', 2, true, false, 'light']
      );

      for (const fav of ['basic', 'percentage', 'emi', 'bmi', 'gst', 'age']) {
        await query('INSERT INTO favorites (user_id, calculator_slug) VALUES ($1, $2)', [demoId, fav]);
      }

      console.log(' [DB] Auto-seeding completed.');
    }
  } catch (err) {
    console.error(' [DB] Auto-seeding error:', err.message);
  }
}

export async function startServer() {
  await initDatabase();
  await ensureSeedData();

  const app = createApp();

  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(` CALQIO Full-Stack Server running at: http://localhost:${port}/`);
    console.log(` REST API available at: http://localhost:${port}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const altPort = 8080;
      console.warn(` [Server] Port ${port} in use, trying port ${altPort}...`);
      app.listen(altPort, () => {
        console.log(` CALQIO Full-Stack Server running at: http://localhost:${altPort}/`);
        console.log(` REST API available at: http://localhost:${altPort}/api/health`);
      });
    } else {
      console.error(` [Server] Error:`, err.message);
    }
  });
}

// Start if invoked directly
startServer().catch(err => {
  console.error('Fatal Server Startup Error:', err);
});
