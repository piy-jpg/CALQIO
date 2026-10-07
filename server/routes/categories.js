import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

/**
 * GET /api/categories
 * Returns all top-level categories with sub-domains and calculator counts
 */
router.get('/', async (req, res, next) => {
  try {
    const catRes = await query('SELECT * FROM categories ORDER BY sort_order ASC');
    const domainRes = await query('SELECT * FROM domains ORDER BY sort_order ASC');
    const calcRes = await query('SELECT slug, category_slug, domain_slug, name, icon, popular_score FROM calculators WHERE is_active = true');

    const categories = catRes.rows.map(cat => {
      const domains = domainRes.rows.filter(d => d.category_slug === cat.slug);
      const calcs = calcRes.rows.filter(c => c.category_slug === cat.slug);
      return {
        ...cat,
        domainCount: domains.length,
        calculatorCount: calcs.length,
        domains: domains.map(d => ({
          ...d,
          calculators: calcs.filter(c => c.domain_slug === d.slug)
        }))
      };
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/categories/:slug
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const catRes = await query('SELECT * FROM categories WHERE slug = $1', [slug]);

    if (catRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Category '${slug}' not found.`
      });
    }

    const category = catRes.rows[0];
    const domainRes = await query('SELECT * FROM domains WHERE category_slug = $1 ORDER BY sort_order ASC', [slug]);
    const calcRes = await query('SELECT * FROM calculators WHERE category_slug = $1 AND is_active = true ORDER BY popular_score DESC', [slug]);

    category.domains = domainRes.rows.map(d => ({
      ...d,
      calculators: calcRes.rows.filter(c => c.domain_slug === d.slug)
    }));
    category.calculatorCount = calcRes.rows.length;

    res.json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
});

export default router;
