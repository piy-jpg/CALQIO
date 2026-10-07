import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'calqio_super_secret_jwt_key_2026_change_in_production';

/**
 * Verify JWT Token Middleware
 */
export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Fetch current user from DB
    const userRes = await query('SELECT id, email, name, avatar, role FROM users WHERE id = $1', [decoded.id]);
    
    if (userRes.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User session invalid. Please log in again.'
      });
    }

    req.user = userRes.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.'
    });
  }
}

/**
 * Optional Auth Middleware (Sets req.user if token is present and valid, otherwise proceeds as guest)
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userRes = await query('SELECT id, email, name, avatar, role FROM users WHERE id = $1', [decoded.id]);
    req.user = userRes.rows[0] || null;
  } catch (err) {
    req.user = null;
  }
  next();
}

/**
 * Require Admin Middleware
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required.'
    });
  }
  next();
}

/**
 * Generate JWT helper
 */
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}
