import express from 'express';
import { query } from '../config/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/search?q=
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim().toLowerCase();

    if (!q) {
      return res.json({
        success: true,
        data: {
          categories: [],
          domains: [],
          calculators: []
        }
      });
    }

    // 1. Search Categories
    const catRes = await query('SELECT slug, name, icon, description FROM categories');
    const matchedCats = catRes.rows.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );

    // 2. Search Domains
    const domRes = await query('SELECT slug, category_slug, name, icon, description FROM domains');
    const matchedDoms = domRes.rows.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.slug.toLowerCase().includes(q) ||
      (d.description && d.description.toLowerCase().includes(q))
    );

    // 3. Search Calculators
    const calcRes = await query('SELECT slug, category_slug, domain_slug, name, icon, description, tags, popular_score FROM calculators WHERE is_active = true');
    const matchedCalcs = calcRes.rows.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (Array.isArray(c.tags) && c.tags.some(t => t.toLowerCase().includes(q)))
    ).sort((a, b) => b.popular_score - a.popular_score);

    // Track search query
    try {
      await query(
        'INSERT INTO search_history (user_id, query, results_count) VALUES ($1, $2, $3)',
        [req.user ? req.user.id : null, q, matchedCalcs.length]
      );
    } catch (e) {
      // Non-blocking error
    }

    res.json({
      success: true,
      data: {
        query: q,
        total: matchedCats.length + matchedDoms.length + matchedCalcs.length,
        categories: matchedCats,
        domains: matchedDoms,
        calculators: matchedCalcs
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
