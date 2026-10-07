import express from 'express';
import { query } from '../config/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/analytics/events
 */
router.post('/events', optionalAuth, async (req, res, next) => {
  try {
    const { event_type, event_data } = req.body;

    if (!event_type) {
      return res.status(400).json({
        success: false,
        error: 'event_type is required.'
      });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    await query(
      `INSERT INTO analytics_events (user_id, event_type, event_data, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user ? req.user.id : null, event_type, JSON.stringify(event_data || {}), ip, userAgent]
    );

    res.json({
      success: true,
      message: 'Event logged successfully.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
