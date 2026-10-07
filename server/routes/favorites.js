import express from 'express';
import { query } from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/favorites
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const favsRes = await query(
      'SELECT calculator_slug, created_at FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      data: favsRes.rows.map(r => r.calculator_slug)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/favorites
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
      `INSERT INTO favorites (user_id, calculator_slug)
       VALUES ($1, $2)
       ON CONFLICT (user_id, calculator_slug) DO NOTHING`,
      [req.user.id, calculator_slug]
    );

    res.json({
      success: true,
      message: 'Favorite added successfully.',
      data: { calculator_slug }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/favorites/:slug
 */
router.delete('/:slug', verifyToken, async (req, res, next) => {
  try {
    const { slug } = req.params;
    await query(
      'DELETE FROM favorites WHERE user_id = $1 AND calculator_slug = $2',
      [req.user.id, slug]
    );

    res.json({
      success: true,
      message: 'Favorite removed successfully.',
      data: { calculator_slug: slug }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/favorites/sync
 * Batch sync guest favorites with user account
 */
router.post('/sync', verifyToken, async (req, res, next) => {
  try {
    const { favorites } = req.body;
    if (Array.isArray(favorites)) {
      for (const slug of favorites) {
        if (typeof slug === 'string' && slug.trim()) {
          await query(
            `INSERT INTO favorites (user_id, calculator_slug)
             VALUES ($1, $2)
             ON CONFLICT (user_id, calculator_slug) DO NOTHING`,
            [req.user.id, slug.trim()]
          );
        }
      }
    }

    const updatedRes = await query(
      'SELECT calculator_slug FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Favorites synced successfully.',
      data: updatedRes.rows.map(r => r.calculator_slug)
    });
  } catch (err) {
    next(err);
  }
});

export default router;
