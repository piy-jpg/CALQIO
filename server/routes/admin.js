import express from 'express';
import { query } from '../config/database.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/admin/stats
 */
router.get('/stats', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const usersCount = (await query('SELECT id FROM users')).rows.length;
    const calcsCount = (await query('SELECT id FROM calculators')).rows.length;
    const catsCount = (await query('SELECT id FROM categories')).rows.length;
    const historyCount = (await query('SELECT id FROM calculation_history')).rows.length;

    res.json({
      success: true,
      data: {
        totalUsers: usersCount,
        totalCalculators: calcsCount,
        totalCategories: catsCount,
        totalCalculationsPerformed: historyCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/users
 */
router.get('/users', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const usersRes = await query('SELECT id, email, name, avatar, role, created_at FROM users ORDER BY created_at DESC');
    res.json({
      success: true,
      data: usersRes.rows
    });
  } catch (err) {
    next(err);
  }
});

export default router;
