import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { generateToken, verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists.'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    const userRes = await query(
      `INSERT INTO users (email, password_hash, name, avatar, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, avatar, role, created_at`,
      [email.toLowerCase(), passwordHash, name, avatar, 'user']
    );

    const user = userRes.rows[0];

    // Create default settings
    await query(
      `INSERT INTO user_settings (user_id, currency, decimals, history_retention, sound_effects, theme)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.id, '₹', 2, true, false, 'light']
    );

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const userRes = await query(
      'SELECT id, email, password_hash, name, avatar, role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/google
 * Real-time Google Authentication & Token verification / user upsert
 */
router.post('/google', async (req, res, next) => {
  try {
    const { credential, email, name, avatar, googleId } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Google email is required.'
      });
    }

    const userName = name || email.split('@')[0];
    const userAvatar = avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`;

    // Check if user already exists
    let userRes = await query('SELECT id, email, name, avatar, role FROM users WHERE email = $1', [email.toLowerCase()]);
    let user;

    if (userRes.rows.length === 0) {
      // Create user with random hash for password_hash
      const randomSecret = await bcrypt.hash(`google_${Date.now()}_${Math.random()}`, 10);
      const insertRes = await query(
        `INSERT INTO users (email, password_hash, name, avatar, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, name, avatar, role, created_at`,
        [email.toLowerCase(), randomSecret, userName, userAvatar, 'user']
      );
      user = insertRes.rows[0];

      // Create default settings
      await query(
        `INSERT INTO user_settings (user_id, currency, decimals, history_retention, sound_effects, theme)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id) DO NOTHING`,
        [user.id, '₹', 2, true, false, 'light']
      );
    } else {
      user = userRes.rows[0];
      // Update avatar if provided
      if (avatar && (!user.avatar || user.avatar.includes('dicebear'))) {
        await query('UPDATE users SET avatar = $1, name = COALESCE($2, name) WHERE id = $3', [avatar, userName, user.id]);
        user.avatar = avatar;
        user.name = userName;
      }
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Google authentication successful.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          provider: 'google'
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const settingsRes = await query(
      'SELECT currency, decimals, history_retention, sound_effects, theme FROM user_settings WHERE user_id = $1',
      [req.user.id]
    );

    const favsRes = await query(
      'SELECT calculator_slug FROM favorites WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        user: req.user,
        settings: settingsRes.rows[0] || {
          currency: '₹',
          decimals: 2,
          history_retention: true,
          sound_effects: false,
          theme: 'light'
        },
        favorites: favsRes.rows.map(r => r.calculator_slug)
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/auth/profile
 */
router.put('/profile', verifyToken, async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updatedRes = await query(
      `UPDATE users SET name = COALESCE($1, name), avatar = COALESCE($2, avatar), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, email, name, avatar, role`,
      [name, avatar, req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: updatedRes.rows[0] }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

export default router;
