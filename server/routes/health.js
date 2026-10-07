import express from 'express';
import { query, isMockMode } from '../config/database.js';

const router = express.Router();
const START_TIME = Date.now();

/**
 * GET /api/health
 */
router.get('/', async (req, res) => {
  let dbStatus = 'healthy';
  try {
    await query('SELECT 1');
  } catch (err) {
    dbStatus = 'degraded';
  }

  res.json({
    success: true,
    data: {
      status: 'healthy',
      database: dbStatus,
      engine: isMockMode() ? 'in-memory-fallback' : 'postgresql',
      uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
