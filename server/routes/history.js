import express from 'express';
import { query } from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/history
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const historyRes = await query(
      'SELECT id, calculator_slug, calc_name, expression, result, inputs_json, created_at FROM calculation_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [req.user.id, limit]
    );

    res.json({
      success: true,
      data: historyRes.rows.map(r => ({
        id: r.id,
        calcId: r.calculator_slug,
        calcName: r.calc_name,
        expression: r.expression,
        result: r.result,
        inputs: typeof r.inputs_json === 'string' ? JSON.parse(r.inputs_json) : r.inputs_json,
        timestamp: new Date(r.created_at).getTime()
      }))
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/history
 */
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { calcId, calcName, expression, result, inputs } = req.body;

    if (!calcId || !expression) {
      return res.status(400).json({
        success: false,
        error: 'calcId and expression are required.'
      });
    }

    const newRes = await query(
      `INSERT INTO calculation_history (user_id, calculator_slug, calc_name, expression, result, inputs_json)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, calculator_slug, calc_name, expression, result, inputs_json, created_at`,
      [req.user.id, calcId, calcName || calcId, expression, result || '', JSON.stringify(inputs || {})]
    );

    const r = newRes.rows[0];

    res.status(201).json({
      success: true,
      message: 'Calculation history recorded.',
      data: {
        id: r.id,
        calcId: r.calculator_slug,
        calcName: r.calc_name,
        expression: r.expression,
        result: r.result,
        inputs: typeof r.inputs_json === 'string' ? JSON.parse(r.inputs_json) : r.inputs_json,
        timestamp: new Date(r.created_at).getTime()
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/history/:id
 */
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await query(
      'DELETE FROM calculation_history WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    res.json({
      success: true,
      message: 'History item removed.',
      data: { id }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/history (Clear all)
 */
router.delete('/', verifyToken, async (req, res, next) => {
  try {
    await query('DELETE FROM calculation_history WHERE user_id = $1', [req.user.id]);
    res.json({
      success: true,
      message: 'Calculation history cleared successfully.'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/history/sync
 * Batch sync guest history items
 */
router.post('/sync', verifyToken, async (req, res, next) => {
  try {
    const { history } = req.body;
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.calcId && item.expression) {
          await query(
            `INSERT INTO calculation_history (user_id, calculator_slug, calc_name, expression, result, inputs_json)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              req.user.id,
              item.calcId,
              item.calcName || item.calcId,
              item.expression,
              item.result || '',
              JSON.stringify(item.inputs || {})
            ]
          );
        }
      }
    }

    const updatedRes = await query(
      'SELECT id, calculator_slug, calc_name, expression, result, inputs_json, created_at FROM calculation_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'History synchronized successfully.',
      data: updatedRes.rows.map(r => ({
        id: r.id,
        calcId: r.calculator_slug,
        calcName: r.calc_name,
        expression: r.expression,
        result: r.result,
        inputs: typeof r.inputs_json === 'string' ? JSON.parse(r.inputs_json) : r.inputs_json,
        timestamp: new Date(r.created_at).getTime()
      }))
    });
  } catch (err) {
    next(err);
  }
});

export default router;
