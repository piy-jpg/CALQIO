import express from 'express';
import { query } from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/settings
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const settingsRes = await query(
      'SELECT currency, decimals, history_retention, sound_effects, theme FROM user_settings WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      success: true,
      data: settingsRes.rows[0] || {
        currency: '₹',
        decimals: 2,
        historyRetention: true,
        soundEffects: false,
        theme: 'light'
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/settings
 */
router.put('/', verifyToken, async (req, res, next) => {
  try {
    const { currency, decimals, historyRetention, soundEffects, theme } = req.body;

    const updatedRes = await query(
      `UPDATE user_settings
       SET currency = COALESCE($1, currency),
           decimals = COALESCE($2, decimals),
           history_retention = COALESCE($3, history_retention),
           sound_effects = COALESCE($4, sound_effects),
           theme = COALESCE($5, theme),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $6
       RETURNING currency, decimals, history_retention AS "historyRetention", sound_effects AS "soundEffects", theme`,
      [currency, decimals, historyRetention, soundEffects, theme, req.user.id]
    );

    res.json({
      success: true,
      message: 'Settings updated successfully.',
      data: updatedRes.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

export default router;
