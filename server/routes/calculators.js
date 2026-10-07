import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

/**
 * GET /api/calculators
 * Query params: q (search), category, domain, tag, limit, offset
 */
router.get('/', async (req, res, next) => {
  try {
    const { q, category, domain, limit = 100, offset = 0 } = req.query;

    let calcsRes = await query('SELECT * FROM calculators WHERE is_active = true ORDER BY popular_score DESC');
    let calcs = calcsRes.rows;

    if (category) {
      calcs = calcs.filter(c => c.category_slug === category);
    }
    if (domain) {
      calcs = calcs.filter(c => c.domain_slug === domain);
    }
    if (q) {
      const term = q.toLowerCase();
      calcs = calcs.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.slug.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term))
      );
    }

    const total = calcs.length;
    const paginated = calcs.slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      success: true,
      data: {
        total,
        calculators: paginated
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/calculators/popular
 */
router.get('/popular', async (req, res, next) => {
  try {
    const calcsRes = await query('SELECT * FROM calculators WHERE is_active = true ORDER BY popular_score DESC LIMIT 12');
    res.json({
      success: true,
      data: calcsRes.rows
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/calculators/category/:slug
 */
router.get('/category/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const calcsRes = await query('SELECT * FROM calculators WHERE category_slug = $1 AND is_active = true ORDER BY popular_score DESC', [slug]);

    res.json({
      success: true,
      data: calcsRes.rows
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/calculators/:slug
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const calcRes = await query('SELECT * FROM calculators WHERE slug = $1', [slug]);

    if (calcRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Calculator '${slug}' not found.`
      });
    }

    res.json({
      success: true,
      data: calcRes.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

export default router;
