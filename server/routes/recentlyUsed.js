import express from 'express';
import { query } from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/recently-used
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const recentsRes = await query(
      'SELECT calculator_slug, last_used_at, usage_count FROM recently_used WHERE user_id = $1 ORDER BY last_used_at DESC LIMIT 8',
      [req.user.id]
    );

    res.json({
      success: true,
      data: recentsRes.rows.map(r => r.calculator_slug)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/recently-used
 */
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { calculator_slug } = req.body;
    if (!calculator_slug) {
      return res.status(400).json({
        success: false,
        error: 'calculator_slug is required.'
      });
    }

    await query(
      `INSERT INTO recently_used (user_id, calculator_slug, usage_count, last_used_at)
       VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, calculator_slug)
       DO UPDATE SET usage_count = recently_used.usage_count + 1, last_used_at = CURRENT_TIMESTAMP`,
      [req.user.id, calculator_slug]
    );

    res.json({
      success: true,
      data: { calculator_slug }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
